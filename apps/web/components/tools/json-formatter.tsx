'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, AlertCircle, FileJson } from 'lucide-react';
import { AdUnit } from '@repo/ui';

export const JSONFormatter: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [indent, setIndent] = useState<number>(2);
  const [sortKeys, setSortKeys] = useState<boolean>(false);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      let parsed: any = JSON.parse(input);
      
      if (sortKeys) {
        parsed = sortObjectKeys(parsed);
      }
      
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setOutput('');
    }
  }, [input, indent, sortKeys]);

  const sortObjectKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((sorted: any, key) => {
          sorted[key] = sortObjectKeys(obj[key]);
          return sorted;
        }, {});
    }
    return obj;
  };

  const copyToClipboard = async (): Promise<void> => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearAll = (): void => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadSample = (): void => {
    const sample = {
      "name": "John Doe",
      "age": 30,
      "email": "john@example.com",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "zipCode": "10001"
      },
      "hobbies": ["reading", "gaming", "coding"],
      "isActive": true
    };
    setInput(JSON.stringify(sample, null, 2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-6">
          <AdUnit size="leaderboard" className="hidden md:flex" />
          <AdUnit size="mobile-banner" className="md:hidden" />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-lg">
            <FileJson className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            JSON Formatter & Validator
          </h1>
          <p className="text-gray-400">Format, validate, and beautify your JSON data</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 mb-6 border border-slate-700">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-300">Indent:</label>
              <select
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="bg-slate-700 text-gray-100 px-3 py-1.5 rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Minified</option>
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={sortKeys}
                onChange={(e) => setSortKeys(e.target.checked)}
                className="w-4 h-4"
              />
              Sort Keys
            </label>

            <div className="flex-1"></div>

            <button onClick={loadSample} className="px-4 py-1.5 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 text-sm">
              Load Sample
            </button>

            <button onClick={clearAll} className="px-4 py-1.5 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 text-sm">
              Clear All
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-200">Input JSON</h2>
              <span className="text-xs text-gray-500">{input.length} characters</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"key": "value"}'
              className="w-full h-96 bg-slate-800/50 text-gray-100 px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
              spellCheck={false}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-200">
                {error ? 'Validation Error' : 'Formatted Output'}
              </h2>
              {output && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  {copied ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
                </button>
              )}
            </div>

            {error ? (
              <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-medium mb-1">Invalid JSON</p>
                    <p className="text-red-300 text-sm font-mono">{error}</p>
                  </div>
                </div>
              </div>
            ) : output ? (
              <div className="relative">
                <pre className="w-full h-96 bg-slate-800/50 text-gray-100 px-4 py-3 rounded-xl border border-slate-700 font-mono text-sm overflow-auto">
                  {output}
                </pre>
                <div className="absolute top-4 right-4 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  ✓ Valid JSON
                </div>
              </div>
            ) : (
              <div className="w-full h-96 bg-slate-800/30 rounded-xl border border-slate-700 border-dashed flex items-center justify-center">
                <p className="text-gray-500 text-center">Enter JSON to see formatted output</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <AdUnit size="leaderboard" className="hidden md:flex" />
          <AdUnit size="mobile-banner" className="md:hidden" />
        </div>

        {output && !error && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-gray-400 text-sm mb-1">Lines</p>
              <p className="text-2xl font-bold text-blue-400">{output.split('\n').length}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-gray-400 text-sm mb-1">Characters</p>
              <p className="text-2xl font-bold text-cyan-400">{output.length}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-gray-400 text-sm mb-1">Indent</p>
              <p className="text-2xl font-bold text-purple-400">{indent || 0}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-gray-400 text-sm mb-1">Size</p>
              <p className="text-2xl font-bold text-green-400">{(output.length / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};