import { Link } from 'react-router-dom';
import { useCandidates } from '../hooks/useCandidates.js';
import Spinner from '../components/Spinner.jsx';

export default function Dashboard() {
  const { items, total, loading } = useCandidates({ limit: 100 });

  const skillCounts = {};
  items.forEach((c) => (c.skills || []).forEach((s) => {
    const k = s.toLowerCase();
    skillCounts[k] = (skillCounts[k] || 0) + 1;
  }));
  const topSkills = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const avgExp = items.length ? (items.reduce((s, c) => s + (c.experience || 0), 0) / items.length).toFixed(1) : 0;

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of your candidate pool</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label="Total candidates" value={total} accent="from-indigo-500 to-blue-500" />
        <Stat label="Avg experience" value={`${avgExp} yrs`} accent="from-fuchsia-500 to-pink-500" />
        <Stat label="Unique skills" value={Object.keys(skillCounts).length} accent="from-emerald-500 to-teal-500" />
      </div>

      <div className="glass p-6">
        <h2 className="font-semibold mb-3">Top skills</h2>
        {topSkills.length === 0 ? (
          <p className="text-slate-400 text-sm">Add candidates to see top skills.</p>
        ) : (
          <div className="flex flex-wrap">
            {topSkills.map(([s, n]) => (
              <span key={s} className="chip">{s} · {n}</span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/candidates/new" className="btn-primary">+ Add candidate</Link>
        <Link to="/match" className="btn-ghost">Run match</Link>
        <Link to="/ai" className="btn-ghost">AI shortlist</Link>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="glass p-5">
      <div className="text-sm text-slate-400">{label}</div>
      <div className={`mt-2 text-3xl font-bold bg-gradient-to-r ${accent} bg-clip-text text-transparent`}>{value}</div>
    </div>
  );
}
