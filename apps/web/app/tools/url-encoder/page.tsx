import { Metadata } from 'next';
import { URLEncoder } from '@/components/tools/url-encoder';

export const metadata: Metadata = {
  title: 'URL Encoder/Decoder',
  description: 'Encode and decode URLs for safe transmission.',
};

export default function Page() {
  return <URLEncoder />;
}