import Link from 'next/link';

export const Header = () => {
  return (
    <header className="bg-blue-900/80 backdrop-blur border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            VeloKit
          </Link>
          <nav className="flex gap-6">
            <Link href="/#tools" className="text-gray-400 hover:text-gray-200 transition-colors">
              Tools
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};