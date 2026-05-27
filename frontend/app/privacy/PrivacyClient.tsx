'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import {
  Shield,
  Lock,
  Eye,
  Database,
  Globe,
  Cookie,
  UserCheck,
  Clock,
  AlertTriangle,
  RefreshCw,
  Mail,
  Sparkles,
  CheckCircle,
  Server,
  Key,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import DarkVeil from '../../components/DarkVeil';
import Footer from '../../components/landing/Footer';

// ── Design tokens ─────────────────────────────────────────────────────────────
const CARD = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(40px)',
  border: '1px solid rgba(255,255,255,0.08)',
} as const;

const CARD_DEEP = {
  background: 'rgba(0,0,0,0.2)',
  backdropFilter: 'blur(40px)',
  border: '1px solid rgba(255,255,255,0.05)',
} as const;

const ACCENT = '#0F52BA';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

// ── Policy Sections Data ──────────────────────────────────────────────────────
const POLICY_SECTIONS = [
  {
    id: 'information-we-collect',
    icon: Database,
    color: '#3b82f6',
    title: '1. Information We Collect',
    content: [
      {
        subtitle: 'Account & Authentication Data',
        text: 'When you sign in with Google via NextAuth.js, we receive your name, email address, and profile photo from Google\'s OAuth2 provider. We do not receive or store your Google password. Your email address is used as your unique identifier across the platform.',
      },
      {
        subtitle: 'Job Application Data',
        text: 'All job applications you create or import include: company name, position title, location, application status (Applied / Screening / Interview / Offer / Rejected), application date, salary range, job listing URL, platform (LinkedIn, Indeed, etc.), and personal notes. This data is stored in our PostgreSQL database on Supabase and is exclusively associated with your email address.',
      },
      {
        subtitle: 'Gmail Sync Data',
        text: 'If you optionally authorize Gmail sync via OAuth2, we access only your Gmail inbox using read-only scope (gmail.readonly). We search for job-related emails using subject keyword queries. We extract only: sender name/domain, email subject, snippet, and date. Full email bodies are never read, stored, or transmitted. Your Gmail OAuth tokens are stored encrypted per-user in PostgreSQL.',
      },
      {
        subtitle: 'Resume Content',
        text: 'When you use the ATS Resume Scorer, you paste or upload your resume text. This text is sent to our AI providers (Gemini, Groq) for analysis and is not permanently stored by us. Resume data is transiently cached in our AI response cache for up to 24 hours using a SHA-256 hash key to avoid redundant API calls.',
      },
      {
        subtitle: 'Usage & Analytics',
        text: 'We collect anonymous usage metadata to understand feature adoption and improve the platform. This includes which tabs are active, timestamps of API calls, and error patterns from our Flask backend logs on Render.',
      },
    ],
  },
  {
    id: 'how-we-use-data',
    icon: Eye,
    color: '#8b5cf6',
    title: '2. How We Use Your Data',
    content: [
      {
        subtitle: 'Core Platform Functionality',
        text: 'Your job application data powers the dashboard, kanban board, analytics charts, and AI suggestion engine. Your email is used to scope all data queries — no user can access another user\'s data.',
      },
      {
        subtitle: 'AI Features',
        text: 'Your resume text, job descriptions, and application history are sent to our AI provider chain (Gemini 1.5 Pro, Groq LLaMA 3.1, OpenRouter) to power the ATS scorer, cover letter generator, interview question generator, and career chat assistant. Only the minimum context required for each feature is sent.',
      },
      {
        subtitle: 'Gmail Sync Processing',
        text: 'Gmail email metadata is processed server-side using deterministic regex rules to extract company name, role title, and application status. Processed data is immediately inserted into your job applications list. Raw email content is never stored.',
      },
      {
        subtitle: 'AI Suggestions',
        text: 'Your job application history is analyzed once per day by our AI to generate personalized follow-up reminders and career insights. These suggestions are cached in your user record and refreshed every 24 hours.',
      },
      {
        subtitle: 'What We Do NOT Do',
        text: 'We do not sell your data. We do not show you ads. We do not share your personal information with third parties for marketing purposes. We do not train AI models on your personal data.',
      },
    ],
  },
  {
    id: 'data-protection',
    icon: Lock,
    color: '#22c55e',
    title: '3. Data Protection & Security',
    content: [
      {
        subtitle: 'Database Security',
        text: 'All user data is stored in a PostgreSQL database on Supabase with row-level isolation by user email. Database credentials are environment-variable managed and never hardcoded. The database uses SSL-encrypted connections.',
      },
      {
        subtitle: 'Authentication Security',
        text: 'Authentication is handled by NextAuth.js with Google OAuth2. NEXTAUTH_SECRET is a 256-bit random secret stored as an environment variable. Session tokens are signed using industry-standard JWT. No passwords are ever stored.',
      },
      {
        subtitle: 'Gmail OAuth Token Storage',
        text: 'Gmail OAuth2 credentials (access token, refresh token, scopes) are stored as JSON in the user\'s database record. Tokens use read-only scope and can be revoked at any time from your Google Account security settings.',
      },
      {
        subtitle: 'API Security',
        text: 'All API routes are scoped to the authenticated user\'s email via the X-User-Email header. CORS is explicitly configured to allow only our production frontend origin (careeros-1-h6vm.onrender.com) and localhost. All database queries are parameterized to prevent SQL injection.',
      },
      {
        subtitle: 'AI Data Handling',
        text: 'AI responses are cached server-side using SHA-256 keyed cache entries in our AI_Cache database table. Cache entries expire based on task type (24 hours for suggestions, 7 days for ATS/cover letter results). No raw AI outputs are stored permanently.',
      },
    ],
  },
  {
    id: 'third-party-services',
    icon: Globe,
    color: '#f59e0b',
    title: '4. Third-Party Services',
    content: [
      {
        subtitle: 'Google (OAuth & Gmail)',
        text: 'Google provides authentication via OAuth2 and, if authorized, Gmail read access. Google\'s privacy policy governs data shared during the OAuth flow. We request minimal scopes: userinfo.email, userinfo.profile, and optionally gmail.readonly. You can revoke access at myaccount.google.com/permissions at any time.',
      },
      {
        subtitle: 'Google Gemini AI',
        text: 'We use Google\'s Gemini 1.5 Pro and Flash models for ATS scanning, cover letter generation, AI suggestions, and Gmail extraction fallback. Data sent includes resume text, job descriptions, and job summaries. Google\'s AI API data usage policy applies.',
      },
      {
        subtitle: 'Groq (LLaMA 3.1)',
        text: 'Groq is used as our primary provider for low-latency tasks: interview question generation and career chat. We send the minimum context required for each request. Groq\'s privacy policy governs data transmitted to their API.',
      },
      {
        subtitle: 'OpenRouter',
        text: 'OpenRouter serves as our universal AI fallback when Gemini and Groq are unavailable. It routes to compatible models using our API key. OpenRouter\'s terms of service govern data transmitted through their platform.',
      },
      {
        subtitle: 'Supabase (PostgreSQL)',
        text: 'Our database is hosted on Supabase\'s managed PostgreSQL infrastructure in its default region. Supabase is SOC 2 compliant and provides encrypted storage. All database connections use SSL.',
      },
      {
        subtitle: 'Render',
        text: 'Our Flask Python backend is deployed on Render\'s free-tier web service. Application logs are retained by Render according to their data retention policy. We do not store sensitive user data in application logs.',
      },
      {
        subtitle: 'Netlify',
        text: 'Our Next.js frontend is deployed on Netlify. Netlify handles CDN caching of static assets only. No user data is processed or stored by Netlify beyond standard HTTP request logs.',
      },
    ],
  },
  {
    id: 'cookies',
    icon: Cookie,
    color: '#06b6d4',
    title: '5. Cookies & Sessions',
    content: [
      {
        subtitle: 'Session Cookies',
        text: 'NextAuth.js sets a signed, encrypted session cookie (next-auth.session-token) upon successful login. This cookie is HttpOnly, Secure, and SameSite=Lax by default. It contains your session JWT and expires after the configured session duration.',
      },
      {
        subtitle: 'CSRF Token',
        text: 'NextAuth.js also sets a CSRF token cookie (next-auth.csrf-token) to prevent cross-site request forgery attacks on authentication endpoints.',
      },
      {
        subtitle: 'No Tracking Cookies',
        text: 'CareerOS does not use advertising cookies, third-party tracking pixels, Google Analytics, or any behavioral tracking technology. We do not fingerprint your browser.',
      },
      {
        subtitle: 'Controlling Cookies',
        text: 'You can clear all CareerOS cookies at any time through your browser settings. Clearing cookies will log you out of the platform. Blocking cookies entirely will prevent login functionality.',
      },
    ],
  },
  {
    id: 'user-rights',
    icon: UserCheck,
    color: '#a855f7',
    title: '6. Your Rights & Controls',
    content: [
      {
        subtitle: 'Access Your Data',
        text: 'All your job application data is visible and accessible directly in your CareerOS dashboard at all times. You can export all your applications as a CSV file using the Export button in the Applications tab.',
      },
      {
        subtitle: 'Modify Your Data',
        text: 'You can edit any job application at any time — including company name, position, status, notes, salary, and date. Changes are reflected instantly across the dashboard and analytics.',
      },
      {
        subtitle: 'Delete Applications',
        text: 'You can delete individual job applications from the Applications view. Deleted records are permanently removed from our database immediately.',
      },
      {
        subtitle: 'Revoke Gmail Access',
        text: 'You can revoke CareerOS\'s Gmail read access at any time from myaccount.google.com/permissions. After revocation, Gmail sync will require re-authorization. Previously synced applications remain in your dashboard.',
      },
      {
        subtitle: 'Delete Your Account',
        text: 'To request complete account deletion — including all job applications, AI suggestion cache, Gmail credentials, and user record — email us at birjyotsahiwal7@gmail.com with the subject "Account Deletion Request". We will process and confirm deletion within 7 business days.',
      },
    ],
  },
  {
    id: 'data-retention',
    icon: Clock,
    color: '#ef4444',
    title: '7. Data Retention',
    content: [
      {
        subtitle: 'Active Account Data',
        text: 'Your job application data, user record, and AI suggestion cache are retained for as long as your account is active. There is no automatic expiration of active user data.',
      },
      {
        subtitle: 'AI Response Cache',
        text: 'Cached AI responses (ATS scans, cover letters, interview questions) are retained for 24 hours to 7 days depending on the task type, then automatically expired and deleted from the AI_Cache table.',
      },
      {
        subtitle: 'Gmail OAuth Tokens',
        text: 'Gmail OAuth2 tokens are retained until you revoke Gmail access or request account deletion. Expired access tokens are automatically refreshed using the stored refresh token when Gmail sync is triggered.',
      },
      {
        subtitle: 'Inactive Accounts',
        text: 'We currently do not automatically delete inactive accounts. If you wish to have your data removed, submit a deletion request as described above.',
      },
    ],
  },
  {
    id: 'security-limitations',
    icon: AlertTriangle,
    color: '#f59e0b',
    title: '8. Security Limitations',
    content: [
      {
        subtitle: 'No System Is Perfect',
        text: 'While we implement industry-standard security measures, no system can guarantee 100% security. CareerOS is a project built and maintained by a small team of three developers. We are not a security-certified enterprise product.',
      },
      {
        subtitle: 'Render Free Tier',
        text: 'Our backend runs on Render\'s free tier, which has resource and uptime limitations. While we engineer for reliability, service interruptions can occur. We are not liable for data loss due to infrastructure outages.',
      },
      {
        subtitle: 'Third-Party AI Providers',
        text: 'Data sent to Gemini, Groq, and OpenRouter is governed by their respective policies. We send only the minimum required context, but we cannot control how these providers handle data on their end.',
      },
      {
        subtitle: 'Responsible Disclosure',
        text: 'If you discover a security vulnerability in CareerOS, please report it responsibly to birjyotsahiwal7@gmail.com before public disclosure. We will investigate and respond promptly.',
      },
    ],
  },
  {
    id: 'policy-updates',
    icon: RefreshCw,
    color: '#14b8a6',
    title: '9. Policy Updates',
    content: [
      {
        subtitle: 'Change Notification',
        text: 'When we make material changes to this Privacy Policy, we will update the "Last Updated" date at the top of this page. For significant changes, we may notify you via the dashboard notification system.',
      },
      {
        subtitle: 'Continued Use',
        text: 'Continued use of CareerOS after a Privacy Policy update constitutes acceptance of the revised policy. If you do not agree with changes, you should discontinue use and request account deletion.',
      },
    ],
  },
  {
    id: 'contact',
    icon: Mail,
    color: '#3b82f6',
    title: '10. Contact & Privacy Inquiries',
    content: [
      {
        subtitle: 'Privacy Contact',
        text: 'For all privacy-related inquiries, data requests, or concerns, contact our lead developer at birjyotsahiwal7@gmail.com. Include "Privacy Inquiry" in the subject line. We aim to respond within 48 hours.',
      },
      {
        subtitle: 'Jurisdiction',
        text: 'CareerOS is operated from India. This Privacy Policy is governed by the applicable laws of India. Users from the EU/EEA should be aware that data may be processed outside the EU, including in the United States (Render, Supabase, Google).',
      },
    ],
  },
];

