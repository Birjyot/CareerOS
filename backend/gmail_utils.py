"""
gmail_utils.py — CareerOS  (rewrite: no per-email AI calls)

Changes vs previous version:
  - Removed per-email AI extraction → replaced with fast regex rules.
    The old version made up to 15 AI API calls per sync which caused
    Render's free dyno to time-out mid-request (the real "CORS" crash).
  - Expanded keyword search to catch direct-company application emails
    (not just LinkedIn / Internshala).
  - Hard cap of MAX_EMAILS=10 so the sync always finishes in < 5 s.
  - get_gmail_service() signature unchanged: returns (service, updated_json|None).
"""

import json
import re
import base64
import traceback
from datetime import datetime
from email.utils import parsedate_to_datetime

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
MAX_EMAILS = 10

# ── Gmail search query ────────────────────────────────────────────────────────
# Broad enough to catch job-board emails AND direct-company emails.
GMAIL_QUERY = (
    'subject:('
    '"application received" OR "thank you for applying" OR '
    '"application submitted" OR "your application" OR '
    '"interview invitation" OR "interview request" OR "interview scheduled" OR '
    '"next steps" OR "moving forward" OR '
    '"job offer" OR "offer letter" OR "congratulations" OR '
    '"unfortunately" OR "not selected" OR "not moving forward" OR '
    '"screening" OR "shortlisted" OR "assessment" OR "test link" OR '
    '"applied" OR "hiring" OR "trainee" OR "internship"'
    ')'
)

# ── Status inference rules (checked in order — first match wins) ──────────────
_STATUS_RULES = [
    (re.compile(
        r'\b(offer letter|job offer|we are pleased|pleased to offer|'
        r'congratulations.*select|selected for the role|you have been selected)\b', re.I),
     'Offer'),
    (re.compile(
        r'\b(interview|schedule.*call|technical round|assessment|test link|'
        r'coding round|hiring manager|next round)\b', re.I),
     'Interview'),
    (re.compile(
        r'\b(screening|shortlisted|under review|profile.*shortlisted|'
        r'next steps|reviewing your application|in consideration)\b', re.I),
     'Screening'),
    (re.compile(
        r'\b(unfortunately|regret|not.*selected|not moving forward|'
        r'other candidates|will not be moving|no longer considering)\b', re.I),
     'Rejected'),
]

def _infer_status(text: str) -> str:
    for pattern, status in _STATUS_RULES:
        if pattern.search(text):
            return status
    return 'Applied'


# ── Company + role extraction ─────────────────────────────────────────────────

def _clean(s: str) -> str:
    return re.sub(r'\s+', ' ', s).strip()

def _extract_company_role(subject: str, sender: str, snippet: str):
    """Best-effort extraction — returns (company, role) strings."""
    company = ''
    role    = ''

    # Pattern: "role at company" or "role @ company"
    m = re.search(r'(.+?)\s+(?:at|@)\s+(.+)', subject, re.I)
    if m:
        role    = _clean(m.group(1))
        company = _clean(m.group(2))
        return company, role

    # Pattern: "application for <role>"
    m = re.search(
        r'(?:application for|applying for|position[:\s]+|role[:\s]+|job[:\s]+)\s*([^|\-–\n]{3,60})',
        subject, re.I
    )
    if m:
        role = _clean(m.group(1))

    # Company from sender display name e.g. "ACME Corp <hr@acme.com>"
    m = re.match(r'^"?([^<"]{2,50})"?\s*<', sender)
    if m:
        raw = _clean(m.group(1))
        generic = re.compile(
            r'\b(careers|recruiting|talent|hr|jobs|noreply|no-reply|'
            r'notifications|team|hiring|donotreply)\b', re.I
        )
        if not generic.search(raw):
            company = raw

    # Fallback: company from email domain
    if not company:
        m = re.search(r'@([\w.-]+\.[a-z]{2,})', sender)
        if m:
            domain = m.group(1).lower()
            noise  = {'gmail.com','yahoo.com','outlook.com','hotmail.com',
                      'sendgrid.net','amazonses.com','mailgun.org','noreply.com'}
            if domain not in noise:
                company = domain.split('.')[0].title()

    # Last resort: first capitalised word in subject
    if not company:
        caps = re.findall(r'\b[A-Z][a-zA-Z]{2,}\b', subject)
        skip = {'Subject','Application','Interview','Offer','Thank','Your',
                'We','Hi','Hello','Dear','Please','Update','New'}
        for c in caps:
            if c not in skip:
                company = c
                break

    # Role fallback: use subject itself (truncated)
    if not role:
        role = subject[:80].strip()

    return company, role


