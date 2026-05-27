'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ArrowRight,
  Send,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  Bug,
  MessageSquare,
  Handshake,
  Star,
  Code2,
  ChevronRight,
} from 'lucide-react';
import DarkVeil from '../../components/DarkVeil';
import Footer from '../../components/landing/Footer';

// ── Design tokens — exact same DNA as rest of app ────────────────────────────
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

// ── Animation variants ────────────────────────────────────────────────────────
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

// ── Developer Data ────────────────────────────────────────────────────────────
const DEVELOPERS = [
  {
    name: 'Birjyot Singh Sahiwal',
    role: 'Full-Stack Engineer & Product Lead',
    bio: 'Architected the core CareerOS platform. Specializes in Flask APIs, Next.js, PostgreSQL, and production deployment.',
    github: 'https://github.com/Birjyot',
    email: 'birjyotsahiwal7@gmail.com',
    linkedin: 'https://www.linkedin.com/in/birjyot-singh-sahiwal-12889a21a/',
    initials: 'BS',
    gradient: 'linear-gradient(135deg, #0F52BA, #3b82f6)',
    accentColor: '#3b82f6',
    skills: ['Flask', 'Next.js', 'PostgreSQL', 'Google Cloud'],
  },
  {
    name: 'Tejasav Singh',
    role: 'AI Systems Engineer & Backend Developer',
    bio: 'Built the AI router, Gmail sync engine, and ATS scoring pipeline. Expert in multi-provider AI systems and OAuth2.',
    github: 'https://github.com/stejasav',
    email: 'tejasavsingh2528@gmail.com',
    linkedin: 'https://www.linkedin.com/in/tejasav-singh-63b618276/',
    initials: 'TS',
    gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    accentColor: '#a855f7',
    skills: ['Gemini AI', 'Groq', 'Python', 'OAuth2'],
  },
  {
    name: 'Vikramjeet Singh Layal',
    role: 'Frontend Engineer & UI/UX Designer',
    bio: 'Designed and built the entire UI — from the immersive landing page to analytics dashboards and Kanban boards.',
    github: 'https://github.com/vjlayal',
    email: 'vjlayal777@gmail.com',
    linkedin: 'https://www.linkedin.com/in/vikramjeet-singh-layal/',
    initials: 'VL',
    gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)',
    accentColor: '#06b6d4',
    skills: ['React', 'Framer Motion', 'Tailwind CSS', 'Recharts'],
  },
];

// ── Contact Reasons ───────────────────────────────────────────────────────────
const CONTACT_REASONS = [
  {
    icon: Bug,
    title: 'Bug Report',
    desc: 'Found something broken? Describe the issue, steps to reproduce, and expected behavior.',
    color: '#ef4444',
    mailto: 'birjyotsahiwal7@gmail.com',
  },
  {
    icon: MessageSquare,
    title: 'Product Feedback',
    desc: "Have ideas to make CareerOS better? We read every message and build features users request.",
    color: '#22c55e',
    mailto: 'birjyotsahiwal7@gmail.com',
  },
  {
    icon: Handshake,
    title: 'Partnership & Collaboration',
    desc: 'Interested in integrating, collaborating, or building on top of CareerOS?',
    color: '#3b82f6',
    mailto: 'birjyotsahiwal7@gmail.com',
  },
  {
    icon: Code2,
    title: 'Contribute to the Project',
    desc: 'CareerOS is open to contributors. Check our GitHub for open issues and contribution guidelines.',
    color: '#f59e0b',
    mailto: 'https://github.com/Birjyot/CareerOS',
    isExternal: true,
  },
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
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl mb-8" style={CARD}>
          <Sparkles size={14} className="text-blue-400" />
          <span className="text-sm font-semibold text-white/70 uppercase tracking-widest">Get in Touch</span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.1)}
          className="text-5xl sm:text-6xl xl:text-7xl font-black leading-[1.06] tracking-tight text-white mb-6"
        >
          We&apos;d love to{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            hear from you.
          </span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-4"
        >
          Whether you&apos;ve found a bug, have a feature idea, want to collaborate, or just want to say
          hi — our team reads every message and responds personally.
        </motion.p>

        <motion.p {...fadeUp(0.28)} className="text-sm text-white/30 max-w-lg mx-auto">
          We&apos;re a small team of three developers who care deeply about CareerOS. Expect a real
          human response, not an auto-reply.
        </motion.p>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// DEVELOPER CARDS
// ════════════════════════════════════════════════════════════════════════════
function DeveloperCards() {
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
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4">The Team</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Reach us directly
          </h2>
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
              className="group rounded-[24px] p-7 relative overflow-hidden"
              style={CARD}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[24px]"
                style={{ background: `radial-gradient(ellipse at top, ${dev.accentColor}08, transparent 60%)` }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[24px]"
                style={{ boxShadow: `inset 0 0 0 1px ${dev.accentColor}20` }}
              />

              <div className="relative z-10">
                {/* Avatar */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white"
                    style={{ background: dev.gradient }}
                  >
                    {dev.initials}
                  </div>
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.4)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(59,130,246,0.15)';
                      (e.currentTarget as HTMLAnchorElement).style.color = '#60a5fa';
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(59,130,246,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.4)';
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)';
                    }}
                  >
                    <Linkedin size={16} />
                  </a>
                </div>

                <h3 className="text-base font-black text-white mb-0.5">{dev.name}</h3>
                <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: dev.accentColor }}>
                  {dev.role}
                </p>
                <p className="text-sm text-white/45 leading-relaxed mb-5">{dev.bio}</p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {dev.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.45)',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Contact links */}
                <div
                  className="flex flex-col gap-2 pt-4"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <a
                    href={`mailto:${dev.email}`}
                    id={`email-${dev.initials}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = `${dev.accentColor}12`;
                      (e.currentTarget as HTMLAnchorElement).style.color = dev.accentColor;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.6)';
                    }}
                  >
                    <Mail size={14} />
                    {dev.email}
                  </a>
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`github-${dev.initials}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = `rgba(255,255,255,0.06)`;
                      (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.6)';
                    }}
                  >
                    <Github size={14} />
                    GitHub
                    <ExternalLink size={12} className="ml-auto text-white/30" />
                  </a>
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
// CONTACT FORM
// ════════════════════════════════════════════════════════════════════════════

