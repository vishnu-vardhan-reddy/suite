'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, Search, AlertCircle, BookOpen } from 'lucide-react';
import { AdUnit } from '@repo/ui';

interface Match {
  match: string;
  index: number;
  groups: string[];
}

interface HighlightPart {
  text: string;
  isMatch: boolean;
  index?: number;
}

interface Example {
  name: string;
  pattern: string;
  test: string;
}

interface CheatsheetItem {
  pattern: string;
  desc: string;
}

interface CheatsheetCategory {
  cat: string;
  items: CheatsheetItem[];
}

export const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState<string>('');
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean }>({ g: true, i: false, m: false });
  const [testString, setTestString] = useState<string>('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showCheatsheet, setShowCheatsheet] = useState<boolean>(false);

  const examples: Example[] = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', test: 'Contact: john@example.com or jane.doe@company.org' },
    { name: 'URL', pattern: 'https?://[^\\s]+', test: 'Visit https://example.com or http://test.org for more info' },
    { name: 'Phone', pattern: '\\(\\d{3}\\)\\s?\\d{3}-\\d{4}', test: 'Call (555) 123-4567 or (555)987-6543' },
    { name: 'Hex Color', pattern: '#[0-9a-fA-F]{6}', test: 'Colors: #FF5733, #C70039, #900C3F' },
    { name: 'IPv4', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', test: 'Servers: 192.168.1.1 and 10.0.0.1' }
  ];

  useEffect(() => {
    if (!pattern || !testString) {
      setMatches([]);
      setError('');
      return;
    }

    try {
      const flagStr = Object.entries(flags)
        .filter(([_, v]) => v)
        .map(([k]) => k)
        .join('');
      
      const regex = new RegExp(pattern, flagStr);
      const allMatches: Match[] = [];
      
      if (flags.g) {
        let match: RegExpExecArray | null;
        while ((match = regex.exec(testString)) !== null) {
          allMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          allMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }
      
      setMatches(allMatches);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setMatches([]);
    }
  }, [pattern, flags, testString]);

  const highlightMatches = (): HighlightPart[] => {
    if (!testString || matches.length === 0) {
      return [{ text: testString, isMatch: false }];
    }

    const parts: HighlightPart[] = [];
    let lastIndex = 0;

    matches.forEach((match, idx) => {
      if (match.index > lastIndex) {
        parts.push({
          text: testString.slice(lastIndex, match.index),
          isMatch: false
        });
      }
      
      parts.push({
        text: match.match,
        isMatch: true,
        index: idx
      });
      
      lastIndex = match.index + match.match.length;
    });

    if (lastIndex < testString.length) {
      parts.push({
        text: testString.slice(lastIndex),
        isMatch: false
      });
    }

    return parts;
  };

  const copyToClipboard = async (): Promise<void> => {
    const flagStr = Object.entries(flags)
      .filter(([_, v]) => v)
      .map(([k]) => k)
      .join('');
    
    await navigator.clipboard.writeText(`/${pattern}/${flagStr}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = (example: Example): void => {
    setPattern(example.pattern);
    setTestString(example.test);
    setFlags({ g: true, i: false, m: false });
  };

  const clearAll = (): void => {
    setPattern('');
    setTestString('');
    setMatches([]);
    setError('');
  };

  const cheatsheetItems: CheatsheetCategory[] = [
    { cat: 'Character Classes', items: [
      { pattern: '.', desc: 'Any character except newline' },
      { pattern: '\\d', desc: 'Digit (0-9)' },
      { pattern: '\\D', desc: 'Not a digit' },
      { pattern: '\\w', desc: 'Word character' },
      { pattern: '\\W', desc: 'Not a word character' },
      { pattern: '\\s', desc: 'Whitespace' },
      { pattern: '\\S', desc: 'Not whitespace' }
    ]},
    { cat: 'Quantifiers', items: [
      { pattern: '*', desc: '0 or more' },
      { pattern: '+', desc: '1 or more' },
      { pattern: '?', desc: '0 or 1' },
      { pattern: '{n}', desc: 'Exactly n times' },
      { pattern: '{n,}', desc: 'n or more times' },
      { pattern: '{n,m}', desc: 'Between n and m times' }
    ]},
    { cat: 'Anchors', items: [
      { pattern: '^', desc: 'Start of string/line' },
      { pattern: '$', desc: 'End of string/line' },
      { pattern: '\\b', desc: 'Word boundary' },
      { pattern: '\\B', desc: 'Not a word boundary' }
    ]},
    { cat: 'Groups', items: [
      { pattern: '(abc)', desc: 'Capture group' },
      { pattern: '(?:abc)', desc: 'Non-capturing group' },
      { pattern: 'a|b', desc: 'Match a or b' }
    ]}
  ];

  const highlightedParts = highlightMatches();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-6">
          <AdUnit size="leaderboard" className="hidden md:flex" />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Regex Tester
          </h1>
          <p className="text-gray-400">Test and debug regular expressions in real-time</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 mb-6 border border-slate-700">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowCheatsheet(!showCheatsheet)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
            >
              <BookOpen className="w-4 h-4" />
              {showCheatsheet ? 'Hide' : 'Show'} Cheatsheet
            </button>

            <div className="flex gap-2 flex-wrap">
              {examples.map((ex) => (
                <button
                  key={ex.name}
                  onClick={() => loadExample(ex)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-sm"
                >
                  {ex.name}
                </button>
              ))}
            </div>

            <div className="flex-1"></div>

            <button onClick={clearAll} className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 text-sm">
              Clear
            </button>
          </div>
        </div>

        {showCheatsheet && (
          <div className="bg-slate-800/50 rounded-xl p-6 mb-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Quick Reference</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cheatsheetItems.map((category) => (
                <div key={category.cat}>
                  <h4 className="text-sm font-semibold text-indigo-400 mb-2">{category.cat}</h4>
                  <div className="space-y-1.5">
                    {category.items.map((item, idx) => (
                      <div key={idx} className="text-xs">
                        <code className="bg-slate-700/50 px-1.5 py-0.5 rounded text-purple-300">
                          {item.pattern}
                        </code>
                        <span className="text-gray-400 ml-2">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-200">Regular Expression</h2>
                {pattern && (
                  <button onClick={copyToClipboard} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm">
                    {copied ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xl">/</span>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Enter regex pattern..."
                  className="flex-1 bg-slate-800/50 text-gray-100 px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-indigo-500 font-mono"
                  spellCheck={false}
                />
                <span className="text-gray-400 text-xl">/</span>
                <div className="flex gap-1">
                  {(['g', 'i', 'm'] as const).map((flag) => (
                    <button
                      key={flag}
                      onClick={() => setFlags({ ...flags, [flag]: !flags[flag] })}
                      className={`w-10 h-10 rounded-lg font-mono font-semibold transition-all ${
                        flags[flag] ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                      }`}
                    >
                      {flag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 text-xs text-gray-400">
                <span className={flags.g ? 'text-indigo-400' : ''}>g: global</span>
                <span>•</span>
                <span className={flags.i ? 'text-indigo-400' : ''}>i: case insensitive</span>
                <span>•</span>
                <span className={flags.m ? 'text-indigo-400' : ''}>m: multiline</span>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-medium mb-1">Invalid Pattern</p>
                      <p className="text-red-300 text-sm font-mono">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-200">Test String</h2>
              <textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter test string..."
                className="w-full h-64 bg-slate-800/50 text-gray-100 px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-indigo-500 font-mono text-sm resize-none"
                spellCheck={false}
              />
            </div>

            {testString && !error && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-200">Highlighted Matches</h2>
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 font-mono text-sm min-h-[200px] whitespace-pre-wrap break-words">
                  {highlightedParts.map((part, idx) => (
                    part.isMatch ? (
                      <span
                        key={idx}
                        className="bg-indigo-600/30 border-b-2 border-indigo-500 text-indigo-200 px-1"
                        title={`Match ${(part.index ?? 0) + 1}`}
                      >
                        {part.text}
                      </span>
                    ) : (
                      <span key={idx} className="text-gray-300">{part.text}</span>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-200">Match Details</h2>
            
            {!pattern || !testString ? (
              <div className="bg-slate-800/30 rounded-xl border border-slate-700 border-dashed p-8 text-center min-h-[400px] flex items-center justify-center">
                <p className="text-gray-500">Enter a pattern and test string<br />to see match details</p>
              </div>
            ) : error ? (
              <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-4">
                <p className="text-gray-500 text-center">Fix the pattern error to see matches</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-8 text-center">
                <p className="text-yellow-400 font-medium mb-1">No Matches Found</p>
                <p className="text-gray-500 text-sm">Try adjusting your pattern</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-green-900/20 border border-green-800 rounded-lg p-3">
                  <p className="text-green-400 font-medium text-center">
                    {matches.length} {matches.length === 1 ? 'Match' : 'Matches'} Found
                  </p>
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {matches.map((match, idx) => (
                    <div key={idx} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-semibold text-indigo-400">Match {idx + 1}</span>
                        <span className="text-xs text-gray-500">Index: {match.index}</span>
                      </div>
                      <div className="bg-slate-900/50 rounded p-2 font-mono text-sm text-indigo-200 break-all">
                        {match.match}
                      </div>
                      {match.groups.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-700">
                          <p className="text-xs text-gray-400 mb-1">Capture Groups:</p>
                          <div className="space-y-1">
                            {match.groups.map((group, gidx) => (
                              <div key={gidx} className="text-xs">
                                <span className="text-purple-400">Group {gidx + 1}:</span>
                                <span className="text-gray-300 ml-2 font-mono">{group}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <AdUnit size="rectangle" />
        </div>
      </div>
    </div>
  );
};