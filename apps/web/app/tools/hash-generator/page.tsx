import { Metadata } from 'next';
import { HashGenerator } from '@/components/tools/hash-generator';

export const metadata: Metadata = {
  title: 'Hash Generator',
  description: 'Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes for your data.',
};

export default function Page() {
  return <HashGenerator />;
}