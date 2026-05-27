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

const POLICY_SECTIONS = [
  {
    id: 'information-we-collect',
    icon: Database,
    color: '#3b82f6',
    title: '1. Information We Collect',
    content: [
      { subtitle: 'Account Data', text: 'Name, email, and profile photo via Google OAuth2. No passwords stored.' },
      { subtitle: 'Job Applications', text: 'Company, position, status, dates, salary, URLs, notes — all scoped to your email.' },
      { subtitle: 'Gmail Sync', text: 'Read-only email metadata (subject, sender, date). Full bodies are never read or stored.' },
      { subtitle: 'Resume Content', text: 'Sent to AI providers for analysis. Cached 24h via SHA-256 hash, never permanently stored.' },
      { subtitle: 'Usage Data', text: 'Anonymous feature adoption metrics and error patterns from backend logs.' },
    ],
  },
  {
    id: 'how-we-use-data',
    icon: Eye,
    color: '#8b5cf6',
    title: '2. How We Use Your Data',
    content: [
      { subtitle: 'Platform Features', text: 'Powers dashboard, kanban, analytics, and AI suggestions — all scoped to your email.' },
      { subtitle: 'AI Features', text: 'Minimum context sent to Gemini / Groq / OpenRouter for ATS, cover letters, and chat.' },
      { subtitle: 'Gmail Processing', text: 'Regex-based extraction of company, role, and status. Raw email content never stored.' },
      { subtitle: 'What We Don\'t Do', text: 'No data selling. No ads. No third-party marketing. No AI model training on your data.' },
    ],
  },
  {
    id: 'data-protection',
    icon: Lock,
    color: '#22c55e',
    title: '3. Data Protection',
    content: [
      { subtitle: 'Database', text: 'PostgreSQL on Supabase with row-level isolation, SSL encryption, and env-managed credentials.' },
      { subtitle: 'Authentication', text: 'NextAuth.js with Google OAuth2. JWT-signed sessions. 256-bit secret. No passwords.' },
      { subtitle: 'Gmail Tokens', text: 'Stored encrypted per-user. Read-only scope. Revocable anytime from Google settings.' },
      { subtitle: 'API Security', text: 'CORS-restricted origins. Parameterized queries. User-scoped via X-User-Email header.' },
    ],
  },
  {
    id: 'cookies',
    icon: Cookie,
    color: '#06b6d4',
    title: '4. Cookies & Sessions',
    content: [
      { subtitle: 'Session Cookie', text: 'HttpOnly, Secure, SameSite=Lax signed JWT via NextAuth.js.' },
      { subtitle: 'CSRF Token', text: 'Prevents cross-site request forgery on auth endpoints.' },
      { subtitle: 'No Tracking', text: 'Zero advertising cookies, tracking pixels, or browser fingerprinting.' },
    ],
  },
  {
    id: 'user-rights',
    icon: UserCheck,
    color: '#a855f7',
    title: '5. Your Rights',
    content: [
      { subtitle: 'Access & Export', text: 'View all data in-dashboard. Export applications as CSV anytime.' },
      { subtitle: 'Edit & Delete', text: 'Modify or delete any application instantly. Changes reflect across all views.' },
      { subtitle: 'Revoke Gmail', text: 'Remove access at myaccount.google.com/permissions. Synced data remains.' },
      { subtitle: 'Account Deletion', text: 'Email birjyotsahiwal7@gmail.com — full deletion within 7 business days.' },
    ],
  },
  {
    id: 'data-retention',
    icon: Clock,
    color: '#ef4444',
    title: '6. Data Retention',
    content: [
      { subtitle: 'Active Data', text: 'Retained while your account is active. No auto-expiration.' },
      { subtitle: 'AI Cache', text: '24h–7d depending on task type, then auto-deleted.' },
      { subtitle: 'OAuth Tokens', text: 'Retained until you revoke access or request deletion.' },
    ],
  },
  {
    id: 'security-limitations',
    icon: AlertTriangle,
    color: '#f59e0b',
    title: '7. Limitations',
    content: [
      { subtitle: 'Open Source Project', text: 'Built by 3 developers. Not a security-certified enterprise product.' },
      { subtitle: 'Third-Party AI', text: 'Data sent to Gemini/Groq/OpenRouter is governed by their respective policies.' },
      { subtitle: 'Disclosure', text: 'Report vulnerabilities to birjyotsahiwal7@gmail.com before public disclosure.' },
    ],
  },
  {
    id: 'policy-updates',
    icon: RefreshCw,
    color: '#14b8a6',
    title: '8. Policy Updates',
    content: [
      { subtitle: 'Notifications', text: 'Material changes update the "Last Updated" date. Major changes notified in-app.' },
      { subtitle: 'Continued Use', text: 'Constitutes acceptance. Disagree? Discontinue use and request deletion.' },
    ],
  },
  {
    id: 'contact',
    icon: Mail,
    color: '#3b82f6',
    title: '9. Contact',
    content: [
      { subtitle: 'Privacy Inquiries', text: 'Email birjyotsahiwal7@gmail.com with subject "Privacy Inquiry". Response within 48h.' },
      { subtitle: 'Jurisdiction', text: 'Operated from India. Data may be processed in the US (Render, Supabase, Google).' },
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
// POLICY SECTIONS (Bento/Masonry Layout)
// ════════════════════════════════════════════════════════════════════════════
function PolicySections() {
  return (
    <section className="py-8 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {POLICY_SECTIONS.map((section, sIdx) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (sIdx % 3) * 0.05 }}
              className="rounded-[24px] overflow-hidden break-inside-avoid"
              style={CARD}
            >
              {/* Section header */}
              <div
                className="flex items-center gap-4 px-6 py-5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${section.color}15`, border: `1px solid ${section.color}25` }}
                >
                  <section.icon size={18} style={{ color: section.color }} />
                </div>
                <h2 className="text-base font-black text-white leading-tight">{section.title}</h2>
              </div>

              {/* Subsections */}
              <div className="p-6 space-y-5">
                {section.content.map((item) => (
                  <div key={item.subtitle}>
                    <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: section.color }}
                      />
                      {item.subtitle}
                    </h3>
                    <p className="text-xs text-white/50 leading-relaxed pl-3.5">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
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
