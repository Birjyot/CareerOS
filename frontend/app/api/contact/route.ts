import { NextRequest, NextResponse } from 'next/server';

// ── Recipients ────────────────────────────────────────────────────────────────
// PRIMARY must be the email address you used to sign up on resend.com.
// The other two go in BCC so all three receive the message even on the
// free "onboarding@resend.dev" sender (which only delivers to the account owner).
const CONTACT_TO = ['birjyotsahiwal7@gmail.com'];          // ← Resend account email
const CONTACT_BCC = [
  'tejasavsingh2528@gmail.com',
  'vjlayal777@gmail.com',
];

function buildHtml(name: string, email: string, subject: string, message: string) {
  return `
  <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#050814;color:#fff;border-radius:16px;border:1px solid rgba(255,255,255,0.08);">
    <div style="margin-bottom:24px;">
      <h2 style="margin:0 0 4px 0;font-size:20px;color:#fff;font-weight:800;">New Contact Form Submission</h2>
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4);">via CareerOS Contact Page</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
        <td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;width:80px;font-weight:600;">Name</td>
        <td style="padding:10px 0;color:#fff;font-size:14px;font-weight:700;">${name}</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
        <td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;font-weight:600;">Email</td>
        <td style="padding:10px 0;font-size:14px;">
          <a href="mailto:${email}" style="color:#60a5fa;text-decoration:none;">${email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;font-weight:600;">Subject</td>
        <td style="padding:10px 0;color:#fff;font-size:14px;">${subject}</td>
      </tr>
    </table>
    <div style="padding:20px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
      <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.35);">Message</p>
      <p style="margin:0;font-size:14px;line-height:1.75;color:rgba(255,255,255,0.8);white-space:pre-wrap;">${message}</p>
    </div>
    <div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.06);">
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);">This email was sent automatically by the CareerOS contact form. Reply directly to this email to respond to ${name}.</p>
    </div>
  </div>`;
}

function buildPlain(name: string, email: string, subject: string, message: string) {
  return [
    'New contact form submission from CareerOS',
    '─'.repeat(48),
    '',
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Subject: ${subject}`,
    '',
    'Message:',
    message,
  ].join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const name    = (data.name    || '').trim();
    const email   = (data.email   || '').trim();
    const subject = (data.subject || '').trim();
    const message = (data.message || '').trim();

    // ── Validation ────────────────────────────────────────────────────────
    if (!name || !email || !subject || message.length < 20) {
      return NextResponse.json(
        { error: 'All fields are required and message must be ≥ 20 characters.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      // No email service configured — log and return success so UX isn't broken
      console.warn('[CONTACT] RESEND_API_KEY not set. Message received but not emailed.');
      console.info(`[CONTACT] From: ${name} <${email}> | Subject: ${subject}`);
      console.info(`[CONTACT] Message: ${message}`);
      return NextResponse.json({ status: 'ok', note: 'Received (email not configured)' });
    }

    const html  = buildHtml(name, email, subject, message);
    const plain = buildPlain(name, email, subject, message);

    // ── Send via Resend REST API ───────────────────────────────────────────
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:     'CareerOS Contact <onboarding@resend.dev>',
        to:       CONTACT_TO,
        bcc:      CONTACT_BCC,
        subject:  `[CareerOS Contact] ${subject} — from ${name}`,
        html,
        text:     plain,
        reply_to: email,
      }),
    });

    if (!resendRes.ok) {
      const errBody = await resendRes.text();
      console.error(`[CONTACT] Resend API error ${resendRes.status}: ${errBody}`);

      // If Resend returns 403 (unverified domain), fall back to logging
      if (resendRes.status === 403 || resendRes.status === 422) {
        console.warn('[CONTACT] Resend domain not verified — logging message instead.');
        console.info(`From: ${name} <${email}> | Subject: ${subject}`);
        console.info(`Message: ${message}`);
        return NextResponse.json({ status: 'ok', note: 'logged' });
      }

      return NextResponse.json(
        { error: `Email service error: ${errBody}` },
        { status: 500 }
      );
    }

    const resendData = await resendRes.json();
    console.info(`[CONTACT] Email sent via Resend. ID: ${resendData?.id}. To: ${CONTACT_TO}, BCC: ${CONTACT_BCC.join(', ')}`);

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('[CONTACT] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
