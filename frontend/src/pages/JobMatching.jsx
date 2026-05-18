import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import CandidateCard from '../components/CandidateCard.jsx';
import Spinner from '../components/Spinner.jsx';

function toCsv(rows) {
  const head = ['rank', 'name', 'email', 'experience', 'matchPercent', 'tier', 'matchedSkills'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const body = rows.map((r) =>
    [r.rank, r.candidate.name, r.candidate.email, r.candidate.experience, r.matchPercent, r.tier, (r.matchedSkills || []).join('; ')]
      .map(esc).join(',')
  );
  return [head.join(','), ...body].join('\n');
}

export default function JobMatching() {
  const [form, setForm] = useState({ requiredSkills: '', preferredSkills: '', minExperience: 0 });
  const [results, setResults] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post('/match', {
        requiredSkills: form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        preferredSkills: form.preferredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        minExperience: Number(form.minExperience) || 0,
      });
      setResults(data.results);
    } catch (e) { toast.error(e?.response?.data?.error || 'Failed'); }
    finally { setBusy(false); }
  }

  function exportCsv() {
    if (!results?.length) return;
    const blob = new Blob([toCsv(results)], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'shortlist.csv';
    a.click();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Job matching</h1>

      <form onSubmit={submit} className="glass p-6 space-y-3 max-w-3xl">
        <label className="block">
          <span className="text-sm text-slate-300">Required skills (comma-separated)</span>
          <input className="input mt-1" value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} placeholder="React, Node.js, MongoDB" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Preferred skills</span>
          <input className="input mt-1" value={form.preferredSkills} onChange={(e) => setForm({ ...form, preferredSkills: e.target.value })} placeholder="TypeScript, AWS" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Minimum experience (years)</span>
          <input className="input mt-1" type="number" min="0" step="0.5" value={form.minExperience} onChange={(e) => setForm({ ...form, minExperience: e.target.value })} />
        </label>
        <div className="flex gap-2">
          <button className="btn-primary" disabled={busy}>{busy ? <Spinner /> : 'Run match'}</button>
          {results?.length > 0 && <button type="button" onClick={exportCsv} className="btn-ghost">Export CSV</button>}
        </div>
      </form>

      {results && (
        results.length === 0
          ? <div className="glass p-10 text-center text-slate-400">No candidates.</div>
          : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((r) => (
                <CandidateCard key={r.candidate._id} c={r.candidate} result={r} showRank />
              ))}
            </div>
          )
      )}
    </div>
  );
}
