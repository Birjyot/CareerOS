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
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import DarkVeil from '../DarkVeil';
import RotatingText from '../ui/RotatingText';
import Footer from './Footer';
import ScrollMarquee from './ScrollMarquee';

// ── Design tokens — identical to dashboard ───────────────────────────────────
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

const ICON_BLUE = 'bg-blue-500/10 text-blue-400 rounded-2xl';
const ACCENT = '#0F52BA';

// ── Data ─────────────────────────────────────────────────────────────────────
const ROTATING_WORDS = [
  'Smarter',
  'Faster',
  'AI-Driven',
  'Interview-Ready',
  'Recruiter-Optimized',
  'Data-Backed',
];

const FEATURES = [
  { icon: Target, title: 'ATS Resume Scorer', desc: 'Instantly score your resume against any job description with AI keyword analysis.', color: '#3b82f6' },
  { icon: FileText, title: 'AI Cover Letters', desc: 'Generate tailored, professional cover letters for each role in seconds.', color: '#8b5cf6' },
  { icon: Mic, title: 'Interview Generator', desc: 'Get AI-curated technical and behavioral questions specific to your target role.', color: '#06b6d4' },
  { icon: Brain, title: 'Prepify AI Interviews', desc: 'Practice real-time mock interviews with AI — voice-powered and adaptive.', color: '#f59e0b' },
  { icon: Briefcase, title: 'Smart Job Tracking', desc: 'Manage every application with Kanban boards, filters, and timeline views.', color: '#22c55e' },
  { icon: Mail, title: 'Gmail Job Sync', desc: 'Auto-detect and import job applications directly from your Gmail inbox via OAuth.', color: '#ef4444' },
  { icon: BarChart3, title: 'Career Analytics', desc: 'Visualize your job search performance with charts, trends, and conversion rates.', color: '#a855f7' },
  { icon: MessageSquare, title: 'AI Career Assistant', desc: 'Chat with an AI coach that knows your job history and gives personalized advice.', color: '#14b8a6' },
];

const MOCK_JOBS = [
  { company: 'Google', role: 'Senior SWE', status: 'Interview', color: '#22c55e' },
  { company: 'Stripe', role: 'Frontend Eng', status: 'Screening', color: '#a855f7' },
  { company: 'Linear', role: 'Product Eng', status: 'Applied', color: '#3b82f6' },
  { company: 'Notion', role: 'Full-Stack Dev', status: 'Offer', color: '#f59e0b' },
];

const MOCK_METRICS = [
  { label: 'Total Tracked', value: '47', icon: Target },
  { label: 'Active Interviews', value: '6', icon: TrendingUp },
  { label: 'Success Rate', value: '34%', icon: CheckCircle2 },
];

