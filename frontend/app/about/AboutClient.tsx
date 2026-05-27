'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Target,
  FileText,
  Mic,
  Brain,
  Briefcase,
  Mail,
  BarChart3,
  MessageSquare,
  Github,
  ExternalLink,
  Zap,
  Shield,
  Globe,
  Code2,
  Layers,
  TrendingUp,
  Users,
  Lock,
  CheckCircle,
  AlertTriangle,
  Cpu,
  Rocket,
  Star,
} from 'lucide-react';
import DarkVeil from '../../components/DarkVeil';
import Footer from '../../components/landing/Footer';

// ── Design tokens — exact same DNA as LandingPage.tsx ─────────────────────────
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

// ── Animation variants — same pattern as landing ──────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};



// ── Features Data ─────────────────────────────────────────────────────────────
const PLATFORM_FEATURES = [
  {
    icon: Briefcase,
    title: 'Smart Job Tracking',
    desc: 'Manage every application across a kanban board, timeline, and list view — with real-time status updates powered by Gmail sync.',
    color: '#22c55e',
  },
  {
    icon: Mail,
    title: 'Gmail Job Sync',
    desc: 'Connect your Gmail via OAuth2. Our regex engine auto-detects job-related emails and extracts company, role, and status — no AI per-email costs.',
    color: '#ef4444',
  },
  {
    icon: Target,
    title: 'ATS Resume Scorer',
    desc: 'Upload your resume and paste a job description — our multi-provider AI stack scores your ATS compatibility with keyword gap analysis.',
    color: '#3b82f6',
  },
  {
    icon: FileText,
    title: 'AI Cover Letters',
    desc: 'Generate role-specific, company-tailored cover letters in seconds using Gemini 1.5 Flash — cached for zero repeat costs.',
    color: '#8b5cf6',
  },
  {
    icon: Mic,
    title: 'Interview Questions',
    desc: 'Get AI-curated technical and behavioral questions specific to your target role — powered by Groq with sub-second response times.',
    color: '#06b6d4',
  },
  {
    icon: Brain,
    title: 'Prepify AI Interviews',
    desc: 'Practice real-time mock interviews with voice-powered AI coaching — integrated as our sister product at prepify-one.vercel.app.',
    color: '#f59e0b',
  },
  {
    icon: BarChart3,
    title: 'Career Analytics',
    desc: 'Recharts-powered dashboards showing monthly application trends, interview conversion rates, platform distributions, and offer pipeline.',
    color: '#a855f7',
  },
  {
    icon: MessageSquare,
    title: 'AI Career Assistant',
    desc: 'A context-aware AI coach that reads your full job history and delivers personalized, actionable career advice via chat.',
    color: '#14b8a6',
  },
];

// ── USPs ─────────────────────────────────────────────────────────────────────
const USPS = [
  {
    icon: Cpu,
    title: 'Multi-Provider AI Engine',
    desc: 'Our custom AIRouter intelligently chains Gemini 1.5 Pro → Groq LLaMA → OpenRouter as fallbacks — ensuring 99%+ AI availability even when individual providers go down.',
    color: '#3b82f6',
  },
  {
    icon: Zap,
    title: 'Regex-First Gmail Sync',
    desc: 'Instead of expensive AI calls per email (which caused timeouts), our smart regex engine extracts job data in milliseconds — sync 10 emails in under 5 seconds.',
    color: '#f59e0b',
  },
  {
    icon: Layers,
    title: 'AI Response Caching',
    desc: 'SHA-256 keyed database-level cache for ATS scans, cover letters, and interview questions. Repeat requests return instantly — zero redundant API costs.',
    color: '#22c55e',
  },
  {
    icon: Shield,
    title: 'OAuth2 Auth Security',
    desc: 'Google Sign-In via NextAuth.js. Gmail sync uses read-only OAuth2 scopes. Credentials stored encrypted per-user in PostgreSQL on Supabase.',
    color: '#a855f7',
  },
  {
    icon: Globe,
    title: 'Deployed & Production-Ready',
    desc: 'Frontend on Netlify with Next.js 16. Flask/Python backend on Render. PostgreSQL on Supabase. Fully live with zero cold-start compromise.',
    color: '#ef4444',
  },
  {
    icon: Code2,
    title: 'Full-Stack Modern Architecture',
    desc: 'Next.js 16 + TypeScript frontend. Flask 3.0 Python backend. SQLAlchemy ORM. Framer Motion animations. Recharts for data viz.',
    color: '#06b6d4',
  },
];

