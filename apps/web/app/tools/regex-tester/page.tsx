import { Metadata } from 'next';
import { RegexTester } from '@/components/tools/regex-tester';

export const metadata: Metadata = {
  title: 'Regex Tester',
  description: 'Test and debug regular expressions in real-time with live highlighting.',
};

export default function Page() {
  return <RegexTester />;
}