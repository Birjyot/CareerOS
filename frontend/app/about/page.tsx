import { type Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us | CareerOS — AI-Powered Career Intelligence Platform',
  description:
    'Learn about CareerOS — the AI-powered job tracking and career management platform built to help you land your dream job faster, smarter, and with more confidence.',
};

export default function AboutPage() {
  return <AboutClient />;
}