# ── Date parsing ──────────────────────────────────────────────────────────────

def _parse_date(raw: str) -> str:
    if not raw:
        return datetime.utcnow().strftime('%Y-%m-%d')
    try:
        dt = parsedate_to_datetime(raw)
        return dt.strftime('%Y-%m-%d')
    except Exception:
        return datetime.utcnow().strftime('%Y-%m-%d')


# ══════════════════════════════════════════════════════════════════════════════
# Public API
# ══════════════════════════════════════════════════════════════════════════════

def get_gmail_service(creds_json: str):
    """
    Build an authenticated Gmail service from stored JSON credentials.

    Returns (service, updated_creds_json | None).
    Raises RuntimeError on any auth failure.
    """
    print('[GmailService] Loading credentials from DB...')
    if not creds_json:
        raise RuntimeError('No Gmail credentials stored for this user.')

    try:
        creds_data = json.loads(creds_json)
    except Exception as e:
        raise RuntimeError(f'Stored Gmail credentials are malformed JSON: {e}')

    try:
        creds = Credentials.from_authorized_user_info(creds_data)
    except Exception as e:
        raise RuntimeError(f'Failed to load Gmail credentials object: {e}')

    updated_creds_json = None

    if not creds.valid:
        if creds.expired and creds.refresh_token:
            try:
                print('[GmailService] Token expired — refreshing...')
                creds.refresh(Request())
                print('[GmailService] Token refreshed successfully.')
                updated_creds_json = creds.to_json()
            except Exception as e:
                raise RuntimeError(f'Token refresh failed (re-auth needed): {e}')
        else:
            raise RuntimeError(
                'Token invalid and no refresh_token available. User must re-authenticate.'
            )

    service = build('gmail', 'v1', credentials=creds)
    print('[GmailService] Gmail service ready.')
    return service, updated_creds_json


def sync_job_emails(service) -> list:
    """
    Search Gmail for job emails and return structured dicts — NO AI calls.

    Each dict has keys: company, role, status, date, source
    """
    print('[GmailSync] Starting email search...')
    extracted = []

    try:
        resp = (
            service.users().messages()
            .list(userId='me', q=GMAIL_QUERY, maxResults=MAX_EMAILS)
            .execute()
        )
    except Exception as e:
        print(f'[GmailSync] Gmail API list() failed: {e}')
        traceback.print_exc()
        return []

    messages = resp.get('messages', [])
    print(f'[GmailSync] {len(messages)} candidate email(s) found.')

    if not messages:
        return []

    for msg_meta in messages:
        msg_id = msg_meta.get('id', '?')
        try:
            msg = (
                service.users().messages()
                .get(
                    userId='me', id=msg_id,
                    format='metadata',
                    metadataHeaders=['Subject', 'From', 'Date']
                )
                .execute()
            )

            headers = {
                h['name'].lower(): h['value']
                for h in msg.get('payload', {}).get('headers', [])
            }
            subject = headers.get('subject', '')
            sender  = headers.get('from',    '')
            date    = headers.get('date',    '')
            snippet = msg.get('snippet', '')

            combined = f'{subject} {snippet}'

            company, role = _extract_company_role(subject, sender, snippet)
            status        = _infer_status(combined)
            parsed_date   = _parse_date(date)

            if not company and not role:
                print(f'[GmailSync] Could not extract data from email {msg_id} — skipping.')
                continue

            extracted.append({
                'company': company,
                'role':    role,
                'status':  status,
                'date':    parsed_date,
                'source':  'Gmail',
            })
            print(f'[GmailSync] ✓ {company!r} | {role!r} | {status}')

        except Exception as e:
            print(f'[GmailSync] Error on email {msg_id}: {e}')
            traceback.print_exc()
            continue

    print(f'[GmailSync] Done — {len(extracted)} job(s) extracted.')
    return extracted