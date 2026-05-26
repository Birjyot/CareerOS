'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

const LINKS = {
  Product: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Features', href: '#features' },
    { label: 'Prepify AI', href: 'https://prepify-one.vercel.app/' },
  ],
  Resources: [
    { label: 'Resume Tips', href: '#' },
    { label: 'Interview Guide', href: '#' },
    { label: 'Career Blog', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        borderColor: 'rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(40px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center mb-4">
              <span className="text-xl font-bold text-white">Career</span>
              <span
                className="text-xl font-black"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                OS
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs mb-6">
              Your AI-powered career command center. Track, optimize, and accelerate
              your job search with cutting-edge AI.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Github, href: 'https://github.com/Birjyot/CareerOS', label: 'GitHub' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.45)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(59,130,246,0.15)';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#60a5fa';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(59,130,246,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">
                {category}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white/90 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} CareerOS. All rights reserved.
          </p>
          <p className="text-xs text-white/25">
            Built with ❤️ using Next.js, Flask & AI
          </p>
        </div>
      </div>
    </footer>
  );
}
