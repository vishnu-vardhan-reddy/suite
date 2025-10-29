'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, Upload, Lock } from 'lucide-react';
import { AdUnit } from '@repo/ui';
import CryptoJS from 'crypto-js';

interface Algorithm {
  name: string;
  key: string;
}

interface Hashes {
  [key: string]: string;
}

export const HashGenerator: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [hashes, setHashes] = useState<Hashes>({});
  const [copied, setCopied] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const algorithms: Algorithm[] = [
    { name: 'MD5', key: 'md5' },
    { name: 'SHA-1', key: 'sha1' },
    { name: 'SHA-256', key: 'sha256' },
    { name: 'SHA-384', key: 'sha384' },
    { name: 'SHA-512', key: 'sha512' }
  ];

  const generateHash = (algorithm: string, data: string): string => {
    try {
      let hash: CryptoJS.lib.WordArray;
      
      switch (algorithm) {
        case 'md5':
          hash = CryptoJS.MD5(data);
          break;
        case 'sha1':
          hash = CryptoJS.SHA1(data);
          break;
        case 'sha256':
          hash = CryptoJS.SHA256(data);
          break;
        case 'sha384':
          hash = CryptoJS.SHA384(data);
          break;
        case 'sha512':
          hash = CryptoJS.SHA512(data);
          break;
        default:
          return 'Unsupported algorithm';
      }
      
      return hash.toString(CryptoJS.enc.Hex);
    } catch (e) {
      return 'Error generating hash';
    }
  };

  useEffect(() => {
    if (!input.trim()) {
      setHashes({});
      return;
    }

    const newHashes: Hashes = {};
    for (const algo of algorithms) {
      newHashes[algo.key] = generateHash(algo.key, input);
    }
    setHashes(newHashes);
  }, [input]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInput(text);
      setInputType('text');
    };

    reader.readAsText(file);
  };

  const copyToClipboard = async (hash: string, key: string): Promise<void> => {
    await navigator.clipboard.writeText(hash);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const clearAll = (): void => {
    setInput('');
    setHashes({});
    setFileName('');
  };

  const loadSample = (): void => {
    setInput('Hello, World!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-6">
          <AdUnit size="leaderboard" className="hidden md:flex" />
          <AdUnit size="mobile-banner" className="md:hidden" />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
            Hash Generator
          </h1>
          <p className="text-gray-400">Generate cryptographic hashes for your data</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 mb-6 border border-slate-700">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setInputType('text')}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  inputType === 'text' ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                Text Input
              </button>
              <button
                onClick={() => setInputType('file')}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  inputType === 'file' ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                <Upload className="w-4 h-4 inline mr-1" />
                File Input
              </button>
            </div>

            <div className="flex-1"></div>

            <button onClick={loadSample} className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 text-sm">
              Load Sample
            </button>

            <button onClick={clearAll} className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 text-sm">
              Clear All
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-200">Input</h2>
              <span className="text-xs text-gray-500">{input.length} chars</span>
            </div>

            {inputType === 'text' ? (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to hash..."
                className="w-full h-96 bg-slate-800/50 text-gray-100 px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-orange-500 font-mono text-sm resize-none"
                spellCheck={false}
              />
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-orange-500 transition-colors h-96 flex flex-col items-center justify-center">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="hash-file-upload"
                  />
                  <label htmlFor="hash-file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-300 mb-1">Click to upload file</p>
                    <p className="text-gray-500 text-sm">Text files supported</p>
                  </label>
                  {fileName && (
                    <div className="mt-4 bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                      <p className="text-sm text-gray-400">Selected file:</p>
                      <p className="text-gray-200 font-medium truncate">{fileName}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h2 className="text-lg font-semibold text-gray-200">Hash Output</h2>

            {Object.keys(hashes).length > 0 ? (
              <div className="space-y-3">
                {algorithms.map((algo) => (
                  <div key={algo.key} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-300">{algo.name}</h3>
                      <button
                        onClick={() => copyToClipboard(hashes[algo.key] ?? '', algo.key)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs transition-colors"
                      >
                        {copied === algo.key ? (
                          <>
                            <Check className="w-3 h-3 text-green-400" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-xs text-gray-300 break-all">
                      {hashes[algo.key]}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {hashes[algo.key]?.length} characters
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-96 bg-slate-800/30 rounded-xl border border-slate-700 border-dashed flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  Enter text or upload a file<br />to generate hashes
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-slate-800/30 backdrop-blur rounded-lg p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">About Hash Algorithms:</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-400">
            <div>
              <span className="text-orange-400 font-mono">MD5:</span> 128-bit hash, fast but not cryptographically secure
            </div>
            <div>
              <span className="text-red-400 font-mono">SHA-1:</span> 160-bit hash, legacy use only
            </div>
            <div>
              <span className="text-yellow-400 font-mono">SHA-256:</span> 256-bit hash, secure and widely used
            </div>
            <div>
              <span className="text-green-400 font-mono">SHA-384:</span> 384-bit hash, highly secure
            </div>
            <div className="md:col-span-2">
              <span className="text-blue-400 font-mono">SHA-512:</span> 512-bit hash, maximum security
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <AdUnit size="rectangle" />
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>All hashing done locally • No data transmitted • Instant results</p>
        </div>
      </div>
    </div>
  );
};