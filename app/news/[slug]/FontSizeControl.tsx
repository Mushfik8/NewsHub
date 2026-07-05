'use client';

import { useTheme } from '@/components/ThemeProvider';
import { Type } from 'lucide-react';

const sizes = [
  { key: 'normal' as const, label: 'ছোট', size: 'text-xs' },
  { key: 'large' as const, label: 'মাঝারি', size: 'text-sm' },
  { key: 'xlarge' as const, label: 'বড়', size: 'text-base' },
];

export default function FontSizeControl() {
  const { fontSize, setFontSize } = useTheme();

  return (
    <div className="flex items-center gap-2 mb-4 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
      <Type className="w-4 h-4 text-slate-400 flex-shrink-0" />
      <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">ফন্ট:</span>
      {sizes.map((s) => (
        <button
          key={s.key}
          onClick={() => setFontSize(s.key)}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-all min-h-[36px] ${
            fontSize === s.key
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
          aria-label={`Font size: ${s.label}`}
        >
          <span className={s.size}>{s.label}</span>
        </button>
      ))}
    </div>
  );
}
