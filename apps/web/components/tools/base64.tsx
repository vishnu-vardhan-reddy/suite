'use client';

import React, { useState } from 'react';
import { Copy, Check, Upload, Download, Type } from 'lucide-react';
import { AdUnit } from '@repo/ui';

export const Base64Converter: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [textInput, setTextInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');

  const encodeText = (text: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (e) {
      return 'Error encoding text';
    }
  };

  const decodeText = (text: string): string => {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch (e) {
      return 'Error: Invalid Base64 string';
    }
  };

  const handleTextConvert = (): void => {
    if (!textInput.trim()) {
      setOutput('');
      return;
    }

    if (mode === 'encode') {
      setOutput(encodeText(textInput));
    } else {
      setOutput(decodeText(textInput));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      
      if (file.type.startsWith('image/')) {
        setImagePreview(base64);
      }
      
      const base64Data = base64.split(',')[1] || '';
      setOutput(base64Data);
    };

    reader.readAsDataURL(file);
  };

  const handleBase64ToImage = (): void => {
    if (!textInput.trim()) return;
    
    try {
      let dataUrl = textInput;
      if (!dataUrl.startsWith('data:')) {
        dataUrl = 'data:image/png;base64,' + textInput;
      }
      setImagePreview(dataUrl);
      setOutput('Image preview loaded');
    } catch (e) {
      setOutput('Error: Invalid Base64 image data');
    }
  };

  const downloadImage = (): void => {
    if (!imagePreview) return;
    
    const link = document.createElement('a');
    link.href = imagePreview;
    link.download = fileName || 'decoded-image.png';
    link.click();
  };

  const copyToClipboard = async (): Promise<void> => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearAll = (): void => {
    setTextInput('');
    setOutput('');
    setImagePreview('');
    setFileName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-6">
          <AdUnit size="leaderboard" className="hidden md:flex" />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
            <Type className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Base64 Encoder/Decoder
          </h1>
          <p className="text-gray-400">Encode and decode text, images, and files to Base64</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 mb-6 border border-slate-700">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setMode('encode')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  mode === 'encode'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  mode === 'decode'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                Decode
              </button>
            </div>

            <div className="h-6 w-px bg-slate-600"></div>

            <div className="flex gap-2">
              <button
                onClick={() => setInputType('text')}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                  inputType === 'text'
                    ? 'bg-slate-600 text-white'
                    : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                }`}
              >
                <Type className="w-4 h-4 inline mr-1" />
                Text
              </button>
              {mode === 'encode' && (
                <button
                  onClick={() => setInputType('file')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    inputType === 'file'
                      ? 'bg-slate-600 text-white'
                      : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                  }`}
                >
                  <Upload className="w-4 h-4 inline mr-1" />
                  File/Image
                </button>
              )}
            </div>

            <div className="flex-1"></div>

            <button onClick={clearAll} className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 text-sm">
              Clear All
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-200">
              {mode === 'encode' ? 'Input' : 'Base64 Input'}
            </h2>

            {inputType === 'text' ? (
              <>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
                  className="w-full h-80 bg-slate-800/50 text-gray-100 px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-purple-500 font-mono text-sm resize-none"
                  spellCheck={false}
                />
                <button
                  onClick={mode === 'encode' ? handleTextConvert : (mode === 'decode' && textInput.length > 100 ? handleBase64ToImage : handleTextConvert)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium"
                >
                  {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept="image/*,*"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-300 mb-1">Click to upload file or image</p>
                    <p className="text-gray-500 text-sm">Any file type supported</p>
                  </label>
                </div>
                {fileName && (
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                    <p className="text-sm text-gray-400">Selected file:</p>
                    <p className="text-gray-200 font-medium truncate">{fileName}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-200">
                {mode === 'encode' ? 'Base64 Output' : 'Decoded Output'}
              </h2>
              {output && !imagePreview && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
                >
                  {copied ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
                </button>
              )}
            </div>

            {imagePreview ? (
              <div className="space-y-3">
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                  <img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded-lg mx-auto" style={{ maxHeight: '400px' }} />
                </div>
                <button
                  onClick={downloadImage}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download Image
                </button>
              </div>
            ) : output ? (
              <textarea
                value={output}
                readOnly
                className="w-full h-80 bg-slate-800/50 text-gray-100 px-4 py-3 rounded-xl border border-slate-700 font-mono text-sm resize-none"
                spellCheck={false}
              />
            ) : (
              <div className="w-full h-80 bg-slate-800/30 rounded-xl border border-slate-700 border-dashed flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  {mode === 'encode' ? 'Encoded output will appear here' : 'Decoded output will appear here'}
                </p>
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