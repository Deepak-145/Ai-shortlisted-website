export default function MatchBadge({ percent, tier }) {
  const t = tier || (percent >= 75 ? 'high' : percent >= 50 ? 'medium' : 'low');
  const styles = {
    high: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    low: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  }[t];
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${styles}`}>
      {percent}% · {t.toUpperCase()}
    </span>
  );
}