const fieldBase = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#fff',
  borderRadius: '12px',
  outline: 'none',
  transition: 'all 0.2s',
} as React.CSSProperties;

const fieldFocusStyle = {
  borderColor: 'rgba(15,82,186,0.5)',
  background: 'rgba(15,82,186,0.05)',
  boxShadow: '0 0 0 3px rgba(15,82,186,0.1)',
};

function InputField({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 text-sm placeholder:text-white/20"
        style={fieldBase}
        onFocus={(e) => Object.assign(e.currentTarget.style, fieldFocusStyle)}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      {error && (
        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [status, setStatus] = useState<FormStatus>('idle');

  const SUBJECTS = [
    'Bug Report',
    'Feature Request',
    'Partnership Inquiry',
    'General Feedback',
    'Technical Support',
    'Other',
  ];

  function validate(): boolean {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'A valid email is required.';
    }
    if (!formData.subject) newErrors.subject = 'Please select a subject.';
    if (formData.message.trim().length < 20) newErrors.message = 'Message must be at least 20 characters.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/contact` : 'http://localhost:5001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
    
    setTimeout(() => setStatus('idle'), 5000);
  }


  return (
    <section className="py-16 relative">
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(15,82,186,0.3), transparent)' }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4">Send a Message</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Have something to say?
            </h2>
            <p className="text-white/50 leading-relaxed mb-8">
              Fill out the form and it&apos;ll land directly in our inbox. We&apos;re a small team — we
              typically respond within 24–48 hours.
            </p>

            {/* Reason cards */}
            <div className="space-y-3">
              {CONTACT_REASONS.map((reason) => (
                <motion.div
                  key={reason.title}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="flex items-center gap-4 p-4 rounded-xl group cursor-pointer"
                  style={CARD}
                  onClick={() =>
                    reason.isExternal
                      ? window.open(reason.mailto, '_blank')
                      : (window.location.href = `mailto:${reason.mailto}?subject=[CareerOS] ${reason.title}`)
                  }
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${reason.color}15`, border: `1px solid ${reason.color}25` }}
                  >
                    <reason.icon size={16} style={{ color: reason.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{reason.title}</p>
                    <p className="text-xs text-white/40 leading-relaxed">{reason.desc}</p>
                  </div>
                  <ChevronRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="rounded-[24px] p-8" style={CARD_DEEP}>
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mb-5">
                      <CheckCircle size={28} className="text-green-400" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">Message sent!</h3>
                    <p className="text-sm text-white/50 max-w-xs">
                      Your message has been successfully sent. We&apos;ll get back to you within 24–48 hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <InputField
                        id="contact-name"
                        label="Your Name"
                        placeholder="Alex Johnson"
                        value={formData.name}
                        onChange={(v) => { setFormData((p) => ({ ...p, name: v })); setErrors((e) => ({ ...e, name: '' })); }}
                        error={errors.name}
                      />
                      <InputField
                        id="contact-email"
                        label="Email Address"
                        type="email"
                        placeholder="alex@example.com"
                        value={formData.email}
                        onChange={(v) => { setFormData((p) => ({ ...p, email: v })); setErrors((e) => ({ ...e, email: '' })); }}
                        error={errors.email}
                      />
                    </div>

                    {/* Subject Select */}
                    <div>
                      <label htmlFor="contact-subject" className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                        Subject
                      </label>
                      <select
                        id="contact-subject"
                        value={formData.subject}
                        onChange={(e) => { setFormData((p) => ({ ...p, subject: e.target.value })); setErrors((er) => ({ ...er, subject: '' })); }}
                        className="w-full px-4 py-3 text-sm"
                        style={{
                          ...{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: formData.subject ? '#fff' : 'rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            outline: 'none',
                            cursor: 'pointer',
                          },
                        }}
                      >
                        <option value="" disabled style={{ background: '#050814' }}>Select a subject…</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s} style={{ background: '#050814' }}>{s}</option>
                        ))}
                      </select>
                      {errors.subject && (
                        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={11} />
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="contact-message" className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        placeholder="Describe your feedback, bug, or inquiry in detail…"
                        value={formData.message}
                        onChange={(e) => { setFormData((p) => ({ ...p, message: e.target.value })); setErrors((er) => ({ ...er, message: '' })); }}
                        className="w-full px-4 py-3 text-sm resize-none placeholder:text-white/20"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#fff',
                          borderRadius: '12px',
                          outline: 'none',
                          transition: 'all 0.2s',
                        }}
                        onFocus={(e) => Object.assign(e.currentTarget.style, {
                          borderColor: 'rgba(15,82,186,0.5)',
                          background: 'rgba(15,82,186,0.05)',
                          boxShadow: '0 0 0 3px rgba(15,82,186,0.1)',
                        })}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                      <div className="flex items-center justify-between mt-1">
                        {errors.message ? (
                          <p className="text-xs text-red-400 flex items-center gap-1">
                            <AlertCircle size={11} />
                            {errors.message}
                          </p>
                        ) : (
                          <span />
                        )}
                        <p className="text-xs text-white/25">{formData.message.length} chars</p>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      id="contact-submit"
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: ACCENT,
                        boxShadow: `0 0 24px rgba(15,82,186,0.35), inset 0 1px 0 rgba(255,255,255,0.1)`,
                      }}
                      onMouseEnter={(e) => {
                        if (status !== 'loading') {
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 40px rgba(15,82,186,0.6), inset 0 1px 0 rgba(255,255,255,0.15)`;
                          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 24px rgba(15,82,186,0.35), inset 0 1px 0 rgba(255,255,255,0.1)`;
                        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                      }}
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Message
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// FOOTER CTA
// ════════════════════════════════════════════════════════════════════════════
function FooterCTA() {
  return (
    <section className="py-20 relative">
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(15,82,186,0.3), transparent)' }}
      />
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="rounded-[24px] p-12 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(15,82,186,0.08), transparent 65%)' }}
          />
          <div className="relative z-10">
            <Star size={20} className="text-blue-400 mx-auto mb-5" />
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Prefer to connect directly?
            </h2>
            <p className="text-white/50 mb-8 max-w-lg mx-auto">
              Our GitHub is always open. Star the repo, open an issue, or fork and contribute — we
              welcome the community.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://github.com/Birjyot/CareerOS"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200"
                style={CARD}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <Github size={16} />
                Visit GitHub
                <ExternalLink size={13} className="text-white/40" />
              </a>
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest text-white transition-all duration-300"
                style={{
                  background: ACCENT,
                  boxShadow: `0 0 24px rgba(15,82,186,0.35)`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.boxShadow = `0 0 40px rgba(15,82,186,0.6)`;
                  el.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.boxShadow = `0 0 24px rgba(15,82,186,0.35)`;
                  el.style.transform = 'translateY(0)';
                }}
              >
                Try CareerOS Free
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
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
export default function ContactClient() {
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
      <DeveloperCards />
      <ContactForm />
      <FooterCTA />
      <Footer />
    </div>
  );
}
