from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
from models import db, JobApplication, User, AICache, ShortLink
from datetime import datetime
import json
import os
import random
import string
from dotenv import load_dotenv

load_dotenv()

# ── Backend modules ─────────────────────────────────────────────────────────
from backend.parsing_utils import parse_job_url
from backend.ai_router import ai_router, TaskType
from backend.gmail_utils import sync_job_emails, get_gmail_service
import threading
from backend.cache_utils import make_cache_key, get_cached, set_cache, cache_stats
from backend.text_utils import (
    build_ats_prompt, build_cover_letter_prompt,
    build_interview_prompt, build_suggestions_prompt,
    summarize_jobs_for_prompt, clean_text
)
from backend.file_parser import parse_uploaded_file

# ── App setup ────────────────────────────────────────────────────────────────
app = Flask(__name__)

# ── CORS — must be initialised BEFORE any route registration ─────────────────
_ALLOWED_ORIGINS = [
    "https://careeros-1-h6vm.onrender.com",
    "http://localhost:3000",
]
CORS(
    app,
    resources={r"/api/*": {"origins": _ALLOWED_ORIGINS}},
    supports_credentials=True,
    allow_headers=[
        "Content-Type",
        "Authorization",
        "X-User-Email"
    ],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

app.add_url_rule('/api/jobs/parse', view_func=parse_job_url, methods=['POST'])

database_url = os.environ.get("DATABASE_URL", "sqlite:///jobs.db")
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()


# ── Auth helpers ─────────────────────────────────────────────────────────────
def get_user_id():
    return request.headers.get('X-User-Email', '')

def get_or_create_user(email):
    if not email:
        return None
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(email=email)
        db.session.add(user)
        db.session.commit()
    return user


# ── CORS helper — injects headers on every response including crashes ─────────
def _make_cors_response(data: dict, status: int = 200):
    """
    Build a JSON response that always carries CORS headers.
    Use this inside every route that might crash mid-request (e.g. Gmail sync)
    so Render's proxy never strips the headers and the browser sees real JSON
    instead of 'Failed to fetch'.
    """
    resp   = jsonify(data)
    origin = request.headers.get("Origin", "")
    if origin in _ALLOWED_ORIGINS:
        resp.headers["Access-Control-Allow-Origin"]      = origin
        resp.headers["Access-Control-Allow-Credentials"] = "true"
    return resp, status


# ══════════════════════════════════════════════════════════════════════════════
# BASIC ROUTES
# ══════════════════════════════════════════════════════════════════════════════

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'CareerOS API', 'version': '3.0', 'status': 'running'})


# ── Contact form endpoint ────────────────────────────────────────────────────
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

_CONTACT_RECIPIENTS = [
    "birjyotsahiwal7@gmail.com",
    "tejasavsingh54@gmail.com",
    "vs330999@gmail.com",
]

def _contact_cors(response, status=200):
    """Inject CORS headers directly on every contact response so they survive even if Render's proxy intercepts."""
    origin = request.headers.get("Origin", "")
    if origin in _ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"]      = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"]     = "Content-Type, Authorization, X-User-Email"
    return response, status


@app.route('/api/contact', methods=['OPTIONS'])
def handle_contact_preflight():
    """Explicit preflight handler — flask-cors sometimes misses this on error paths."""
    origin = request.headers.get("Origin", "")
    resp   = app.make_default_options_response()
    if origin in _ALLOWED_ORIGINS:
        resp.headers["Access-Control-Allow-Origin"]      = origin
        resp.headers["Access-Control-Allow-Credentials"] = "true"
        resp.headers["Access-Control-Allow-Headers"]     = "Content-Type, Authorization, X-User-Email"
        resp.headers["Access-Control-Allow-Methods"]     = "POST, OPTIONS"
    return resp


