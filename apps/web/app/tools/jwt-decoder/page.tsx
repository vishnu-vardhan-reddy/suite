import { Metadata } from 'next';
import { JWTDecoder } from '@/components/tools/jwt-decoder';

export const metadata: Metadata = {
  title: 'JWT Decoder & Verifier',
  description: 'Decode, validate, and verify JSON Web Tokens (JWT). Check JWT signatures and view decoded header and payload.',
  keywords: ['jwt', 'jwt decoder', 'jwt validator', 'json web token', 'jwt verify', 'decode jwt'],
};

export default function Page() {
  return <JWTDecoder />;
}