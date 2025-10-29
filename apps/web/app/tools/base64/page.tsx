import { Metadata } from 'next';
import { Base64Converter } from '@/components/tools/base64';

export const metadata: Metadata = {
  title: 'Base64 Encoder/Decoder',
  description: 'Encode and decode text, images, and files to Base64 format.',
};

export default function Page() {
  return <Base64Converter />;
}