@app.route('/api/contact', methods=['POST'])
def handle_contact():
    """
    Receives a contact-form submission and emails all three developers.

    Requires two env vars:
      SMTP_EMAIL    – the Gmail address to send FROM
      SMTP_PASSWORD – a Gmail App Password (NOT the regular password)

    To create an App Password: Google Account → Security → 2-Step Verification
    → App Passwords → Generate.
    """
    data = request.get_json(silent=True) or {}

    name    = (data.get('name') or '').strip()
    email   = (data.get('email') or '').strip()
    subject = (data.get('subject') or '').strip()
    message = (data.get('message') or '').strip()

    # ── Validation ────────────────────────────────────────────────────────
    if not name or not email or not subject or len(message) < 20:
        return _contact_cors(
            jsonify({"error": "All fields are required and message must be ≥ 20 chars."}),
            400
        )

    resend_api_key = os.environ.get("RESEND_API_KEY", "")
    smtp_email    = os.environ.get("SMTP_EMAIL", "")
    smtp_password = os.environ.get("SMTP_PASSWORD", "")

    if not resend_api_key and (not smtp_email or not smtp_password):
        # If neither email method is configured, log locally and respond
        print("[CONTACT] Email service not configured – logging message locally.")
        print(f"  From: {name} <{email}>")
        print(f"  Subject: [CareerOS Contact] {subject}")
        print(f"  Message: {message[:200]}...")
        return _contact_cors(
            jsonify({"status": "ok", "note": "Email not configured; message logged on server."}),
            200
        )

    plain = (
        f"New contact form submission from CareerOS\n"
        f"{'─' * 48}\n\n"
        f"Name:    {name}\n"
        f"Email:   {email}\n"
        f"Subject: {subject}\n\n"
        f"Message:\n{message}\n"
    )

    html = f"""
    <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#050814;color:#fff;border-radius:16px;">
      <h2 style="margin:0 0 4px 0;font-size:20px;color:#fff;">New Contact Form Submission</h2>
      <p style="margin:0 0 24px 0;font-size:13px;color:rgba(255,255,255,0.4);">via CareerOS Contact Page</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);font-size:13px;width:80px;">Name</td><td style="padding:8px 0;color:#fff;font-size:14px;font-weight:600;">{name}</td></tr>
        <tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);font-size:13px;">Email</td><td style="padding:8px 0;color:#60a5fa;font-size:14px;"><a href="mailto:{email}" style="color:#60a5fa;text-decoration:none;">{email}</a></td></tr>
        <tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);font-size:13px;">Subject</td><td style="padding:8px 0;color:#fff;font-size:14px;">{subject}</td></tr>
      </table>
      <div style="padding:20px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
        <p style="margin:0;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.8);white-space:pre-wrap;">{message}</p>
      </div>
      <p style="margin-top:24px;font-size:11px;color:rgba(255,255,255,0.2);">This email was sent automatically by the CareerOS contact form.</p>
    </div>
    """

    # ── METHOD A: Resend API (HTTPS Port 443 - Perfect for Render Free Tier) ──
    if resend_api_key:
        import requests
        try:
            resp = requests.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {resend_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": "CareerOS Contact <onboarding@resend.dev>",
                    "to": _CONTACT_RECIPIENTS,
                    "subject": f"[CareerOS Contact] {subject}",
                    "html": html,
                    "text": plain,
                    "reply_to": email
                }
            )
            if resp.status_code in [200, 201]:
                print(f"[CONTACT] Email sent via Resend API to {_CONTACT_RECIPIENTS}")
                return _contact_cors(jsonify({"status": "ok"}), 200)
            else:
                print(f"[CONTACT] Resend API error ({resp.status_code}): {resp.text}")
                raise RuntimeError(f"Resend error: {resp.text}")
        except Exception as e:
            print(f"[CONTACT] Resend API failed: {e}")
            if not (smtp_email and smtp_password):
                return _contact_cors(jsonify({"error": f"Email sending failed: {e}"}), 500)

    # ── METHOD B: Legacy SMTP SSL (Blocked on Render Free Tier) ───────────────
    # NOTE: Render free tier blocks ports 25/465/587. This path will timeout.
    # Add RESEND_API_KEY to your Render env vars to use Method A instead.
    import socket
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[CareerOS Contact] {subject}"
        msg["From"]    = smtp_email
        msg["To"]      = ", ".join(_CONTACT_RECIPIENTS)
        msg["Reply-To"] = email

        msg.attach(MIMEText(plain, "plain"))
        msg.attach(MIMEText(html, "html"))

        # 5-second timeout — fail fast so Flask can still return CORS headers
        # instead of hanging 30s until Render's proxy kills the connection.
        old_timeout = socket.getdefaulttimeout()
        socket.setdefaulttimeout(5)
        try:
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(smtp_email, smtp_password)
                server.sendmail(smtp_email, _CONTACT_RECIPIENTS, msg.as_string())
        finally:
            socket.setdefaulttimeout(old_timeout)

        print(f"[CONTACT] Email sent via SMTP to {_CONTACT_RECIPIENTS} from {name} <{email}>")
        return _contact_cors(jsonify({"status": "ok"}), 200)

    except Exception as e:
        print(f"[CONTACT] SMTP send failed: {e}")
        return _contact_cors(
            jsonify({"error": "Failed to send email. Please try again later."}),
            500
        )

