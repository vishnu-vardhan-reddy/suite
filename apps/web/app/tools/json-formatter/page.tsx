import { Metadata } from 'next';
import { JSONFormatter } from '@/components/tools/json-formatter';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator',
  description: 'Format and validate JSON data instantly. Free, fast, and privacy-focused.',
};

export default function Page() {
  return <JSONFormatter />;
}