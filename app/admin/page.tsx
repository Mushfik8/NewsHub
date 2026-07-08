'use client';

import { useEffect, useState } from 'react';
import {
  RefreshCw, BarChart3, Newspaper, Clock, AlertCircle,
  CheckCircle, Lock, Activity, Shield, ShieldAlert,
  ShieldCheck, TrendingUp, XCircle,
} from 'lucide-react';

interface SourceHealthItem {
  sourceSlug: string;
  lastSuccessAt: string | null;
  lastErrorAt: string | null;
  lastError: string | null;
  articleCount: number;
  consecutiveFailures: number;
  updatedAt: string;
}

interface PerSourceCount {
  sourceSlug: string;
  source: string;
  count: number;
  latestAt: string | null;
}

interface Stats {
  totalArticles: number;
  lastFetch: string | null;
  totalSources: number;
  categoryBreakdown: Array<{ _id: string; count: number }>;
  sourceBreakdown: Array<{ _id: string; count: number }>;
  recentLogs: Array<{ timestamp: string; totalNew: number; errors: number; results: any[] }>;
  sourceHealth: SourceHealthItem[];
  perSourceCounts: PerSourceCount[];
}

function getHealthStatus(health: SourceHealthItem): { label: string; color: string; icon: typeof ShieldCheck } {
  if (health.consecutiveFailures >= 5) {
    return { label: 'অকার্যকর', color: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30', icon: XCircle };
  }
  if (health.consecutiveFailures >= 2) {
    return { label: 'সতর্কতা', color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30', icon: ShieldAlert };
  }
  if (health.lastSuccessAt) {
    return { label: 'সক্রিয়', color: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30', icon: ShieldCheck };
  }
  return { label: 'অজানা', color: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700', icon: Shield };
}

function formatBnDate(dateStr: string | null): string {
  if (!dateStr) return 'কখনো নয়';
  try {
    return new Date(dateStr).toLocaleString('bn-BD', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return dateStr;
  }
}

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchResult, setFetchResult] = useState<string>('');
  const [verifyUrl, setVerifyUrl] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      setAuthed(true);
      fetchStats();
    } else {
      const data = await res.json();
      setAuthError(data.error || 'ভুল তথ্য দেওয়া হয়েছে');
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch {/**/} finally { setLoading(false); }
  };

  const triggerFetch = async () => {
    setFetching(true);
    setFetchResult('');
    try {
      const res = await fetch('/api/cron/fetch', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setFetchResult(`✅ ${data.message || 'সফল'}`);
      fetchStats();
    } catch (err: any) { setFetchResult(`❌ ফেচ করতে ব্যর্থ হয়েছে: ${err.message}`); }
    finally { setFetching(false); }
  };

  const handleVerifyFeed = async () => {
    if (!verifyUrl.trim()) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await fetch('/api/admin/verify-feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: verifyUrl }),
      });
      const data = await res.json();
      setVerifyResult(data);
    } catch (err: any) {
      setVerifyResult({ ok: false, error: err.message });
    } finally {
      setVerifying(false);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Panel</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">NewsHub BD Admin</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 ring-blue-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 ring-blue-500"
            />
            {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
            <button type="submit" className="btn-primary w-full justify-center py-3">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">NewsHub BD Control Center</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' });
            setAuthed(false);
          }} className="btn-secondary text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20">
            Logout
          </button>
          <button onClick={fetchStats} disabled={loading} className="btn-secondary">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button onClick={triggerFetch} disabled={fetching} className="btn-primary">
            <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
            {fetching ? 'Fetching...' : 'Fetch Now'}
          </button>
        </div>
      </div>

      {fetchResult && (
        <div className={`mb-6 p-4 rounded-xl border ${fetchResult.startsWith('✅') ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'}`}>
          {fetchResult}
        </div>
      )}

      {stats && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="card p-6">
              <div className="flex items-center gap-3">
                <Newspaper className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats.totalArticles.toLocaleString()}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Total Articles</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats.totalSources}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Active Sources</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {stats.lastFetch ? formatBnDate(stats.lastFetch) : 'Never'}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Last Update</p>
                </div>
              </div>
            </div>
          </div>

          {/* Source Health Panel */}
          {stats.sourceHealth && stats.sourceHealth.length > 0 && (
            <div className="card p-6 mb-8">
              <h2 className="section-title mb-4">
                <Activity className="w-5 h-5 text-blue-500" />
                Source Health Inspection
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                      <th className="pb-3 font-semibold">Source</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Last Success</th>
                      <th className="pb-3 font-semibold">Articles</th>
                      <th className="pb-3 font-semibold">Last Error</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {stats.sourceHealth.map((sh) => {
                      const status = getHealthStatus(sh);
                      const StatusIcon = status.icon;
                      // Try to find the display name from perSourceCounts
                      const psc = stats.perSourceCounts?.find((p) => p.sourceSlug === sh.sourceSlug);
                      const displayName = psc?.source || sh.sourceSlug;

                      return (
                        <tr key={sh.sourceSlug} className="text-slate-700 dark:text-slate-300">
                          <td className="py-3 font-medium">{displayName}</td>
                          <td className="py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {status.label}
                            </span>
                          </td>
                          <td className="py-3 text-xs">{formatBnDate(sh.lastSuccessAt)}</td>
                          <td className="py-3">
                            <span className="badge-green">{sh.articleCount}</span>
                          </td>
                          <td className="py-3 text-xs max-w-[200px] truncate text-slate-400" title={sh.lastError || ''}>
                            {sh.lastError ? (
                              <span className="text-red-500 dark:text-red-400">{sh.lastError}</span>
                            ) : (
                              <span className="text-green-500">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Feed Verifier */}
          <div className="card p-6 mb-8">
            <h2 className="section-title mb-4">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Feed Verification
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Verify RSS Feed URL before adding new sources.
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={verifyUrl}
                onChange={(e) => setVerifyUrl(e.target.value)}
                placeholder="https://example.com/rss.xml"
                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 ring-blue-500"
              />
              <button onClick={handleVerifyFeed} disabled={verifying} className="btn-primary whitespace-nowrap">
                {verifying ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            {verifyResult && (
              <div className={`mt-4 p-4 rounded-lg border text-sm ${verifyResult.ok ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                <p className="font-semibold mb-2">
                  {verifyResult.ok ? '✅ ফিড সক্রিয়' : '❌ ফিড সমস্যাযুক্ত'}
                  {verifyResult.feedTitle && ` — ${verifyResult.feedTitle}`}
                </p>
                {verifyResult.ok && (
                  <div className="space-y-1 text-slate-600 dark:text-slate-300">
                    <p>আইটেম সংখ্যা: <strong>{verifyResult.itemCount}</strong></p>
                    {verifyResult.latestDate && (
                      <p>সর্বশেষ প্রকাশ: <strong>{formatBnDate(verifyResult.latestDate)}</strong></p>
                    )}
                    <p>ছবি আছে: <strong>{verifyResult.hasImages ? 'হ্যাঁ' : 'না'}</strong></p>
                    {verifyResult.sampleCategories?.length > 0 && (
                      <p>বিভাগ: <span className="text-xs">{verifyResult.sampleCategories.join(', ')}</span></p>
                    )}
                  </div>
                )}
                {verifyResult.error && (
                  <p className="text-red-600 dark:text-red-400 mt-1">{verifyResult.error}</p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Category Breakdown */}
            <div className="card p-6">
              <h2 className="section-title mb-4">News by Category</h2>
              <div className="space-y-3">
                {stats.categoryBreakdown.map(c => (
                  <div key={c._id} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 dark:text-slate-300 w-28 flex-shrink-0">{c._id}</span>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (c.count / stats.totalArticles) * 100 * 5)}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-10 text-right">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Source Breakdown */}
            <div className="card p-6">
              <h2 className="section-title mb-4">News by Source</h2>
              <div className="space-y-3">
                {stats.sourceBreakdown.map(s => (
                  <div key={s._id} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 dark:text-slate-300 w-32 flex-shrink-0 truncate">{s._id}</span>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (s.count / stats.totalArticles) * 100 * 5)}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-10 text-right">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Fetch Logs */}
          <div className="card p-6">
            <h2 className="section-title mb-4">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Recent Fetch Logs
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-3 font-semibold">Time</th>
                    <th className="pb-3 font-semibold">New News</th>
                    <th className="pb-3 font-semibold">Errors</th>
                    <th className="pb-3 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {stats.recentLogs.map((log, i) => {
                    const errors = log.results.filter((r: any) => r.error).length;
                    return (
                      <tr key={i} className="text-slate-700 dark:text-slate-300">
                        <td className="py-3">{formatBnDate(log.timestamp)}</td>
                        <td className="py-3">
                          <span className="badge-green">+{log.totalNew}</span>
                        </td>
                        <td className="py-3">
                          {errors > 0
                            ? <span className="badge-red">{errors}টি ত্রুটি</span>
                            : <span className="text-green-600 dark:text-green-400 text-xs">✓ সফল</span>
                          }
                        </td>
                        <td className="py-3 text-xs text-slate-400 max-w-[300px]">
                          {log.results.map((r: any, j: number) => (
                            <span key={j} className={`inline-block mr-2 ${r.error ? 'text-red-400' : 'text-green-500'}`}>
                              {r.source}: {r.error ? '✗' : `+${r.new}`}
                            </span>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                  {stats.recentLogs.length === 0 && (
                    <tr><td colSpan={4} className="py-6 text-center text-slate-400">কোনো লগ নেই</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
