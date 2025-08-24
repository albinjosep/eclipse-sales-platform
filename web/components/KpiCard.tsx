export function KpiCard({ label, value, subtitle, trend }: { label: string, value: string, subtitle?: string, trend?: 'up'|'down' }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm text-white/60">{label}</div>
      <div className="text-3xl font-semibold mt-1">{value}</div>
      <div className="text-xs text-white/50 mt-1 flex items-center gap-2">
        {trend === 'up' && <span className="text-emerald-400">▲</span>}
        {trend === 'down' && <span className="text-rose-400">▼</span>}
        {subtitle}
      </div>
    </div>
  )
}


