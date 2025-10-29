'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, Link, RefreshCw } from 'lucide-react';
import { AdUnit } from '@repo/ui';

interface URLParts {
  protocol: string;
  hostname: string;
  pathname: string;
  search: string;
  hash: string;
  params: [string, string][];
}

export const URLEncoder: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [encodeType, setEncodeType] = useState<'standard' | 'full'>('standard');

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        if (encodeType === 'standard') {
          setOutput(encodeURIComponent(input));
        } else {
          setOutput(encodeURI(input));
        }
      } else {
        try {
          setOutput(decodeURIComponent(input));
        } catch {
          setOutput(decodeURI(input));
        }
      }
    } catch (e) {
      setOutput('Error: Invalid input');
    }
  }, [input, mode, encodeType]);

  const copyToClipboard = async (): Promise<void> => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const swapInputOutput = (): void => {
    if (output) {
      setInput(output);
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  const clearAll = (): void => {
    setInput('');
    setOutput('');
  };

  const loadExample = (): void => {
    if (mode === 'encode') {
      setInput('https://example.com/search?q=hello world&category=tech&limit=10');
    } else {
      setInput('https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26category%3Dtech');
    }
  };

  const parseURL = (url: string): URLParts | null => {
    if (!url.trim()) return null;
    
    try {
      const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
      return {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        params: Array.from(urlObj.searchParams.entries())
      };
    } catch {
      return null;
    }
  };

  const urlParts = mode === 'decode' && output ? parseURL(output) : parseURL(input);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-6">
          <AdUnit size="leaderboard" className="hidden md:flex" />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-4 shadow-lg">
            <Link className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
            URL Encoder/Decoder
          </h1>
          <p className="text-gray-400">Encode and decode URLs for safe transmission</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 mb-6 border border-slate-700">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setMode('encode')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  mode === 'encode' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  mode === 'decode' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                Decode
              </button>
            </div>

            {mode === 'encode' && (
              <>
                <div className="h-6 w-px bg-slate-600"></div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEncodeType('standard')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      encodeType === 'standard' ? 'bg-slate-600 text-white' : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                    }`}
                  >
                    Component
                  </button>
                  <button
                    onClick={() => setEncodeType('full')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      encodeType === 'full' ? 'bg-slate-600 text-white' : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                    }`}
                  >
                    Full URL
                  </button>
                </div>
              </>
            )}

            <div className="flex-1"></div>

            <button onClick={loadExample} className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 text-sm">
              Example
            </button>

            <button onClick={clearAll} className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 text-sm">
              Clear
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-200">
                {mode === 'encode' ? 'Input URL' : 'Encoded URL'}
              </h2>
              <span className="text-xs text-gray-500">{input.length} chars</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Enter URL or text to encode...' : 'Enter encoded URL to decode...'}
              className="w-full h-80 bg-slate-800/50 text-gray-100 px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-emerald-500 font-mono text-sm resize-none"
              spellCheck={false}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-200">
                {mode === 'encode' ? 'Encoded Output' : 'Decoded Output'}
              </h2>
              <div className="flex items-center gap-2">
                {output && (
                  <>
                    <button onClick={swapInputOutput} className="p-1.5 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg" title="Swap">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button onClick={copyToClipboard} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm">
                      {copied ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
                    </button>
                  </>
                )}
              </div>
            </div>

            {output ? (
              <textarea
                value={output}
                readOnly
                className="w-full h-80 bg-slate-800/50 text-gray-100 px-4 py-3 rounded-xl border border-slate-700 font-mono text-sm resize-none"
                spellCheck={false}
              />
            ) : (
              <div className="w-full h-80 bg-slate-800/30 rounded-xl border border-slate-700 border-dashed flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  {mode === 'encode' ? 'Encoded URL will appear here' : 'Decoded URL will appear here'}
                </p>
              </div>
            )}
          </div>
        </div>

        {urlParts && (
          <div className="mt-6 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">URL Components</h3>
            <div className="space-y-3">
              {urlParts.protocol && (
                <div className="flex">
                  <span className="text-gray-400 w-24">Protocol:</span>
                  <span className="text-emerald-400 font-mono">{urlParts.protocol}</span>
                </div>
              )}
              {urlParts.hostname && (
                <div className="flex">
                  <span className="text-gray-400 w-24">Host:</span>
                  <span className="text-teal-400 font-mono">{urlParts.hostname}</span>
                </div>
              )}
              {urlParts.pathname && urlParts.pathname !== '/' && (
                <div className="flex">
                  <span className="text-gray-400 w-24">Path:</span>
                  <span className="text-cyan-400 font-mono">{urlParts.pathname}</span>
                </div>
              )}
              {urlParts.params && urlParts.params.length > 0 && (
                <div>
                  <span className="text-gray-400 block mb-2">Query Parameters:</span>
                  <div className="bg-slate-700/50 rounded-lg p-3 space-y-1.5">
                    {urlParts.params.map(([key, value], idx) => (
                      <div key={idx} className="flex">
                        <span className="text-purple-400 font-mono">{key}</span>
                        <span className="text-gray-500 mx-2">=</span>
                        <span className="text-pink-400 font-mono">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <AdUnit size="rectangle" />
        </div>
      </div>
    </div>
  );
};