// ── Roadmap ───────────────────────────────────────────────────────────────────
const ROADMAP = [
  {
    phase: 'Q3 2025',
    icon: Brain,
    title: 'AI Career Intelligence v2',
    desc: 'Deep personalization layer — AI learns your career trajectory, skill clusters, and pattern-matches you to hidden job market opportunities.',
    color: '#3b82f6',
    status: 'Planned',
  },
  {
    phase: 'Q3 2025',
    icon: FileText,
    title: 'Resume Builder & Optimizer',
    desc: 'AI-powered resume generation with live ATS scoring, keyword injection, and role-specific tailoring — built directly into the dashboard.',
    color: '#8b5cf6',
    status: 'Planned',
  },
  {
    phase: 'Q4 2025',
    icon: Mic,
    title: 'Automated Application Assist',
    desc: 'One-click job applications across LinkedIn, Indeed, and company portals — auto-filled using your profile, tailored cover letters auto-generated.',
    color: '#f59e0b',
    status: 'Planned',
  },
  {
    phase: 'Q4 2025',
    icon: BarChart3,
    title: 'Market Intelligence & Salary Data',
    desc: 'Real-time salary benchmarking by role, location, and company. Interview success rate comparisons. Skills demand heatmaps across industries.',
    color: '#22c55e',
    status: 'Planned',
  },
  {
    phase: 'Q1 2026',
    icon: Users,
    title: 'Team & Cohort Mode',
    desc: 'Collaborative job search for bootcamp cohorts, university career centers, and recruiting agencies — shared pipelines and group analytics.',
    color: '#a855f7',
    status: 'Vision',
  },
  {
    phase: 'Q2 2026',
    icon: Globe,
    title: 'Enterprise Career Platform',
    desc: 'White-label solution for universities, staffing agencies, and HR teams — bulk user management, custom branding, and API access.',
    color: '#14b8a6',
    status: 'Vision',
  },
];

// ── Challenges ────────────────────────────────────────────────────────────────
const CHALLENGES = [
  {
    icon: AlertTriangle,
    color: '#ef4444',
    title: 'The Gmail Sync Performance Crisis',
    problem:
      'Our initial Gmail sync used a Gemini agent to parse each email via AI — up to 15 separate API calls per sync. On Render\'s free tier, this caused requests to time out mid-flight. Render then returned raw HTML with no CORS headers, and the browser reported a misleading "Failed to fetch" error — masking the real problem entirely.',
    solution:
      'We re-architected the entire sync pipeline from AI-based extraction to a regex-rule engine. Subject lines, sender domains, and snippets are parsed using deterministic pattern matching with status inference rules (Offer → Interview → Screening → Applied). Sync now completes in under 5 seconds with zero AI API calls. We also added a hardened CORS response helper and explicit OPTIONS preflight handler to prevent future proxy stripping.',
  },
  {
    icon: Lock,
    color: '#f59e0b',
    title: 'Google Cloud OAuth & CORS Architecture',
    problem:
      'Managing Google OAuth credentials across local dev and production on Render proved extremely complex. Redirect URIs had to match exactly. The Render proxy stripped CORS headers on crash responses. DB-backed OAuth state was needed to survive dyno restarts during the callback window. Credential serialization format between google-auth-oauthlib and our PostgreSQL User model was mismatched.',
    solution:
      'We implemented a DB-backed OAuth state machine where gmail_auth_state persists across Render restarts. The frontend polls /api/gmail/auth-status every 3 seconds during OAuth. CORS is now manually injected on every response — including crash paths — via a _make_cors_response() helper. Environment detection auto-switches redirect URIs between localhost and production Render URLs.',
  },
];

