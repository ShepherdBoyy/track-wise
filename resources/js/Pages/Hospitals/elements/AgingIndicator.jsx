const agingBuckets = [
    { key: "current_count", label: "Current", color: "bg-emerald-300" },
    { key: "thirty_days_count", label: "1-30 days", color: "bg-sky-300" },
    { key: "sixty_days_count", label: "31-60 days", color: "bg-amber-300" },
    { key: "ninety_days_count", label: "61-90 days", color: "bg-orange-400/80" },
    { key: "over_ninety_count", label: "91+ days", color: "bg-rose-400" },
];

export default function AgingIndicator({ hospital }) {
    const active = agingBuckets.filter((b) => (hospital[b.key] || 0) > 0);
    const total = active.reduce((sum, b) => sum + hospital[b.key], 0);

    if (total === 0) {
      return <span className="text-xs text-gray-400">No invoices</span>;
    }

  return (
    <div className="flex h-2 w-40 rounded-full">
      {active.map((b, i) => {
        const pct = Math.max((hospital[b.key] / total) * 100, 10);
        const roundedClass = 
          i === 0 & active.length === 1
            ? "rounded-full"
            : i === 0
            ? "rounded-l-full"
            : i === active.length - 1
            ? "rounded-r-full"
            : "";
        return (
          <div
            key={b.key}
            className={`tooltip h-full ${b.color} ${roundedClass}`}
            style={{ width: `${pct}%` }}
            data-tip={`${b.label}: ${hospital[b.key]}`}
          />
        )
      })}
    </div>
  )
}
