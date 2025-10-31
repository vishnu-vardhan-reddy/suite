import { Metadata } from 'next';
import { DateTimeConverter } from '@/components/tools/date-time-converter';

export const metadata: Metadata = {
  title: 'date-time-converter',
  description: 'Convert dates, times, and timezones with ease.',
};

export default function Page() {
  return <DateTimeConverter />;
}