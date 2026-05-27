import { type Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | CareerOS — AI-Powered Career Intelligence Platform',
  description:
    'Get in touch with the CareerOS team. Report bugs, request features, explore partnerships, or contribute to the open-source project.',
};

export default function ContactPage() {
  return <ContactClient />;
}