// ── Developers ────────────────────────────────────────────────────────────────
const DEVELOPERS = [
  {
    name: 'Birjyot Singh Sahiwal',
    role: 'Full-Stack Engineer & Product Lead',
    bio: 'Architected the core CareerOS platform — from the Flask backend API to the Next.js dashboard. Led AI integration, database design, and production deployment strategy.',
    github: 'https://github.com/Birjyot',
    email: 'birjyotsahiwal7@gmail.com',
    linkedin: '#',
    initials: 'BS',
    gradient: 'linear-gradient(135deg, #0F52BA, #3b82f6)',
    skills: ['Flask', 'Next.js', 'PostgreSQL', 'Google Cloud'],
  },
  {
    name: 'Tejasav Singh',
    role: 'AI Systems Engineer & Backend Developer',
    bio: 'Built the multi-provider AI router, Gmail sync pipeline, and ATS scoring engine. Specializes in building reliable AI systems with graceful fallback mechanisms.',
    github: 'https://github.com/stejasav',
    email: 'tejasavsingh2528@gmail.com',
    linkedin: '#',
    initials: 'TS',
    gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    skills: ['Gemini AI', 'Groq', 'Python', 'OAuth2'],
  },
  {
    name: 'Vikramjeet Singh Layal',
    role: 'Frontend Engineer & UI/UX Designer',
    bio: 'Designed and built the CareerOS user interface — from the immersive DarkVeil landing page to the Kanban job tracker and Recharts analytics dashboard.',
    github: 'https://github.com/vjlayal',
    email: 'vjlayal777@gmail.com',
    linkedin: '#',
    initials: 'VL',
    gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)',
    skills: ['React', 'Framer Motion', 'Tailwind', 'Recharts'],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// SECTION: HERO
// ════════════════════════════════════════════════════════════════════════════
function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Top gradient separator */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(15,82,186,0.5), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl mb-8"
            style={CARD}
          >
            <Sparkles size={14} className="text-blue-400" />
            <span className="text-sm font-semibold text-white/70 uppercase tracking-widest">
              Our Story
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.1)}
            className="text-5xl sm:text-6xl xl:text-7xl font-black leading-[1.06] tracking-tight text-white mb-6"
          >
            We built the career tool
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              we always needed.
            </span>
          </motion.h1>

          {/* Mission */}
          <motion.p
            {...fadeUp(0.2)}
            className="text-xl font-semibold text-white/60 mb-4 max-w-2xl mx-auto"
          >
            Job searching shouldn&apos;t feel like a second job.
          </motion.p>

          <motion.p
            {...fadeUp(0.28)}
            className="text-lg text-white/45 max-w-3xl mx-auto leading-relaxed mb-12"
          >
            CareerOS is an AI-powered career command center that brings together job tracking,
            resume scoring, cover letter generation, interview preparation, and Gmail sync — all
            in one intelligent, beautifully designed platform. We built this because scattered
            spreadsheets and forgotten applications cost real people real opportunities.
          </motion.p>

          {/* CTA */}
          <motion.div {...fadeUp(0.36)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest text-white transition-all duration-300"
              style={{
                background: ACCENT,
                boxShadow: `0 0 28px rgba(15,82,186,0.45), inset 0 1px 0 rgba(255,255,255,0.1)`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.boxShadow = `0 0 48px rgba(15,82,186,0.7), inset 0 1px 0 rgba(255,255,255,0.15)`;
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.boxShadow = `0 0 28px rgba(15,82,186,0.45), inset 0 1px 0 rgba(255,255,255,0.1)`;
                el.style.transform = 'translateY(0)';
              }}
            >
              Open Dashboard
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="https://github.com/Birjyot/CareerOS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold text-white/70 hover:text-white transition-all duration-200"
              style={CARD}
            >
              <Github size={16} />
              View on GitHub
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-10 mt-16"
          >
            {[
              { value: '8+', label: 'AI Features' },
              { value: '3', label: 'AI Providers' },
              { value: '∞', label: 'Applications Tracked' },
              { value: '100%', label: 'Free to Use' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black text-white leading-none">{s.value}</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION: WHAT THE PLATFORM DOES
// ════════════════════════════════════════════════════════════════════════════
function WhatWeDo() {
  return (
    <section className="py-24 relative">
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(15,82,186,0.3), transparent)' }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4">
            The Platform
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Everything your job search{' '}
            <span style={{ color: ACCENT }}>actually needs</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-lg">
            CareerOS replaces the chaos of spreadsheets, disconnected tools, and forgotten follow-ups
            with a single AI-powered command center.
          </p>
        </motion.div>

        {/* Feature grid — 4-col matching landing page */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {PLATFORM_FEATURES.map((feat) => (
            <motion.div
              key={feat.title}
              variants={staggerItem}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="relative group cursor-default rounded-[20px] p-6 overflow-hidden"
              style={CARD}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px] pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top left, ${feat.color}12, transparent 70%)` }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px] pointer-events-none"
                style={{ boxShadow: `inset 0 0 0 1px ${feat.color}30` }}
              />
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: `${feat.color}18`, border: `1px solid ${feat.color}30` }}
              >
                <feat.icon size={20} style={{ color: feat.color }} />
              </div>
              <h3 className="text-base font-bold text-white mb-2 relative">{feat.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed relative">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* User Journey Block */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="mt-16 p-8 lg:p-12 rounded-[24px] relative overflow-hidden"
          style={CARD_DEEP}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(15,82,186,0.08), transparent 60%)' }}
          />
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4">User Journey</p>
            <h3 className="text-2xl font-black text-white mb-8">From signup to offer letter — in one platform.</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Sign In', desc: 'Google OAuth login — one click, no passwords.', color: '#3b82f6' },
                { step: '02', title: 'Add Applications', desc: 'Manually add jobs or sync automatically from Gmail.', color: '#8b5cf6' },
                { step: '03', title: 'Get AI Insights', desc: 'AI suggests follow-ups, scores your resume, and generates cover letters.', color: '#22c55e' },
                { step: '04', title: 'Track to Offer', desc: 'Move applications through the pipeline. Analyze your success patterns.', color: '#f59e0b' },
              ].map((step) => (
                <div key={step.step} className="relative">
                  <div
                    className="text-5xl font-black mb-3 leading-none"
                    style={{ color: `${step.color}30` }}
                  >
                    {step.step}
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">{step.title}</h4>
                  <p className="text-sm text-white/45 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION: USP
// ════════════════════════════════════════════════════════════════════════════
function USPSection() {
  return (
    <section className="py-24 relative">
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(15,82,186,0.3), transparent)' }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4">
            What Sets Us Apart
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Not just another{' '}
            <span style={{ color: ACCENT }}>job tracker</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            CareerOS is engineered for reliability, speed, and intelligence — built on a production-grade
            architecture that actually scales.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {USPS.map((usp) => (
            <motion.div
              key={usp.title}
              variants={staggerItem}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group rounded-[20px] p-7 relative overflow-hidden cursor-default"
              style={CARD}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[20px]"
                style={{ background: `radial-gradient(ellipse at top left, ${usp.color}10, transparent 65%)` }}
              />
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: `${usp.color}15`, border: `1px solid ${usp.color}25` }}
              >
                <usp.icon size={22} style={{ color: usp.color }} />
              </div>
              <h3 className="text-base font-bold text-white mb-3">{usp.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{usp.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION: VISION & ROADMAP
// ════════════════════════════════════════════════════════════════════════════
function RoadmapSection() {
  return (
    <section className="py-24 relative">
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(15,82,186,0.3), transparent)' }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4">
            Vision & Roadmap
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            We&apos;re just{' '}
            <span style={{ color: ACCENT }}>getting started.</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            CareerOS is a living platform. Here&apos;s what&apos;s being built next — a future where your
            career manages itself.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ROADMAP.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="rounded-[20px] p-6 relative overflow-hidden"
              style={CARD}
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}
                >
                  <item.icon size={18} style={{ color: item.color }} />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background: item.status === 'Planned' ? 'rgba(59,130,246,0.12)' : 'rgba(139,92,246,0.12)',
                      color: item.status === 'Planned' ? '#60a5fa' : '#a78bfa',
                      border: item.status === 'Planned' ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(139,92,246,0.2)',
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">{item.phase}</p>
              <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION: CHALLENGES
// ════════════════════════════════════════════════════════════════════════════
function ChallengesSection() {
  return (
    <section className="py-24 relative">
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(15,82,186,0.3), transparent)' }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4">
            Engineering Reality
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            The hard problems{' '}
            <span style={{ color: ACCENT }}>we solved.</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Real production issues don&apos;t show up in tutorials. Here&apos;s what actually happened —
            and how we fixed it.
          </p>
        </motion.div>

        <div className="space-y-6">
          {CHALLENGES.map((challenge, i) => (
            <motion.div
              key={challenge.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-[24px] p-8 lg:p-10 relative overflow-hidden"
              style={CARD_DEEP}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 10% 50%, ${challenge.color}07, transparent 50%)` }}
              />
              <div className="relative z-10">
                <div className="flex items-start gap-5 mb-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: `${challenge.color}15`, border: `1px solid ${challenge.color}25` }}
                  >
                    <challenge.icon size={22} style={{ color: challenge.color }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">
                      Engineering Challenge
                    </p>
                    <h3 className="text-xl font-black text-white">{challenge.title}</h3>
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-3">
                      The Problem
                    </p>
                    <p className="text-sm text-white/60 leading-relaxed">{challenge.problem}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-3">
                      The Solution
                    </p>
                    <p className="text-sm text-white/60 leading-relaxed">{challenge.solution}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION: DEVELOPERS
// ════════════════════════════════════════════════════════════════════════════
function DevelopersSection() {
  return (
    <section className="py-24 relative">
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(15,82,186,0.3), transparent)' }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4">
            The Team
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Built by developers,{' '}
            <span style={{ color: ACCENT }}>for job seekers.</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Three engineers who felt the pain of job searching firsthand — and decided to build the tool
            that should have existed.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid md:grid-cols-3 gap-6"
        >
          {DEVELOPERS.map((dev) => (
            <motion.div
              key={dev.name}
              variants={staggerItem}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group rounded-[24px] p-7 relative overflow-hidden cursor-default"
              style={CARD}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[24px]"
                style={{ background: 'radial-gradient(ellipse at top, rgba(15,82,186,0.08), transparent 60%)' }}
              />

              <div className="relative z-10">
                {/* Avatar */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white mb-5"
                  style={{ background: dev.gradient }}
                >
                  {dev.initials}
                </div>

                {/* Name & Role */}
                <h3 className="text-lg font-black text-white mb-1">{dev.name}</h3>
                <p
                  className="text-xs font-bold mb-4 uppercase tracking-wider"
                  style={{ color: '#60a5fa' }}
                >
                  {dev.role}
                </p>
                <p className="text-sm text-white/50 leading-relaxed mb-5">{dev.bio}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {dev.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-3">
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-white transition-colors"
                  >
                    <Github size={14} />
                    GitHub
                  </a>
                  <span className="text-white/20">·</span>
                  <a
                    href={`mailto:${dev.email}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-blue-400 transition-colors"
                  >
                    <Mail size={14} />
                    Email
                  </a>
                  {dev.linkedin !== '#' && (
                    <>
                      <span className="text-white/20">·</span>
                      <a
                        href={dev.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-blue-400 transition-colors"
                      >
                        <ExternalLink size={14} />
                        LinkedIn
                      </a>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION: CLOSING CTA
// ════════════════════════════════════════════════════════════════════════════
function ClosingCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(15,82,186,0.3), transparent)' }}
      />
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[24px] overflow-hidden px-8 py-20 text-center"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(60px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 0 80px rgba(15,82,186,0.08)',
          }}
        >
          {/* Glow */}
          <div
            className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Rocket size={20} className="text-blue-400" />
              <Star size={16} className="text-purple-400" />
              <Sparkles size={18} className="text-blue-400" />
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 leading-tight">
              Your next opportunity
              <br />
              <span style={{ color: ACCENT }}>is closer than you think.</span>
            </h2>

            <p className="text-white/50 max-w-xl mx-auto mb-10 text-lg">
              CareerOS was built on the belief that the right tool, at the right time, changes everything.
              Start your smarter job search today — for free.
            </p>

            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl text-base font-black uppercase tracking-widest text-white transition-all duration-300"
              style={{
                background: ACCENT,
                boxShadow: `0 0 28px rgba(15,82,186,0.45), inset 0 1px 0 rgba(255,255,255,0.1)`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.boxShadow = `0 0 48px rgba(15,82,186,0.7), inset 0 1px 0 rgba(255,255,255,0.15)`;
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.boxShadow = `0 0 28px rgba(15,82,186,0.45), inset 0 1px 0 rgba(255,255,255,0.1)`;
                el.style.transform = 'translateY(0)';
              }}
            >
              Explore the Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <div className="flex items-center justify-center gap-6 mt-10">
              {[
                { icon: CheckCircle, text: 'Free forever' },
                { icon: CheckCircle, text: 'No credit card' },
                { icon: CheckCircle, text: 'Google Sign-In' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon size={14} className="text-green-400" />
                  <span className="text-sm text-white/40">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



// ════════════════════════════════════════════════════════════════════════════
// PAGE ROOT
// ════════════════════════════════════════════════════════════════════════════
export default function AboutClient() {
  return (
    <div className="min-h-screen relative isolate" style={{ color: '#fff' }}>
      {/* DarkVeil background — same params as dashboard & landing */}
      <div className="fixed inset-0 -z-10" aria-hidden="true">
        <DarkVeil hueShift={32} speed={1} scanlineFrequency={0.5} warpAmount={5} />
      </div>
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: 'rgba(5,8,20,0.55)' }}
        aria-hidden="true"
      />


      <HeroSection />
      <WhatWeDo />
      <USPSection />
      <RoadmapSection />
      <ChallengesSection />
      <DevelopersSection />
      <ClosingCTA />
      <Footer />
    </div>
  );
}
