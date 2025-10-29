'use client';

import React, { useState, useEffect, JSX } from 'react';
import { Copy, Check, AlertCircle, CheckCircle, Key } from 'lucide-react';
import { AdUnit } from '@repo/ui';
import * as jose from 'jose';

interface DecodedToken {
  header: any;
  payload: any;
  signature: string;
}

export const JWTDecoder: React.FC = () => {
  const [token, setToken] = useState<string>('');
  const [decoded, setDecoded] = useState<DecodedToken | null>(null);
  const [secret, setSecret] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'header' | 'payload'>('payload');

  const base64UrlDecode = (str: string): string => {
    try {
      // Replace URL-safe characters
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      
      // Add padding if needed
      while (base64.length % 4) {
        base64 += '=';
      }
      
      // Decode base64
      const decoded = atob(base64);
      
      // Convert to UTF-8
      return decodeURIComponent(
        decoded.split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
    } catch (e) {
      throw new Error('Invalid base64 encoding');
    }
  };

  const decodeToken = (tokenString: string): DecodedToken => {
    const parts = tokenString.split('.');
    
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format. Expected 3 parts separated by dots.');
    }

    const header = JSON.parse(base64UrlDecode(parts[0] || ''));
    const payload = JSON.parse(base64UrlDecode(parts[1] || ''));
    const signature = parts[2];

    return { header, payload, signature: signature ?? '' };
  };

  useEffect(() => {
    if (!token.trim()) {
      setDecoded(null);
      setError('');
      setIsValid(null);
      return;
    }

    try {
      const decodedToken = decodeToken(token);
      setDecoded(decodedToken);
      setError('');

      // If secret is provided, verify signature
      if (secret.trim()) {
        verifySignature(token, secret);
      } else {
        setIsValid(null);
      }
    } catch (e: any) {
      setError(e.message || 'Invalid JWT token');
      setDecoded(null);
      setIsValid(false);
    }
  }, [token, secret]);

  const verifySignature = async (tokenString: string, secretKey: string): Promise<void> => {
    try {
      const secretBytes = new TextEncoder().encode(secretKey);
      await jose.jwtVerify(tokenString, secretBytes);
      setIsValid(true);
      setError('');
    } catch (e: any) {
      setIsValid(false);
      if (e.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
        setError('Invalid signature');
      } else if (e.code === 'ERR_JWT_EXPIRED') {
        setError('Token expired');
      } else {
        setError(e.message || 'Verification failed');
      }
    }
  };

  const copyToClipboard = async (text: string, key: string): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const clearAll = (): void => {
    setToken('');
    setSecret('');
    setDecoded(null);
    setError('');
    setIsValid(null);
  };

  const generateExample = async (): Promise<void> => {
    try {
      const exampleSecret = 'your-256-bit-secret';
      const secretBytes = new TextEncoder().encode(exampleSecret);
      
      const exampleToken = await new jose.SignJWT({
        sub: '1234567890',
        name: 'John Doe',
        admin: true
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secretBytes);
      
      setToken(exampleToken);
      setSecret(exampleSecret);
    } catch (e: any) {
      setError('Failed to generate example: ' + e.message);
    }
  };

  const formatJSON = (obj: any): string => {
    return JSON.stringify(obj, null, 2);
  };

  const renderTokenParts = (): JSX.Element => {
    if (!token) return <></>;
    
    const parts = token.split('.');
    if (parts.length !== 3) return <></>;

    return (
      <div className="font-mono text-xs break-all leading-relaxed">
        <span className="text-red-400">{parts[0]}</span>
        <span className="text-gray-500">.</span>
        <span className="text-purple-400">{parts[1]}</span>
        <span className="text-gray-500">.</span>
        <span className="text-cyan-400">{parts[2]}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-6">
          <AdUnit size="leaderboard" className="hidden md:flex" />
          <AdUnit size="mobile-banner" className="md:hidden" />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mb-4 shadow-lg">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            JWT Decoder & Verifier
          </h1>
          <p className="text-gray-400">Decode, validate, and verify JSON Web Tokens</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 mb-6 border border-slate-700">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={generateExample}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Generate Example
            </button>

            <button
              onClick={clearAll}
              className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors text-sm"
            >
              Clear All
            </button>

            {decoded && !error && (
              <div className="flex items-center gap-2 ml-auto">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 text-sm font-medium">Valid JWT</span>
              </div>
            )}

            {isValid === true && secret && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 text-sm font-medium">Signature Verified</span>
              </div>
            )}

            {isValid === false && secret && (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 text-sm font-medium">Invalid Signature</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Encoded */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-200">Encoded JWT</h2>
                <div className="flex gap-2">
                  {token && (
                    <button
                      onClick={() => copyToClipboard(token, 'token')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs"
                    >
                      {copied === 'token' ? <><Check className="w-3 h-3" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your JWT token here..."
                className="w-full h-64 bg-slate-800/50 text-gray-100 px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
                spellCheck={false}
              />

              {token && decoded && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Token Parts</h3>
                  {renderTokenParts()}
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-red-400"></div>
                      <span className="text-gray-400">Header (Algorithm & Token Type)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-purple-400"></div>
                      <span className="text-gray-400">Payload (Data)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-cyan-400"></div>
                      <span className="text-gray-400">Signature</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-medium mb-1">Error</p>
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Signature Verification */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-200">
                Verify Signature <span className="text-gray-500 text-sm font-normal">(Optional)</span>
              </h2>
              <p className="text-sm text-gray-400">Enter the secret key used to sign the JWT:</p>
              
              <div className="relative">
                <input
                  type="text"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="your-256-bit-secret"
                  className="w-full bg-slate-800/50 text-gray-100 px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  spellCheck={false}
                />
                {secret && (
                  <button
                    onClick={() => copyToClipboard(secret, 'secret')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {copied === 'secret' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  </button>
                )}
              </div>

              {isValid === true && (
                <div className="bg-green-900/20 border border-green-800 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <p className="text-green-400 font-medium">Valid signature</p>
                  </div>
                </div>
              )}

              {isValid === false && secret && (
                <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400 font-medium">Invalid signature</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Decoded */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-200">Decoded</h2>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-slate-700">
                <button
                  onClick={() => setActiveTab('header')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'header'
                      ? 'text-red-400 border-b-2 border-red-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Header
                </button>
                <button
                  onClick={() => setActiveTab('payload')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'payload'
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Payload
                </button>
              </div>

              {decoded ? (
                <>
                  {/* Header Tab */}
                  {activeTab === 'header' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-red-400">Header</h3>
                        <button
                          onClick={() => copyToClipboard(formatJSON(decoded.header), 'header')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs"
                        >
                          {copied === 'header' ? <><Check className="w-3 h-3" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
                        </button>
                      </div>
                      <pre className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-sm overflow-auto max-h-96 text-red-300">
                        {formatJSON(decoded.header)}
                      </pre>
                    </div>
                  )}

                  {/* Payload Tab */}
                  {activeTab === 'payload' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-purple-400">Payload</h3>
                        <button
                          onClick={() => copyToClipboard(formatJSON(decoded.payload), 'payload')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs"
                        >
                          {copied === 'payload' ? <><Check className="w-3 h-3" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
                        </button>
                      </div>
                      <pre className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-sm overflow-auto max-h-96 text-purple-300">
                        {formatJSON(decoded.payload)}
                      </pre>

                      {/* Payload Details */}
                      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                        <h4 className="text-sm font-semibold text-gray-300 mb-3">Claims</h4>
                        <div className="space-y-2 text-sm">
                          {decoded.payload.iat && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Issued At:</span>
                              <span className="text-gray-300">{new Date(decoded.payload.iat * 1000).toLocaleString()}</span>
                            </div>
                          )}
                          {decoded.payload.exp && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Expires At:</span>
                              <span className={decoded.payload.exp * 1000 < Date.now() ? 'text-red-400' : 'text-gray-300'}>
                                {new Date(decoded.payload.exp * 1000).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {decoded.payload.nbf && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Not Before:</span>
                              <span className="text-gray-300">{new Date(decoded.payload.nbf * 1000).toLocaleString()}</span>
                            </div>
                          )}
                          {decoded.payload.iss && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Issuer:</span>
                              <span className="text-gray-300 break-all">{decoded.payload.iss}</span>
                            </div>
                          )}
                          {decoded.payload.sub && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Subject:</span>
                              <span className="text-gray-300 break-all">{decoded.payload.sub}</span>
                            </div>
                          )}
                          {decoded.payload.aud && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Audience:</span>
                              <span className="text-gray-300 break-all">{decoded.payload.aud}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-96 bg-slate-800/30 rounded-xl border border-slate-700 border-dashed flex items-center justify-center">
                  <p className="text-gray-500 text-center">
                    Paste a JWT token to decode it
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <AdUnit size="rectangle" />
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-slate-800/30 backdrop-blur rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">About JWT</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-400">
            <div>
              <h4 className="text-gray-300 font-medium mb-2">What is JWT?</h4>
              <p>JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. The claims in a JWT are encoded as a JSON object that is used as the payload of a JSON Web Signature (JWS) structure.</p>
            </div>
            <div>
              <h4 className="text-gray-300 font-medium mb-2">Security Note</h4>
              <p className="text-yellow-400">All decoding and verification happens locally in your browser. No tokens or secrets are sent to any server. However, never paste production secrets in any online tool.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};