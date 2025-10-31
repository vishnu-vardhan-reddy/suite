'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, Clock, Calendar, Globe } from 'lucide-react';
import { AdUnit } from '@repo/ui';
import { format, parse, isValid, differenceInDays, differenceInHours, differenceInMinutes, addDays } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

interface TimeZone {
  name: string;
  value: string;
  offset: string;
}

export const DateTimeConverter: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [inputDate, setInputDate] = useState<string>('');
  const [inputTime, setInputTime] = useState<string>('');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('UTC');
  const [targetTimezone, setTargetTimezone] = useState<string>('America/New_York');
  const [unixTimestamp, setUnixTimestamp] = useState<string>('');
  const [copied, setCopied] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'convert' | 'format' | 'calculate'>('convert');

  const timezones: TimeZone[] = [
    { name: 'UTC', value: 'UTC', offset: '+00:00' },
    { name: 'EST (New York)', value: 'America/New_York', offset: '-05:00' },
    { name: 'PST (Los Angeles)', value: 'America/Los_Angeles', offset: '-08:00' },
    { name: 'CST (Chicago)', value: 'America/Chicago', offset: '-06:00' },
    { name: 'MST (Denver)', value: 'America/Denver', offset: '-07:00' },
    { name: 'GMT (London)', value: 'Europe/London', offset: '+00:00' },
    { name: 'CET (Paris)', value: 'Europe/Paris', offset: '+01:00' },
    { name: 'IST (India)', value: 'Asia/Kolkata', offset: '+05:30' },
    { name: 'JST (Tokyo)', value: 'Asia/Tokyo', offset: '+09:00' },
    { name: 'AEST (Sydney)', value: 'Australia/Sydney', offset: '+10:00' },
    { name: 'CST (Shanghai)', value: 'Asia/Shanghai', offset: '+08:00' },
    { name: 'GST (Dubai)', value: 'Asia/Dubai', offset: '+04:00' },
    { name: 'BRT (São Paulo)', value: 'America/Sao_Paulo', offset: '-03:00' },
    { name: 'MSK (Moscow)', value: 'Europe/Moscow', offset: '+03:00' },
    { name: 'HKT (Hong Kong)', value: 'Asia/Hong_Kong', offset: '+08:00' },
  ];

  const dateFormats = [
    { name: 'ISO 8601', format: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx" },
    { name: 'RFC 2822', format: 'EEE, dd MMM yyyy HH:mm:ss xx' },
    { name: 'Full Date', format: 'EEEE, MMMM do, yyyy' },
    { name: 'Short Date', format: 'MM/dd/yyyy' },
    { name: 'Long Date', format: 'MMMM dd, yyyy' },
    { name: 'Time 24h', format: 'HH:mm:ss' },
    { name: 'Time 12h', format: 'hh:mm:ss a' },
    { name: 'Date Time', format: 'yyyy-MM-dd HH:mm:ss' },
    { name: 'US Format', format: 'MM/dd/yyyy hh:mm a' },
    { name: 'EU Format', format: 'dd/MM/yyyy HH:mm' },
    { name: 'Timestamp', format: 'T' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const now = new Date();
    setInputDate(format(now, 'yyyy-MM-dd'));
    setInputTime(format(now, 'HH:mm:ss'));
    setUnixTimestamp(Math.floor(now.getTime() / 1000).toString());
  }, []);

  const getDateFromInputs = (): Date | null => {
    try {
      const dateTimeString = `${inputDate}T${inputTime}`;
      const date = new Date(dateTimeString);
      return isValid(date) ? date : null;
    } catch {
      return null;
    }
  };

  const convertTimezone = (date: Date, fromTz: string, toTz: string): Date => {
    try {
      return toZonedTime(date, toTz);
    } catch {
      return date;
    }
  };

  const formatDate = (date: Date, formatString: string, timezone: string): string => {
    try {
      if (formatString === 'T') {
        return Math.floor(date.getTime() / 1000).toString();
      }
      return formatInTimeZone(date, timezone, formatString);
    } catch {
      return 'Invalid format';
    }
  };

  const copyToClipboard = async (text: string, key: string): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const loadNow = (): void => {
    const now = new Date();
    setInputDate(format(now, 'yyyy-MM-dd'));
    setInputTime(format(now, 'HH:mm:ss'));
    setUnixTimestamp(Math.floor(now.getTime() / 1000).toString());
  };

  const fromUnixTimestamp = (timestamp: string): void => {
    try {
      const ts = parseInt(timestamp);
      if (isNaN(ts)) return;
      
      const date = new Date(ts * 1000);
      setInputDate(format(date, 'yyyy-MM-dd'));
      setInputTime(format(date, 'HH:mm:ss'));
    } catch (e) {
      console.error('Invalid timestamp');
    }
  };

  const inputDateObj = getDateFromInputs();
  const convertedDate = inputDateObj ? convertTimezone(inputDateObj, selectedTimezone, targetTimezone) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-6">
          <AdUnit size="leaderboard" className="hidden md:flex" />
          <AdUnit size="mobile-banner" className="md:hidden" />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Date & Timezone Converter
          </h1>
          <p className="text-gray-400">Convert dates, times, and timezones with ease</p>
        </div>

        {/* Current Time Display */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 mb-6 border border-slate-700">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Current Time</p>
            <p className="text-3xl font-mono font-bold text-violet-400 mb-2">
              {format(currentTime, 'HH:mm:ss')}
            </p>
            <p className="text-gray-300 text-lg">
              {format(currentTime, 'EEEE, MMMM do, yyyy')}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('convert')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'convert'
                ? 'text-violet-400 border-b-2 border-violet-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Globe className="w-4 h-4" />
            Timezone Converter
          </button>
          <button
            onClick={() => setActiveTab('format')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'format'
                ? 'text-violet-400 border-b-2 border-violet-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Date Formatter
          </button>
          <button
            onClick={() => setActiveTab('calculate')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'calculate'
                ? 'text-violet-400 border-b-2 border-violet-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Clock className="w-4 h-4" />
            Date Calculator
          </button>
        </div>

        {/* Timezone Converter Tab */}
        {activeTab === 'convert' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
                <h2 className="text-lg font-semibold text-gray-200 mb-4">Source Date & Time</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Date</label>
                    <input
                      type="date"
                      value={inputDate}
                      onChange={(e) => setInputDate(e.target.value)}
                      className="w-full bg-slate-700 text-gray-100 px-4 py-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Time</label>
                    <input
                      type="time"
                      step="1"
                      value={inputTime}
                      onChange={(e) => setInputTime(e.target.value)}
                      className="w-full bg-slate-700 text-gray-100 px-4 py-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Source Timezone</label>
                    <select
                      value={selectedTimezone}
                      onChange={(e) => setSelectedTimezone(e.target.value)}
                      className="w-full bg-slate-700 text-gray-100 px-4 py-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-violet-500"
                    >
                      {timezones.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.name} ({tz.offset})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={loadNow}
                    className="w-full px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Use Current Time
                  </button>
                </div>
              </div>

              {/* Unix Timestamp */}
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Unix Timestamp</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={unixTimestamp}
                    onChange={(e) => {
                      setUnixTimestamp(e.target.value);
                      fromUnixTimestamp(e.target.value);
                    }}
                    placeholder="1234567890"
                    className="flex-1 bg-slate-700 text-gray-100 px-4 py-2 rounded-lg border border-slate-600 focus:ring-2 focus:ring-violet-500 font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(unixTimestamp, 'timestamp')}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg transition-colors"
                  >
                    {copied === 'timestamp' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
                <h2 className="text-lg font-semibold text-gray-200 mb-4">Target Timezone</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Target Timezone</label>
                    <select
                      value={targetTimezone}
                      onChange={(e) => setTargetTimezone(e.target.value)}
                      className="w-full bg-slate-700 text-gray-100 px-4 py-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-violet-500"
                    >
                      {timezones.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.name} ({tz.offset})
                        </option>
                      ))}
                    </select>
                  </div>

                  {convertedDate && (
                    <div className="bg-violet-900/20 border border-violet-800 rounded-lg p-4">
                      <p className="text-sm text-gray-400 mb-2">Converted Time</p>
                      <p className="text-2xl font-mono font-bold text-violet-400 mb-2">
                        {formatInTimeZone(convertedDate, targetTimezone, 'HH:mm:ss')}
                      </p>
                      <p className="text-gray-300">
                        {formatInTimeZone(convertedDate, targetTimezone, 'EEEE, MMMM do, yyyy')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* World Clock */}
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
                <h3 className="text-sm font-semibold text-gray-300 mb-4">World Clock</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {timezones.slice(0, 8).map((tz) => (
                    <div key={tz.value} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-0">
                      <span className="text-sm text-gray-400">{tz.name}</span>
                      <span className="text-sm font-mono text-gray-300">
                        {formatInTimeZone(currentTime, tz.value, 'HH:mm:ss')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Date Formatter Tab */}
        {activeTab === 'format' && inputDateObj && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dateFormats.map((fmt) => (
              <div key={fmt.name} className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-300">{fmt.name}</h3>
                  <button
                    onClick={() => copyToClipboard(formatDate(inputDateObj, fmt.format, selectedTimezone), fmt.name)}
                    className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                  >
                    {copied === fmt.name ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-sm font-mono text-violet-300 break-all">
                  {formatDate(inputDateObj, fmt.format, selectedTimezone)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Date Calculator Tab */}
        {activeTab === 'calculate' && inputDateObj && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-gray-200 mb-4">Add/Subtract Days</h2>
              <div className="space-y-4">
                {[-365, -30, -7, -1, 1, 7, 30, 365].map((days) => {
                  const newDate = addDays(inputDateObj, days);
                  return (
                    <div key={days} className="flex justify-between items-center py-2 border-b border-slate-700">
                      <span className="text-sm text-gray-400">
                        {days > 0 ? '+' : ''}{days} days
                      </span>
                      <span className="text-sm font-mono text-gray-300">
                        {format(newDate, 'yyyy-MM-dd')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-gray-200 mb-4">Time Until/Since</h2>
              <div className="space-y-4">
                <div className="bg-violet-900/20 border border-violet-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Days from now</p>
                  <p className="text-2xl font-bold text-violet-400">
                    {differenceInDays(inputDateObj, currentTime)} days
                  </p>
                </div>
                <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Hours from now</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {differenceInHours(inputDateObj, currentTime)} hours
                  </p>
                </div>
                <div className="bg-pink-900/20 border border-pink-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Minutes from now</p>
                  <p className="text-2xl font-bold text-pink-400">
                    {differenceInMinutes(inputDateObj, currentTime)} minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <AdUnit size="rectangle" />
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>All conversions done locally • No data sent to servers</p>
        </div>
      </div>
    </div>
  );
};