import Link from 'next/link';
import { FileJson, Lock, Link as LinkIcon, Hash, Search, Key, Calendar } from 'lucide-react';

const tools = [
  {
    name: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data',
    icon: FileJson,
    href: '/tools/json-formatter',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'JWT Decoder',
    description: 'Decode and verify JSON Web Tokens',
    icon: Key,
    href: '/tools/jwt-decoder',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode text and images',
    icon: Lock,
    href: '/tools/base64',
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs',
    icon: LinkIcon,
    href: '/tools/url-encoder',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-256, SHA-512 hashes',
    icon: Hash,
    href: '/tools/hash-generator',
    color: 'from-orange-500 to-red-500'
  },
  {
    name: 'Regex Tester',
    description: 'Test and debug regular expressions',
    icon: Search,
    href: '/tools/regex-tester',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    name: 'Date Time Converter',
    description: 'Convert dates, times, and timezones with ease.',
    icon: Calendar,
    href: '/tools/date-time-converter',
    color: 'from-green-500 to-lime-500'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Developer Tools Suite
          </h1>
          <p className="text-xl text-gray-400">
            Free, fast, and privacy-focused
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all hover:scale-105"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${tool.color} rounded-xl mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                  {tool.name}
                </h2>
                <p className="text-gray-400 text-sm">
                  {tool.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}