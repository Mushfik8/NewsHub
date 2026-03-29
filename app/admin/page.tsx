'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, BarChart3, Newspaper, Clock, AlertCircle, CheckCircle, Lock } from 'lucide-react';

interface Stats {
  totalArticles: number;
  lastFetch: string | null;
  totalSources: number;
  categoryBreakdown: Array<{ _id: string; count: number }>;
  sourceBreakdown: Array<{ _id: string; count: number }>;
  recentLogs: Array<{ timestamp: string; totalNew: number; results: any[] }>;
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
      const res = await fetch('/api/cron/fetch', {
        method: 'POST',
        // The API cron route will need to be refactored to allow UI triggers if env secret isn't available.
        // For now, let's keep it as is, or we can just send an empty body since it's locally driven
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setFetchResult(`✅ ${data.message || 'সফল'}`);
      fetchStats();
    } catch (err: any) { setFetchResult(`❌ ফেচ করতে ব্যর্থ হয়েছে: ${err.message}`); }
    finally { setFetching(false); }
  };

  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">অ্যাডমিন প্যানেল</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">NewsHub BD অ্যাডমিন</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="অ্যাডমিন ইমেইল"
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 ring-blue-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="পাসওয়ার্ড দিন"
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 ring-blue-500"
            />
            {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
            <button type="submit" className="btn-primary w-full justify-center py-3">প্রবেশ করুন</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            অ্যাডমিন ড্যাশবোর্ড
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">NewsHub BD পরিচালনা কেন্দ্র</p>
        </div>
        <div className="flex gap-3">
          <button onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' });
            setAuthed(false);
          }} className="btn-secondary text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20">
            লগআউট
          </button>
          <button onClick={fetchStats} disabled={loading} className="btn-secondary">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            রিফ্রেশ
          </button>
          <button onClick={triggerFetch} disabled={fetching} className="btn-primary">
            <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
            {fetching ? 'ফেচ হচ্ছে...' : 'এখনই ফেচ করুন'}
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
                  <p className="text-slate-500 dark:text-slate-400 text-sm">মোট সংবাদ</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats.totalSources}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">সক্রিয় সূত্র</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {stats.lastFetch ? new Date(stats.lastFetch).toLocaleString('bn-BD') : 'কখনো নয়'}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">শেষ আপডেট</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Category Breakdown */}
            <div className="card p-6">
              <h2 className="section-title mb-4">বিভাগ অনুযায়ী সংবাদ</h2>
              <div className="space-y-3">
                {stats.categoryBreakdown.map(c => (
                  <div key={c._id} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 dark:text-slate-300 w-28 flex-shrink-0">{c._id}</span>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
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
              <h2 className="section-title mb-4">সূত্র অনুযায়ী সংবাদ</h2>
              <div className="space-y-3">
                {stats.sourceBreakdown.map(s => (
                  <div key={s._id} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 dark:text-slate-300 w-32 flex-shrink-0 truncate">{s._id}</span>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
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
              সাম্প্রতিক ফেচ লগ
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-3 font-semibold">সময়</th>
                    <th className="pb-3 font-semibold">নতুন সংবাদ</th>
                    <th className="pb-3 font-semibold">ত্রুটি</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {stats.recentLogs.map((log, i) => {
                    const errors = log.results.filter((r: any) => r.error).length;
                    return (
                      <tr key={i} className="text-slate-700 dark:text-slate-300">
                        <td className="py-3">{new Date(log.timestamp).toLocaleString('bn-BD')}</td>
                        <td className="py-3">
                          <span className="badge-green">+{log.totalNew}</span>
                        </td>
                        <td className="py-3">
                          {errors > 0
                            ? <span className="badge-red">{errors}টি ত্রুটি</span>
                            : <span className="text-green-600 dark:text-green-400 text-xs">✓ সফল</span>
                          }
                        </td>
                      </tr>
                    );
                  })}
                  {stats.recentLogs.length === 0 && (
                    <tr><td colSpan={3} className="py-6 text-center text-slate-400">কোনো লগ নেই</td></tr>
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