// ── Third-Party Services Summary ──────────────────────────────────────────────
const THIRD_PARTIES = [
  { name: 'Google OAuth2', purpose: 'Authentication', dataShared: 'Email, name, profile photo', color: '#ef4444' },
  { name: 'Google Gemini AI', purpose: 'ATS, Cover Letters, Suggestions', dataShared: 'Resume text, job descriptions', color: '#3b82f6' },
  { name: 'Groq (LLaMA 3.1)', purpose: 'Interview Questions, Chat', dataShared: 'Position context, job history', color: '#f59e0b' },
  { name: 'OpenRouter', purpose: 'AI Fallback', dataShared: 'Same as Gemini/Groq', color: '#8b5cf6' },
  { name: 'Supabase', purpose: 'Database Hosting', dataShared: 'All stored user data', color: '#22c55e' },
  { name: 'Render', purpose: 'Backend Hosting', dataShared: 'API request logs', color: '#06b6d4' },
  { name: 'Netlify', purpose: 'Frontend Hosting', dataShared: 'HTTP request logs only', color: '#a855f7' },
  { name: 'Gmail API', purpose: 'Email Sync (optional)', dataShared: 'Email metadata (read-only)', color: '#14b8a6' },
];


// ════════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ════════════════════════════════════════════════════════════════════════════
function HeroSection() {
  return (
    <section className="relative pt-28 pb-16 overflow-hidden">
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(15,82,186,0.5), transparent)' }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Copy */}
          <div>
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl mb-8" style={CARD}>
              <Shield size={14} className="text-green-400" />
              <span className="text-sm font-semibold text-white/70 uppercase tracking-widest">Privacy Policy</span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="text-4xl sm:text-5xl xl:text-6xl font-black leading-[1.06] tracking-tight text-white mb-6"
            >
              Your data.
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Your control.
              </span>
            </motion.h1>

            <motion.p {...fadeUp(0.2)} className="text-white/50 leading-relaxed mb-6 text-lg">
              We built CareerOS to help you — not to profit from your data. This policy explains
              exactly what we collect, why, how it&apos;s protected, and what rights you have.
            </motion.p>

            <motion.div {...fadeUp(0.28)} className="flex items-center gap-3 text-sm text-white/30">
              <RefreshCw size={13} />
              <span>Last Updated: May 27, 2026</span>
            </motion.div>
          </div>

          {/* Right: Key Commitments */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="rounded-[24px] p-7" style={CARD_DEEP}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-5">
                Our Core Commitments
              </p>
              <div className="space-y-4">
                {[
                  { icon: CheckCircle, text: 'We never sell your personal data to third parties.', color: '#22c55e' },
                  { icon: CheckCircle, text: 'We never show you advertisements.', color: '#22c55e' },
                  { icon: CheckCircle, text: 'Gmail sync uses read-only scope — we never modify your emails.', color: '#22c55e' },
                  { icon: CheckCircle, text: 'AI providers receive only the minimum context required.', color: '#22c55e' },
                  { icon: CheckCircle, text: 'All database queries are scoped to your email — no data leaks between users.', color: '#22c55e' },
                  { icon: CheckCircle, text: 'Account deletion removes all your data within 7 business days.', color: '#22c55e' },
                  { icon: CheckCircle, text: 'No tracking cookies or behavioral analytics.', color: '#22c55e' },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-start gap-3">
                    <Icon size={15} style={{ color, marginTop: 2 }} className="shrink-0" />
                    <p className="text-sm text-white/60 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Nav */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex flex-wrap gap-2"
        >
          {POLICY_SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 text-white/50 hover:text-white"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = `${section.color}15`;
                (e.currentTarget as HTMLAnchorElement).style.borderColor = `${section.color}30`;
                (e.currentTarget as HTMLAnchorElement).style.color = section.color;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)';
              }}
            >
              {section.title}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// THIRD PARTY SUMMARY TABLE
// ════════════════════════════════════════════════════════════════════════════
function ThirdPartyTable() {
  return (
    <section className="py-16 relative">
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(15,82,186,0.3), transparent)' }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-3">
            Third-Party Services At a Glance
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Who we share your data with
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="rounded-[20px] overflow-hidden"
          style={CARD_DEEP}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-3 px-6 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Service</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Purpose</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Data Shared</p>
          </div>

          {THIRD_PARTIES.map((tp, i) => (
            <div
              key={tp.name}
              className="grid grid-cols-3 px-6 py-4 hover:bg-white/[0.02] transition-colors"
              style={{ borderBottom: i < THIRD_PARTIES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: tp.color }}
                />
                <span className="text-sm font-semibold text-white">{tp.name}</span>
              </div>
              <p className="text-sm text-white/50">{tp.purpose}</p>
              <p className="text-sm text-white/40">{tp.dataShared}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// POLICY SECTIONS
// ════════════════════════════════════════════════════════════════════════════
function PolicySections() {
  return (
    <section className="py-8 relative">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {POLICY_SECTIONS.map((section, sIdx) => (
          <motion.div
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="rounded-[24px] overflow-hidden"
            style={CARD}
          >
            {/* Section header */}
            <div
              className="flex items-center gap-4 px-7 py-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${section.color}15`, border: `1px solid ${section.color}25` }}
              >
                <section.icon size={18} style={{ color: section.color }} />
              </div>
              <h2 className="text-lg font-black text-white">{section.title}</h2>
            </div>

            {/* Subsections */}
            <div className="p-7 space-y-6">
              {section.content.map((item) => (
                <div key={item.subtitle}>
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: section.color }}
                    />
                    {item.subtitle}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed pl-3.5">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// USER RIGHTS QUICK ACTIONS
// ════════════════════════════════════════════════════════════════════════════
function UserRightsActions() {
  return (
    <section className="py-16 relative">
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(15,82,186,0.3), transparent)' }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4">Your Controls</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Take action on your data
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {[
            {
              icon: Database,
              title: 'Export Your Data',
              desc: 'Download all your job applications as a CSV file from the Applications tab.',
              action: 'Go to Dashboard',
              href: '/dashboard',
              color: '#3b82f6',
              external: false,
            },
            {
              icon: Key,
              title: 'Manage Gmail Access',
              desc: 'Revoke CareerOS\'s Gmail read access from your Google Account settings.',
              action: 'Google Account',
              href: 'https://myaccount.google.com/permissions',
              color: '#ef4444',
              external: true,
            },
            {
              icon: Eye,
              title: 'View Your Applications',
              desc: 'All your tracked applications are visible in your dashboard at all times.',
              action: 'Open Dashboard',
              href: '/dashboard',
              color: '#22c55e',
              external: false,
            },
            {
              icon: Trash2,
              title: 'Delete Your Account',
              desc: 'Email us to permanently delete your account and all associated data.',
              action: 'Request Deletion',
              href: 'mailto:birjyotsahiwal7@gmail.com?subject=Account Deletion Request',
              color: '#f59e0b',
              external: false,
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={staggerItem}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group rounded-[20px] p-6 relative overflow-hidden cursor-default"
              style={CARD}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[20px]"
                style={{ background: `radial-gradient(ellipse at top left, ${item.color}10, transparent 65%)` }}
              />
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}
              >
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-white/45 leading-relaxed mb-4">{item.desc}</p>
              <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors"
                style={{ color: item.color }}
              >
                {item.action}
                <ArrowRight size={11} />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CONTACT BLOCK
// ════════════════════════════════════════════════════════════════════════════
function PrivacyContact() {
  return (
    <section className="py-16 relative">
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(15,82,186,0.3), transparent)' }}
      />
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="rounded-[24px] p-10 text-center relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(15,82,186,0.07), transparent 65%)' }}
          />
          <div className="relative z-10">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              <Shield size={24} className="text-blue-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Privacy questions?</h2>
            <p className="text-white/50 mb-7 max-w-lg mx-auto">
              If you have any questions, concerns, or data requests regarding this Privacy Policy,
              reach our lead developer directly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:birjyotsahiwal7@gmail.com?subject=Privacy Inquiry - CareerOS"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest text-white transition-all duration-300"
                style={{
                  background: ACCENT,
                  boxShadow: `0 0 24px rgba(15,82,186,0.35)`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 40px rgba(15,82,186,0.6)`;
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 24px rgba(15,82,186,0.35)`;
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                }}
              >
                <Mail size={16} />
                Email Us
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-semibold text-white/70 hover:text-white transition-all"
                style={CARD}
              >
                <Sparkles size={14} />
                Contact Page
                <ArrowRight size={14} />
              </Link>
            </div>
            <p className="text-xs text-white/25 mt-6">
              We respond to privacy inquiries within 48 hours. Account deletion requests within 7 business days.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PAGE ROOT
// ════════════════════════════════════════════════════════════════════════════
export default function PrivacyClient() {
  return (
    <div className="min-h-screen relative isolate" style={{ color: '#fff' }}>
      <div className="fixed inset-0 -z-10" aria-hidden="true">
        <DarkVeil hueShift={32} speed={1} scanlineFrequency={0.5} warpAmount={5} />
      </div>
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: 'rgba(5,8,20,0.55)' }}
        aria-hidden="true"
      />


      <HeroSection />
      <ThirdPartyTable />
      <PolicySections />
      <UserRightsActions />
      <PrivacyContact />
      <Footer />
    </div>
  );
}