@app.errorhandler(Exception)
def handle_exception(e):
    """
    Global error handler — always returns JSON with CORS headers.
    When Flask crashes, Render returns raw HTML with no CORS headers,
    causing browsers to report a CORS error instead of the real error.
    """
    import traceback as _tb

    if hasattr(e, 'code'):
        response = jsonify({"error": str(e)})
        status   = e.code
    else:
        print("[BACKEND CRASH] Unhandled exception:")
        _tb.print_exc()
        response = jsonify({"error": "Internal Server Error", "details": str(e)})
        status   = 500

    origin = request.headers.get("Origin", "")
    if origin in _ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"]      = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"

    return response, status

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Job Tracker API is running'})

@app.route('/api/jobs', methods=['GET'])
def get_all_jobs():
    user_id = get_user_id()
    status_filter = request.args.get('status')
    query = JobApplication.query.filter_by(user_id=user_id)
    if status_filter:
        query = query.filter_by(status=status_filter)
    return jsonify([job.to_dict() for job in query.all()])

@app.route('/api/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    job = JobApplication.query.filter_by(id=job_id, user_id=get_user_id()).first_or_404()
    return jsonify(job.to_dict())

@app.route('/api/jobs', methods=['POST'])
def create_job():
    data = request.get_json()
    if not data.get('company') or not data.get('position'):
        return jsonify({'error': 'Company and position are required'}), 400
    new_job = JobApplication(
        user_id=get_user_id(),
        company=data['company'],
        position=data['position'],
        location=data.get('location', ''),
        status=data.get('status', 'Applied'),
        job_url=data.get('job_url', ''),
        salary_range=data.get('salary_range', ''),
        notes=data.get('notes', ''),
        platform=data.get('platform', 'LinkedIn')
    )
    if data.get('applied_date'):
        try:
            new_job.applied_date = datetime.strptime(data['applied_date'], '%Y-%m-%d')
        except ValueError:
            pass
    db.session.add(new_job)
    db.session.commit()
    return jsonify(new_job.to_dict()), 201

@app.route('/api/jobs/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    job = JobApplication.query.filter_by(id=job_id, user_id=get_user_id()).first_or_404()
    data = request.get_json()
    for field in ['company', 'position', 'location', 'status', 'job_url',
                  'salary_range', 'notes', 'platform']:
        if field in data:
            setattr(job, field, data[field])
    job.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(job.to_dict())

@app.route('/api/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    job = JobApplication.query.filter_by(id=job_id, user_id=get_user_id()).first_or_404()
    db.session.delete(job)
    db.session.commit()
    return jsonify({'message': 'Job application deleted successfully'}), 200

@app.route('/api/stats', methods=['GET'])
def get_stats():
    user_id = get_user_id()
    total = JobApplication.query.filter_by(user_id=user_id).count()
    statuses = ["Applied", "Screening", "Interview", "Offer", "Rejected"]
    by_status = {s: JobApplication.query.filter_by(user_id=user_id, status=s).count() for s in statuses}
    responses = sum(by_status[s] for s in ["Screening", "Interview", "Offer", "Rejected"])
    response_rate = round((responses / total * 100), 1) if total > 0 else 0
    return jsonify({'total': total, 'by_status': by_status, 'response_rate': response_rate})

@app.route('/api/company/logo', methods=['GET'])
def get_company_logo():
    company = request.args.get('company', '')
    domain = company.lower().replace(' ', '') + '.com'
    return jsonify({'logo_url': f"https://logo.clearbit.com/{domain}", 'company': company})

@app.route('/api/salary/estimate', methods=['GET'])
def get_salary_estimate():
    position = request.args.get('position', '').lower()
    salary_data = {
        'software engineer':        {'min': 80000, 'max': 150000, 'median': 110000},
        'senior software engineer': {'min': 120000,'max': 200000, 'median': 160000},
        'data scientist':           {'min': 90000, 'max': 160000, 'median': 120000},
        'product manager':          {'min': 100000,'max': 180000, 'median': 135000},
    }
    estimate = next((v for k, v in salary_data.items() if k in position),
                    {'min': 60000, 'max': 120000, 'median': 85000})
    return jsonify({
        'position':     position,
        'salary_range': f"${estimate['min']:,} - ${estimate['max']:,}",
        'median':       f"${estimate['median']:,}",
        'currency':     'USD'
    })

@app.route('/api/analytics/trends', methods=['GET'])
def get_application_trends():
    user_id = get_user_id()
    jobs = JobApplication.query.filter_by(user_id=user_id).order_by(JobApplication.applied_date).all()
    statuses = ["Applied", "Screening", "Interview", "Offer", "Rejected"]
    monthly_data, status_trends, platform_data = {}, {s: 0 for s in statuses}, {}
    for job in jobs:
        if job.applied_date:
            mk = job.applied_date.strftime('%Y-%m')
            monthly_data[mk] = monthly_data.get(mk, 0) + 1
        status = (job.status or "Applied").strip()
        matched = next((s for s in statuses if s.lower() == status.lower()), status)
        status_trends[matched] = status_trends.get(matched, 0) + 1
        platform = job.platform or "Other"
        platform_data[platform] = platform_data.get(platform, 0) + 1
    total = len(jobs)
    interviews = status_trends.get('Interview', 0)
    offers = status_trends.get('Offer', 0)
    return jsonify({
        'monthly_applications': monthly_data,
        'status_distribution':  status_trends,
        'platform_distribution': platform_data,
        'metrics': {
            'total_applications': total,
            'interview_rate': round((interviews / total * 100), 1) if total > 0 else 0,
            'offer_rate':     round((offers / total * 100), 1) if total > 0 else 0,
        }
    })


# ══════════════════════════════════════════════════════════════════════════════
# AI FEATURES
# ══════════════════════════════════════════════════════════════════════════════

@app.route('/api/ai/cover-letter', methods=['POST'])
def generate_cover_letter():
    data = request.get_json()
    company         = data.get('company', 'the company')
    position        = data.get('position', 'this position')
    job_description = data.get('job_description', '')

    cache_key = make_cache_key("cover_letter", position, company, job_description)
    cached    = get_cached("cover_letter", cache_key)
    if cached:
        return jsonify({**cached, 'cached': True})

    prompt = build_cover_letter_prompt(position, company, job_description)
    result = ai_router.generate(prompt, task_type=TaskType.COVER_LETTER)

    if not result["success"]:
        fallback = (
            f"Dear Hiring Manager,\n\nI am writing to express my strong interest in "
            f"the {position} position at {company}. With my background in full-stack "
            f"development and passion for building impactful products, I believe I would "
            f"be a great fit.\n\nThank you for your consideration.\n\nSincerely,\n[Your Name]"
        )
        return jsonify({'cover_letter': fallback, 'cached': False,
                        'error': result["error"], 'generated_at': datetime.utcnow().isoformat()})

    payload = {
        'cover_letter':   result["text"],
        'provider':       result["provider"],
        'generated_at':   datetime.utcnow().isoformat(),
    }
    set_cache("cover_letter", cache_key, payload,
              provider_used=result["provider"], estimated_input_tokens=len(prompt) // 4)
    return jsonify({**payload, 'cached': False})


@app.route('/api/ai/interview-questions', methods=['POST'])
def generate_interview_questions():
    data     = request.get_json()
    position = data.get('position', 'Software Engineer')

    cache_key = make_cache_key("interview_prep", position)
    cached    = get_cached("interview_prep", cache_key)
    if cached:
        return jsonify({**cached, 'cached': True})

    prompt = build_interview_prompt(position)
    result = ai_router.generate_json(prompt, task_type=TaskType.INTERVIEW_PREP)

    if not result["success"] or not result.get("data"):
        questions = {
            'technical':  ["Explain your experience with system design.",
                           "How do you handle performance bottlenecks?",
                           "Walk me through your debugging process."],
            'behavioral': ["Describe a challenge you overcame.", "Tell me about a team conflict."]
        }
    else:
        questions = result["data"]

    payload = {
        'questions':    questions,
        'position':     position,
        'provider':     result.get("provider"),
        'generated_at': datetime.utcnow().isoformat(),
    }
    set_cache("interview_prep", cache_key, payload,
              provider_used=result.get("provider", ""), estimated_input_tokens=len(prompt) // 4)
    return jsonify({**payload, 'cached': False})


@app.route('/api/ai/suggestions', methods=['GET'])
def get_ai_suggestions():
    user_email = get_user_id()
    if not user_email:
        return jsonify({'suggestions': []})

    user = get_or_create_user(user_email)

    if user.last_ai_suggestions and user.suggestions_updated_at:
        diff = datetime.utcnow() - user.suggestions_updated_at
        if diff.total_seconds() < 86400:
            try:
                return jsonify({
                    'suggestions':    json.loads(user.last_ai_suggestions),
                    'generated_at':   user.suggestions_updated_at.isoformat(),
                    'cached':         True
                })
            except Exception:
                pass

    jobs = JobApplication.query.filter_by(user_id=user_email).all()
    suggestions = []

    for job in jobs:
        if job.applied_date is None:
            continue
        days = (datetime.utcnow() - job.applied_date).days
        if job.status in ['Applied', 'Screening'] and days >= 7:
            suggestions.append({
                'type':     'follow_up',
                'priority': 'high',
                'message':  f"Follow up on {job.position} at {job.company} — {days}d ago",
                'job_id':   job.id
            })

    try:
        jobs_str = summarize_jobs_for_prompt(jobs)
        prompt   = build_suggestions_prompt(jobs_str)
        result   = ai_router.generate(prompt, task_type=TaskType.SUGGESTIONS)

        if result["success"]:
            lines = [l.strip("- 0123456789. ").strip()
                     for l in result["text"].strip().split("\n") if l.strip()]
            for line in lines[:3]:
                suggestions.append({
                    'type':     'ai_insight',
                    'priority': 'medium',
                    'message':  line,
                    'job_id':   None
                })

        user.last_ai_suggestions   = json.dumps(suggestions)
        user.suggestions_updated_at = datetime.utcnow()
        db.session.commit()

    except Exception as e:
        print(f"[suggestions] AI failed (non-fatal): {e}")
        if not suggestions:
            suggestions.append({
                'type': 'motivation', 'priority': 'medium',
                'message': "Keep applying! Consistency is key.", 'job_id': None
            })

    return jsonify({'suggestions': suggestions, 'generated_at': datetime.utcnow().isoformat(), 'cached': False})


@app.route("/api/ai/chat", methods=["POST"])
def ai_chat():
    user_id      = get_user_id()
    data         = request.get_json()
    user_message = data.get("message", "")
    history      = data.get("history", [])

    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    jobs    = JobApplication.query.filter_by(user_id=user_id).all()
    ctx     = "You are a career coach. User's tracked jobs: "
    ctx    += ", ".join(f"{j.position} at {j.company}" for j in jobs) if jobs else "None yet."

    history_text = ""
    for turn in history[-4:]:
        role  = "User" if turn.get("role") == "user" else "Assistant"
        parts = turn.get("parts", [])
        text  = parts[0].get("text", "") if parts else ""
        if text:
            history_text += f"{role}: {text}\n"

    prompt = f"{ctx}\n\n{history_text}User: {user_message}\nAssistant:"
    result = ai_router.generate(prompt, task_type=TaskType.CHAT)

    if not result["success"]:
        return jsonify({"error": result["error"]}), 500

    return jsonify({
        "response":     result["text"],
        "provider":     result["provider"],
        "generated_at": datetime.utcnow().isoformat()
    })


@app.route("/api/ai/match-resume", methods=["POST"])
def match_resume():
    data            = request.get_json()
    resume_text     = data.get("resume_text", "")
    job_description = data.get("job_description", "")

    if not resume_text or not job_description:
        return jsonify({"error": "Both resume and job description are required"}), 400

    cache_key = make_cache_key("ats_scan", resume_text, job_description)
    cached    = get_cached("ats_scan", cache_key)
    if cached:
        return jsonify({**cached, 'cached': True})

    prompt = build_ats_prompt(resume_text, job_description)
    result = ai_router.generate_json(prompt, task_type=TaskType.ATS_SCAN)

    if not result["success"] or not result.get("data"):
        return jsonify({"error": result.get("error", "AI analysis failed")}), 500

    payload = {**result["data"], "provider": result["provider"]}
    set_cache("ats_scan", cache_key, payload,
              provider_used=result["provider"],
              estimated_input_tokens=len(prompt) // 4)
    return jsonify({**payload, 'cached': False})


@app.route("/api/ai/diagnostics", methods=["GET"])
def ai_diagnostics():
    providers = {
        "gemini":      bool(os.environ.get("GEMINI_API_KEY")),
        "groq":        bool(os.environ.get("GROQ_API_KEY")),
        "openrouter":  bool(os.environ.get("OPENROUTER_API_KEY")),
    }
    return jsonify({"providers": providers, "cache": cache_stats()})


# ══════════════════════════════════════════════════════════════════════════════
# FILE UPLOAD
# ══════════════════════════════════════════════════════════════════════════════

@app.route('/api/upload/resume', methods=['POST'])
def upload_resume():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file     = request.files['file']
    filename = file.filename or ''
    if not filename:
        return jsonify({'error': 'No filename'}), 400

    try:
        raw_bytes = file.read()
        if len(raw_bytes) > 5 * 1024 * 1024:
            return jsonify({'error': 'File too large. Maximum size is 5 MB.'}), 413

        text, ftype = parse_uploaded_file(raw_bytes, filename)
        word_count  = len(text.split())

        return jsonify({
            'text':       text,
            'file_type':  ftype,
            'word_count': word_count,
            'char_count': len(text),
            'filename':   filename,
        })
    except ValueError as e:
        return jsonify({'error': str(e)}), 415
    except RuntimeError as e:
        return jsonify({'error': str(e)}), 422
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {e}'}), 500


# ══════════════════════════════════════════════════════════════════════════════
# SHORT LINKS
# ══════════════════════════════════════════════════════════════════════════════

def _generate_code(length: int = 8) -> str:
    chars = string.ascii_letters + string.digits
    return ''.join(random.choices(chars, k=length))


@app.route('/api/links/shorten', methods=['POST'])
def shorten_link():
    body  = request.get_json()
    data  = body.get('data')
    label = body.get('label', '')

    if not data:
        return jsonify({'error': 'data payload is required'}), 400

    for _ in range(5):
        code = _generate_code()
        if not ShortLink.query.filter_by(short_code=code).first():
            break
    else:
        return jsonify({'error': 'Could not generate unique code, try again'}), 500

    expires_days = min(int(body.get('expires_days', 30)), 90)
    from datetime import timedelta
    expires_at = datetime.utcnow() + timedelta(days=expires_days)

    link = ShortLink(
        short_code  = code,
        target_data = json.dumps(data),
        user_id     = get_user_id(),
        label       = label,
        expires_at  = expires_at,
    )
    db.session.add(link)
    db.session.commit()

    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000").rstrip('/')
    short_url    = f"{frontend_url}/s/{code}"

    return jsonify({
        'short_code': code,
        'short_url':  short_url,
        'label':      label,
        'expires_at': expires_at.isoformat(),
    }), 201


@app.route('/s/<code>', methods=['GET'])
def resolve_short_link(code):
    link = ShortLink.query.filter_by(short_code=code).first()
    if not link:
        return jsonify({'error': 'Link not found'}), 404
    if link.is_expired():
        return jsonify({'error': 'This link has expired'}), 410
    link.click_count += 1
    db.session.commit()
    return jsonify(json.loads(link.target_data))


@app.route('/api/links/<code>/stats', methods=['GET'])
def link_stats(code):
    link = ShortLink.query.filter_by(short_code=code).first()
    if not link:
        return jsonify({'error': 'Link not found'}), 404
    return jsonify(link.to_dict())


# ══════════════════════════════════════════════════════════════════════════════
# GMAIL
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/api/gmail/debug", methods=["GET"])
def gmail_debug():
    creds_json    = os.environ.get("GOOGLE_CREDENTIALS_JSON")
    has_env_var   = bool(creds_json)
    json_valid    = False
    json_error    = None
    has_local_file = os.path.exists('credentials.json')

    if creds_json:
        try:
            json.loads(creds_json)
            json_valid = True
        except Exception as e:
            json_error = str(e)

    return jsonify({
        "GOOGLE_CREDENTIALS_JSON_set":          has_env_var,
        "GOOGLE_CREDENTIALS_JSON_valid_json":   json_valid,
        "GOOGLE_CREDENTIALS_JSON_parse_error":  json_error,
        "credentials_json_file_exists":         has_local_file,
        "host_url":                             request.host_url,
        "redirect_uri_would_use": (
            "https://careeros-xooj.onrender.com/api/gmail/callback"
            if "onrender.com" in request.host_url
            else "http://localhost:5001/api/gmail/callback"
        )
    })


@app.route("/api/gmail/auth-start", methods=["POST"])
def gmail_auth_start():
    user_email = get_user_id()
    if not user_email:
        return jsonify({"error": "Unauthorized"}), 401

    redirect_uri = "http://localhost:5001/api/gmail/callback"
    if "onrender.com" in request.host_url:
        redirect_uri = "https://careeros-xooj.onrender.com/api/gmail/callback"

    from google_auth_oauthlib.flow import Flow
    import traceback as _tb

    try:
        creds_json_env = os.environ.get("GOOGLE_CREDENTIALS_JSON")
        if creds_json_env:
            try:
                creds_info = json.loads(creds_json_env)
            except Exception as e:
                return jsonify({
                    "error": f"GOOGLE_CREDENTIALS_JSON is set but contains invalid JSON: {e}"
                }), 500
            flow = Flow.from_client_config(
                creds_info,
                scopes=['https://www.googleapis.com/auth/gmail.readonly'],
                redirect_uri=redirect_uri,
            )
        else:
            if not os.path.exists('credentials.json'):
                return jsonify({
                    "error": "OAuth credentials not configured. "
                             "Set GOOGLE_CREDENTIALS_JSON on Render."
                }), 500
            flow = Flow.from_client_secrets_file(
                'credentials.json',
                scopes=['https://www.googleapis.com/auth/gmail.readonly'],
                redirect_uri=redirect_uri,
            )

        auth_url, state = flow.authorization_url(prompt='consent', access_type='offline')

        user = get_or_create_user(user_email)
        user.gmail_auth_state = json.dumps({
            "state":         state,
            "status":        "pending",
            "code_verifier": getattr(flow, 'code_verifier', None),
        })
        db.session.commit()
        print(f"[GmailAuth] auth-start: state persisted to DB for {user_email}")

        return jsonify({"auth_url": auth_url, "status": "pending"})

    except Exception as e:
        _tb.print_exc()
        return jsonify({"error": f"Failed to start Gmail auth: {str(e)}"}), 500


@app.route("/api/gmail/callback")
def gmail_callback():
    import traceback as _tb

    state = request.args.get('state')
    code  = request.args.get('code')

    if not state or not code:
        return jsonify({"error": "Missing state or code parameter."}), 400

    from sqlalchemy import text as _sql_text
    users_with_state = db.session.execute(
        _sql_text('SELECT id, email, gmail_auth_state FROM "user" WHERE gmail_auth_state IS NOT NULL')
    ).fetchall()

    user_email   = None
    stored_state = None
    for row in users_with_state:
        try:
            s = json.loads(row[2])
            if s.get("state") == state:
                user_email   = row[1]
                stored_state = s
                break
        except Exception:
            continue

    if not user_email:
        return (
            "<h1>Authentication Failed</h1>"
            "<p>Invalid or expired OAuth state. Please close this window and try again.</p>"
        ), 400

    try:
        redirect_uri = "http://localhost:5001/api/gmail/callback"
        if "onrender.com" in request.host_url:
            redirect_uri = "https://careeros-xooj.onrender.com/api/gmail/callback"

        from google_auth_oauthlib.flow import Flow
        creds_json_env = os.environ.get("GOOGLE_CREDENTIALS_JSON")
        if creds_json_env:
            creds_info = json.loads(creds_json_env)
            flow = Flow.from_client_config(
                creds_info,
                scopes=['https://www.googleapis.com/auth/gmail.readonly'],
                redirect_uri=redirect_uri,
            )
        else:
            flow = Flow.from_client_secrets_file(
                'credentials.json',
                scopes=['https://www.googleapis.com/auth/gmail.readonly'],
                redirect_uri=redirect_uri,
            )

        if stored_state and stored_state.get('code_verifier'):
            flow.code_verifier = stored_state['code_verifier']

        flow.fetch_token(code=code)
        creds = flow.credentials

        user = get_or_create_user(user_email)
        user.gmail_credentials = json.dumps({
            'token':         creds.token,
            'refresh_token': creds.refresh_token,
            'token_uri':     creds.token_uri,
            'client_id':     creds.client_id,
            'client_secret': creds.client_secret,
            'scopes':        list(creds.scopes) if creds.scopes else [],
        })
        user.gmail_auth_state = json.dumps({**stored_state, "status": "done"})
        db.session.commit()
        print(f"[GmailAuth] callback: credentials saved for {user_email}")

        return (
            "<h1>Authentication Successful!</h1>"
            "<p>You can close this window now.</p>"
            "<script>window.close();</script>"
        )

    except Exception as e:
        _tb.print_exc()
        try:
            u = get_or_create_user(user_email)
            u.gmail_auth_state = json.dumps({**stored_state, "status": "error", "message": str(e)})
            db.session.commit()
        except Exception:
            pass
        return (
            f"<h1>Authentication Failed</h1><p>{str(e)}</p>"
            "<p>Please close this window and try again.</p>"
        ), 500


@app.route("/api/gmail/auth-status", methods=["GET"])
def gmail_auth_status():
    user_email = get_user_id()
    if not user_email:
        return jsonify({"status": "none"})

    user = User.query.filter_by(email=user_email).first()
    if not user or not user.gmail_auth_state:
        return jsonify({"status": "none"})

    try:
        state_data = json.loads(user.gmail_auth_state)
        return jsonify({
            "status":  state_data.get("status", "none"),
            "message": state_data.get("message", ""),
        })
    except Exception:
        return jsonify({"status": "none"})


# ── Gmail sync — OPTIONS preflight (explicit, never touches Flask-CORS) ───────
@app.route('/api/gmail/sync', methods=['OPTIONS'])
def gmail_sync_preflight():
    """
    Explicit OPTIONS handler so CORS preflight always gets a clean 204.
    Without this, if Flask-CORS or Render's proxy drops the preflight response,
    the browser blocks the POST before it even leaves the client.
    """
    origin = request.headers.get('Origin', '')
    resp   = app.make_response('')
    resp.status_code = 204
    if origin in _ALLOWED_ORIGINS:
        resp.headers['Access-Control-Allow-Origin']      = origin
        resp.headers['Access-Control-Allow-Credentials'] = 'true'
        resp.headers['Access-Control-Allow-Methods']     = 'POST, OPTIONS'
        resp.headers['Access-Control-Allow-Headers']     = 'Content-Type, Authorization, X-User-Email'
    return resp


# ── Gmail sync — POST ─────────────────────────────────────────────────────────
@app.route('/api/gmail/sync', methods=['POST'])
def gmail_sync():
    """
    Gmail sync — hardened against Render timeout + CORS crash.

    The previous version called ai_router.generate_json() once per email
    (up to 15 AI calls in a single request) which caused Render's free dyno
    to time out.  The process died mid-request, Render returned raw HTML with
    no CORS headers, and the browser reported 'Failed to fetch' — making it
    look like a CORS bug when it was actually a timeout.

    This version uses pure regex extraction in gmail_utils.sync_job_emails()
    so the entire sync completes in < 5 seconds.

    Every exit path uses _make_cors_response() so CORS headers are always
    present even on hard crashes.
    """
    import traceback as _tb

    user_email = get_user_id()
    print(f'[GmailSync] Route called. user_email={user_email!r}')

    if not user_email:
        return _make_cors_response({'error': 'Authentication required'}, 401)

    user = User.query.filter_by(email=user_email).first()
    if not user or not user.gmail_credentials:
        print('[GmailSync] No stored credentials — needs_auth.')
        return _make_cors_response({'error': 'needs_auth'}, 200)

    try:
        # ── Build Gmail service ───────────────────────────────────────────────
        print('[GmailSync] Building Gmail service...')
        service, updated_creds_json = get_gmail_service(user.gmail_credentials)
        print('[GmailSync] Gmail service ready.')

        if updated_creds_json:
            print('[GmailSync] Persisting refreshed token...')
            user.gmail_credentials = updated_creds_json
            db.session.commit()

        # ── Fetch + parse emails (regex only — no AI calls, no timeout risk) ──
        print('[GmailSync] Calling sync_job_emails...')
        new_jobs_data = sync_job_emails(service)
        print(f'[GmailSync] sync_job_emails returned {len(new_jobs_data)} job(s).')

        added_count   = 0
        updated_count = 0
        skipped_count = 0

        for job_data in new_jobs_data:
            try:
                company = (job_data.get('company') or '').strip()
                role    = (job_data.get('role')    or '').strip()

                if not company or not role:
                    skipped_count += 1
                    continue

                # Safe date parsing
                raw_date    = job_data.get('date')
                parsed_date = datetime.utcnow()
                if raw_date:
                    for fmt in ('%Y-%m-%d', '%d-%m-%Y', '%m/%d/%Y', '%d/%m/%Y'):
                        try:
                            parsed_date = datetime.strptime(str(raw_date).strip(), fmt)
                            break
                        except (ValueError, TypeError):
                            continue

                status = (job_data.get('status') or 'Applied').strip()

                # Duplicate check — skip if same company + role already exists
                existing = JobApplication.query.filter_by(
                    user_id=user_email, company=company, position=role
                ).first()

                if not existing:
                    db.session.add(JobApplication(
                        user_id      = user_email,
                        company      = company,
                        position     = role,
                        status       = status,
                        platform     = job_data.get('source', 'Gmail'),
                        applied_date = parsed_date,
                    ))
                    added_count += 1
                    print(f'[GmailSync] Added: {company} — {role}')
                else:
                    if existing.status != status:
                        print(f'[GmailSync] Updating {company}: {existing.status!r} → {status!r}')
                        existing.status = status
                        updated_count  += 1

            except Exception as job_err:
                print(f'[GmailSync] Error on record {job_data}: {job_err}')
                _tb.print_exc()
                skipped_count += 1

        # ── Commit all changes ────────────────────────────────────────────────
        try:
            db.session.commit()
            print(
                f'[GmailSync] Committed — '
                f'added={added_count} updated={updated_count} skipped={skipped_count}'
            )
        except Exception as commit_err:
            db.session.rollback()
            print(f'[GmailSync] DB commit FAILED: {commit_err}')
            _tb.print_exc()
            return _make_cors_response({'error': f'Database error: {commit_err}'}, 500)

        return _make_cors_response({
            'success': True,
            'added':   added_count,
            'updated': updated_count,
            'skipped': skipped_count,
        })

    except RuntimeError as e:
        err_str = str(e)
        print(f'[GmailSync] Auth RuntimeError: {err_str}')
        _tb.print_exc()
        reauth_keywords = ['invalid_grant', 'refresh_token', 're-auth',
                           'Token refresh failed', 'expired', 're-authenticate']
        if any(kw.lower() in err_str.lower() for kw in reauth_keywords):
            user.gmail_credentials = None
            db.session.commit()
            print('[GmailSync] Cleared stale credentials — user must re-auth.')
        return _make_cors_response({'error': 'needs_auth', 'detail': err_str}, 200)

    except Exception as e:
        _tb.print_exc()
        print(f'[GmailSync] Unexpected exception: {e}')
        if 'invalid_grant' in str(e).lower() or 'refresh_token' in str(e).lower():
            user.gmail_credentials = None
            db.session.commit()
            return _make_cors_response({'error': 'needs_auth'}, 200)
        return _make_cors_response({'error': str(e)}, 500)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)