import { type Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy | CareerOS — AI-Powered Career Intelligence Platform',
  description:
    'Read the CareerOS Privacy Policy. Learn exactly what data we collect, how it is used, who we share it with, and how you can control or delete your data.',
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
