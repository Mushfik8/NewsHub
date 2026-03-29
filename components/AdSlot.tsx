interface AdSlotProps {
  type?: 'banner' | 'rectangle' | 'sidebar';
  className?: string;
}

const sizes: Record<string, { label: string; height: string }> = {
  banner: { label: 'Advertisement (728×90)', height: 'h-20' },
  rectangle: { label: 'Advertisement (336×280)', height: 'h-36' },
  sidebar: { label: 'Advertisement (300×250)', height: 'h-64' },
};

export default function AdSlot({ type = 'rectangle', className = '' }: AdSlotProps) {
  const { label, height } = sizes[type];
  return (
    <div className={`ad-slot ${height} ${className}`} aria-label="Advertisement">
      <div className="text-center">
        <p className="text-slate-300 dark:text-slate-500 text-xs uppercase tracking-wider font-medium">বিজ্ঞাপন</p>
        <p className="text-slate-200 dark:text-slate-600 text-xs mt-1">{label}</p>
      </div>
    </div>
  );
}