// ── Animation variants — same pattern as dashboard ────────────────────────────
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
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ── Primary CTA button — reused in multiple places ────────────────────────────
function CTAButton({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const px = size === 'lg' ? 'px-10 py-4' : 'px-8 py-3.5';
  const text = size === 'lg' ? 'text-base' : 'text-sm';
  return (
    <Link
      href="/dashboard"
      className={`group inline-flex items-center gap-2.5 ${px} rounded-2xl ${text} font-black uppercase tracking-widest text-white transition-all duration-300`}
      style={{
        background: ACCENT,
        boxShadow: `0 0 28px rgba(15,82,186,0.45), inset 0 1px 0 rgba(255,255,255,0.1)`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.boxShadow = `0 0 48px rgba(15,82,186,0.7), inset 0 1px 0 rgba(255,255,255,0.15)`;
        el.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.boxShadow = `0 0 28px rgba(15,82,186,0.45), inset 0 1px 0 rgba(255,255,255,0.1)`;
        el.style.transform = 'translateY(0)';
      }}
    >
      Go to Dashboard
      <ArrowRight size={size === 'lg' ? 18 : 16} className="group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}

// ── Logo — identical to Header.tsx ────────────────────────────────────────────
function Logo({ size = 'xl' }: { size?: 'xl' | '2xl' | '3xl' }) {
  const cls = `text-${size} font-bold tracking-tight text-white`;
  const clsOS = `text-${size} font-black tracking-tight`;
  return (
    <div className="inline-flex items-center">
      <span className={cls}>Career</span>
      <span className={clsOS} style={{ color: ACCENT }}>OS</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 1: HERO — full-screen immersive entry
// ════════════════════════════════════════════════════════════════════════════════
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT: Copy ── */}
          <div>
            {/* Badge — same style as dashboard Pro card label */}
            <motion.div
              {...fadeUp(0)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl mb-8"
              style={CARD}
            >
              <Sparkles size={14} className="text-blue-400" />
              <span className="text-sm font-semibold text-white/70 uppercase tracking-widest">
                AI-Powered Career Intelligence
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.1)}
              className="text-5xl sm:text-6xl xl:text-7xl font-black leading-[1.06] tracking-tight text-white mb-6"
            >
              Build a{' '}
              <RotatingText 
                words={ROTATING_WORDS} 
                interval={2400} 
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 inline-block"
              />
              <br />
              Career
            </motion.h1>

            {/* Sub */}
            <motion.p
              {...fadeUp(0.22)}
              className="text-lg text-white/55 max-w-lg leading-relaxed mb-10"
            >
              CareerOS is your AI-powered career command center. Track applications,
              generate cover letters, ace interviews with AI coaching, and score your
              resume — all in one beautiful dashboard.
            </motion.p>

            {/* CTA */}
            <motion.div {...fadeUp(0.34)} className="mb-14">
              <CTAButton size="lg" />
            </motion.div>

            {/* Stats row — same pattern as dashboard metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center gap-8"
            >
              {[
                { value: '8+', label: 'AI Features' },
                { value: '100%', label: 'Free to Use' },
                { value: '∞', label: 'Applications' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-black text-white leading-none">{s.value}</p>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Mock Dashboard Panel — same card DNA as Dashboard.tsx ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              {/* Glow behind card */}
              <div
                className="absolute inset-0 rounded-[20px] pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(15,82,186,0.25) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                  transform: 'scale(1.1)',
                }}
              />

              {/* Main panel — rounded-[20px] matches dashboard exactly */}
              <div
                className="relative rounded-[20px] overflow-hidden p-6"
                style={{ ...CARD_DEEP, boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">
                      Career Dashboard
                    </p>
                    <p className="text-lg font-black text-white tracking-tight">My Applications</p>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: 'rgba(34,197,94,0.15)',
                      color: '#4ade80',
                      border: '1px solid rgba(34,197,94,0.2)',
                    }}
                  >
                    ● Live
                  </div>
                </div>

                {/* Metrics row — same as Dashboard.tsx metric cards */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {MOCK_METRICS.map((m) => (
                    <div
                      key={m.label}
                      className="p-3 rounded-[15px] flex flex-col gap-1"
                      style={CARD}
                    >
                      <m.icon size={14} className="text-blue-400" />
                      <p className="text-lg font-black text-white leading-none">{m.value}</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Job rows */}
                <div className="space-y-2.5">
                  {MOCK_JOBS.map((job) => (
                    <div
                      key={job.company}
                      className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{job.company}</p>
                        <p className="text-xs text-white/40">{job.role}</p>
                      </div>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          background: `${job.color}18`,
                          color: job.color,
                          border: `1px solid ${job.color}30`,
                        }}
                      >
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* ATS Score bar */}
                <div
                  className="mt-5 p-4 rounded-2xl"
                  style={{ background: 'rgba(15,82,186,0.08)', border: `1px solid rgba(15,82,186,0.2)` }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-semibold text-white/70">AI ATS Score</span>
                    <span className="text-xs font-bold text-blue-400">87%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${ACCENT}, #8b5cf6)` }}
                      initial={{ width: '0%' }}
                      animate={{ width: '87%' }}
                      transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>

              {/* Floating badge — same style as dashboard's Pro Feature card label */}
              <motion.div
                className="absolute -top-4 -right-4 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest text-white"
                style={{
                  background: ACCENT,
                  boxShadow: '0 8px 24px rgba(15,82,186,0.5)',
                }}
                animate={{ rotate: [0, 2, 0, -2, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                ✨ AI-Powered
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 2: FEATURES — 8-card grid matching dashboard card DNA
// ════════════════════════════════════════════════════════════════════════════════
function Features() {
  return (
    <section id="features" className="py-24 relative">
      {/* Separator line — same pattern used between dashboard sections */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(15,82,186,0.4), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4">
            Everything You Need
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Built for serious{' '}
            <span style={{ color: ACCENT }}>job seekers</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Eight powerful AI tools working together so you can focus on what matters — landing the job.
          </p>
        </motion.div>

        {/* Card grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {FEATURES.map((feat) => (
            <motion.div
              key={feat.title}
              variants={staggerItem}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="relative group cursor-default rounded-[20px] p-6 overflow-hidden"
              style={CARD}
            >
              {/* Hover glow overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px] pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top left, ${feat.color}12, transparent 70%)` }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px] pointer-events-none"
                style={{ boxShadow: `inset 0 0 0 1px ${feat.color}30` }}
              />

              {/* Icon — same pattern as dashboard AI insight card */}
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
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 3: DASHBOARD PREVIEW — browser-chrome mock using dashboard card styles
// ════════════════════════════════════════════════════════════════════════════════
function DashboardPreview() {
  const STATUS_COLOR: Record<string, string> = {
    Interview: '#a855f7',
    Screening: '#3b82f6',
    Applied: '#06b6d4',
    Offer: '#22c55e',
    Rejected: '#ef4444',
  };

  const mockJobs = [
    { company: 'Stripe', role: 'Frontend Engineer', status: 'Interview', pct: 75 },
    { company: 'Notion', role: 'Full-Stack Dev', status: 'Screening', pct: 50 },
    { company: 'Vercel', role: 'DX Engineer', status: 'Applied', pct: 25 },
    { company: 'Linear', role: 'Product Eng', status: 'Offer', pct: 100 },
  ];

  const stats = [
    { label: 'Total Applications', value: '47', delta: '+12 this week', color: '#3b82f6' },
    { label: 'Interview Rate', value: '34%', delta: '+8% vs last month', color: '#8b5cf6' },
    { label: 'Offer Rate', value: '8.5%', delta: '↑ Improving', color: '#22c55e' },
    { label: 'ATS Score Avg', value: '82%', delta: 'Above benchmark', color: ACCENT },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
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
          className="text-center mb-14"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4">
            Dashboard Preview
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Your entire career,{' '}
            <span style={{ color: ACCENT }}>one screen</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            A command center that gives you complete visibility and AI-powered control over your job search.
          </p>
        </motion.div>

        {/* Browser chrome mock */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[24px] overflow-hidden"
          style={{ ...CARD_DEEP, boxShadow: '0 60px 120px rgba(0,0,0,0.7)' }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-3 px-5 py-3.5 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
          >
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-xs text-white/30 font-mono">careeros.app/dashboard</span>
          </div>

          {/* Body matching exactly the Dashboard screenshot */}
          <div className="p-8 lg:p-10" style={{ background: '#050814' }}>
            {/* Header */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-1">Welcome back, Vikramjeet</h3>
              <p className="text-sm text-white/60">Here's what's happening with your applications.</p>
            </div>

            {/* Top Row: AI Insights */}
            <div className="grid lg:grid-cols-3 gap-5 mb-6">
              {[
                { title: 'Insight 1', desc: 'Follow up on AI/ML trainee at Salescode — 16d ago' },
                { title: 'Insight 2', desc: 'Follow up on Web Developer Trainee at CNH Industrial Pvt. Ltd. — 16d ago' },
                { title: 'Insight 3', desc: 'Reach out to the HR departments at Salescode and CNH to inquire about the current status...' },
              ].map((insight, i) => (
                <div key={i} className="p-6 rounded-[20px] flex flex-col justify-between min-h-[160px] relative overflow-hidden" style={CARD_DEEP}>
                  <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 blur-[50px] pointer-events-none" />
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                      <Sparkles size={14} className="text-red-400" />
                    </div>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{insight.title}</span>
                  </div>
                  <p className="text-sm font-semibold text-white/90 mb-6 leading-snug relative z-10">{insight.desc}</p>
                  <button className="text-xs font-semibold text-blue-400 flex items-center gap-1 mt-auto relative z-10 hover:text-blue-300 transition-colors">
                    Take Action <ArrowRight size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom Row: Pipeline & Stats */}
            <div className="grid lg:grid-cols-3 gap-5">
              {/* Left: Application Pipeline */}
              <div className="lg:col-span-2 p-6 lg:p-8 rounded-[20px] flex flex-col relative overflow-hidden" style={CARD_DEEP}>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Application Pipeline</h4>
                    <p className="text-xs text-white/50">Status distribution overview</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> LIVE
                  </div>
                </div>
                
                {/* Chart Mockup */}
                <div className="flex-1 flex items-end gap-2 lg:gap-4 relative pt-10 border-b border-white/5 pb-2">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-white/30 pb-2">
                    <span>10</span><span>5</span><span>3</span><span>0</span>
                  </div>
                  <div className="ml-8 flex-1 flex items-end justify-around h-full">
                    {[
                      { label: 'Applied', height: '80%', color: '#3b82f6' },
                      { label: 'Screening', height: '15%', color: '#3b82f6' },
                      { label: 'Interview', height: '0%', color: '#3b82f6' },
                      { label: 'Offer', height: '15%', color: '#3b82f6' },
                      { label: 'Rejected', height: '0%', color: '#3b82f6' },
                    ].map((col) => (
                      <div key={col.label} className="flex flex-col items-center gap-3 w-full group">
                        <motion.div 
                          className="w-8 lg:w-12 rounded-t-lg relative"
                          style={{ background: col.height !== '0%' ? `linear-gradient(to top, ${col.color}40, ${col.color})` : 'transparent' }}
                          initial={{ height: 0 }}
                          whileInView={{ height: col.height }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        >
                           {col.height !== '0%' && (
                             <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
                           )}
                        </motion.div>
                        <span className="text-[10px] font-medium text-white/50">{col.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Stats Column */}
              <div className="flex flex-col gap-4">
                {[
                  { value: '10', label: 'Total Tracked', icon: Target },
                  { value: '0', label: 'Active Interviews', icon: Briefcase },
                  { value: '20%', label: 'Success Rate', icon: TrendingUp },
                ].map((stat) => (
                  <div key={stat.label} className="p-5 lg:p-6 rounded-[20px] flex items-center gap-5" style={CARD_DEEP}>
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <stat.icon size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-white leading-none mb-1">{stat.value}</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  </div>
                ))}
                
                {/* Pro Feature Banner */}
                <div 
                  className="mt-auto p-5 rounded-[20px] relative overflow-hidden" 
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(15,82,186,0.15), rgba(139,92,246,0.1))', 
                    border: '1px solid rgba(139,92,246,0.2)' 
                  }}
                >
                   <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[40px] pointer-events-none" />
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Pro Feature</p>
                   <p className="text-sm font-bold text-white leading-tight">Unlock deeper market insights &amp; salary benchmarking.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 4: FINAL CTA — single conversion block, no footer clutter
// ════════════════════════════════════════════════════════════════════════════════
function FinalCTA() {
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
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(60px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 0 80px rgba(15,82,186,0.08)',
          }}
        >
          {/* Ambient blue glow */}
          <div
            className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />

          {/* Content */}
          <div className="relative z-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl mb-8"
              style={CARD}
            >
              <Sparkles size={14} className="text-blue-400" />
              <span className="text-sm text-white/60 font-semibold uppercase tracking-widest">
                Free · No credit card required
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 leading-tight">
              Start managing your career
              <br />
              <span style={{ color: ACCENT }}>like a pro</span>
            </h2>

            <p className="text-white/50 max-w-xl mx-auto mb-12">
              Join professionals using AI to land their dream jobs faster.
              Set up your dashboard in under 60 seconds.
            </p>

            <CTAButton size="lg" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}


// ════════════════════════════════════════════════════════════════════════════════
// ROOT LANDING PAGE — DarkVeil background, no navbar, four focused sections
// ════════════════════════════════════════════════════════════════════════════════
export default function LandingPage() {
  return (
    <div className="min-h-screen relative isolate" style={{ color: '#fff' }}>
      {/* DarkVeil background — IDENTICAL params to dashboard */}
      <div className="fixed inset-0 -z-10" aria-hidden="true">
        <DarkVeil
          hueShift={32}
          speed={1}
          scanlineFrequency={0.5}
          warpAmount={5}
        />
      </div>

      {/* Dark overlay so text stays readable over the shader */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: 'rgba(5,8,20,0.55)' }}
        aria-hidden="true"
      />

      <Hero />
      <ScrollMarquee />
      <Features />
      <DashboardPreview />
      <FinalCTA />
      <Footer />
    </div>
  );
}
