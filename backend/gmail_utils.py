"""
gmail_utils.py — Production-hardened Gmail integration for CareerOS.

Key changes vs original:
  - get_gmail_service() returns (service, updated_creds_json_or_None)
    so callers can persist refreshed tokens back to the DB.
  - sync_job_emails() wraps each email in its own try/except so one
    malformed message never aborts the entire sync loop.
  - Full [DEBUG] logging at every stage.
"""

import os
import json
import traceback
import base64
from datetime import datetime

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from backend.ai_router import ai_router, TaskType
from backend.text_utils import build_gmail_extract_prompt

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']


# ─────────────────────────────────────────────────────────────────────────────
# Service builder
# ─────────────────────────────────────────────────────────────────────────────

def get_gmail_service(creds_json: str):
    """
    PRODUCTION: Build a Gmail service from stored JSON credentials (from DB).

    Returns:
        (service, updated_creds_json)
            service            — ready-to-use Gmail API client
            updated_creds_json — refreshed JSON string if the token was
                                 refreshed, else None (caller should persist
                                 updated_creds_json when it is not None)

    Raises:
        RuntimeError with a descriptive message on any auth failure so the
        caller can clear stored credentials and ask the user to re-auth.
    """
    print("[GmailService] Loading credentials from DB...")

    if not creds_json:
        raise RuntimeError("No Gmail credentials stored for this user.")

    try:
        creds_data = json.loads(creds_json)
    except Exception as e:
        raise RuntimeError(f"Stored Gmail credentials are malformed JSON: {e}")

    try:
        # Don't pass scopes here — let it use whatever scopes were granted
        # during OAuth.  Passing mismatched scopes raises an error even with
        # perfectly valid tokens.
        creds = Credentials.from_authorized_user_info(creds_data)
    except Exception as e:
        raise RuntimeError(f"Failed to load Gmail credentials object: {e}")

    updated_creds_json = None  # will be set if we refresh

    if not creds.valid:
        if creds.expired and creds.refresh_token:
            try:
                print("[GmailService] Token expired — refreshing...")
                creds.refresh(Request())
                print("[GmailService] Token refreshed successfully.")
                # Serialize the new token so the caller can persist it
                updated_creds_json = creds.to_json()
            except Exception as e:
                err_str = str(e)
                print(f"[GmailService] Token refresh FAILED: {err_str}")
                raise RuntimeError(
                    f"Token refresh failed (user needs to re-auth): {err_str}"
                )
        else:
            raise RuntimeError(
                "Token is invalid and no refresh_token is available. "
                "User must re-authenticate."
            )

    try:
        print("[GmailService] Building Gmail API client...")
        service = build('gmail', 'v1', credentials=creds)
        print("[GmailService] Gmail service created successfully.")
        return service, updated_creds_json
    except Exception as e:
        raise RuntimeError(f"Failed to build Gmail API service: {e}")


# ─────────────────────────────────────────────────────────────────────────────
# Email sync
# ─────────────────────────────────────────────────────────────────────────────

def sync_job_emails(service):
    """
    Search Gmail for job-related emails and extract structured job data via AI.

    Each email is processed in its own try/except block.  A single malformed
    or unparseable email is logged and skipped; it does NOT abort the loop.

    Returns:
        list[dict] — extracted job records (may be empty)
    """
    # Broad query: any email whose subject suggests a job application event.
    # We intentionally remove the from: filter so confirmation emails from
    # company-owned domains (e.g. noreply@acmecorp.com) are also captured.
    query = (
        "subject:(\"application received\" OR \"thank you for applying\" OR "
        "\"application submitted\" OR \"we received your application\" OR "
        "\"your application\" OR \"next steps\" OR \"interview invitation\" OR "
        "\"interview request\" OR \"job offer\" OR \"offer letter\" OR "
        "\"unfortunately\" OR \"not moving forward\" OR applied OR screening)"
    )

    print(f"[GmailSync] Executing Gmail search query...")
    try:
        results = service.users().messages().list(
            userId='me', q=query, maxResults=15  # slightly higher cap for broader query
        ).execute()
    except Exception as e:
        print(f"[GmailSync] Gmail API list() call failed: {e}")
        traceback.print_exc()
        return []

    messages = results.get('messages', [])
    print(f"[GmailSync] Found {len(messages)} candidate emails.")

    if not messages:
        print("[GmailSync] No matching emails found.")
        return []

    extracted_jobs = []

    for msg in messages:
        msg_id = msg.get('id', 'unknown')
        try:
            print(f"[GmailSync] Fetching email id={msg_id}...")
            # Use 'full' format so we get both subject headers AND a richer snippet
            msg_data = service.users().messages().get(
                userId='me', id=msg_id, format='full',
                metadataHeaders=['Subject', 'From', 'Date']
            ).execute()
            snippet = msg_data.get('snippet', '').strip()

            # Also pull the Subject header to give the AI more context
            headers = msg_data.get('payload', {}).get('headers', [])
            subject = next((h['value'] for h in headers if h['name'].lower() == 'subject'), '')
            sender  = next((h['value'] for h in headers if h['name'].lower() == 'from'), '')
            if subject:
                snippet = f"Subject: {subject}\nFrom: {sender}\n\n{snippet}"

            if not snippet:
                print(f"[GmailSync] Email {msg_id} has empty snippet — skipping.")
                continue

            print(f"[GmailSync] Extracting job data from email {msg_id}...")
            prompt = build_gmail_extract_prompt(snippet)
            result = ai_router.generate_json(prompt, task_type=TaskType.GMAIL_EXTRACT)

            if not result.get('success') or not result.get('data'):
                print(f"[GmailSync] AI extraction returned no data for {msg_id} — skipping.")
                continue

            job_data = result['data']
            job_data['source']  = 'Gmail'
            job_data['msg_id']  = msg_id
            extracted_jobs.append(job_data)
            print(
                f"[GmailSync] Extracted: company={job_data.get('company')!r} "
                f"role={job_data.get('role')!r} status={job_data.get('status')!r}"
            )

        except Exception as e:
            print(f"[GmailSync] ERROR processing email {msg_id}: {e}")
            traceback.print_exc()
            # Continue with the next email — do NOT re-raise

    print(f"[GmailSync] Extraction complete. {len(extracted_jobs)} job(s) extracted.")
    return extracted_jobs
