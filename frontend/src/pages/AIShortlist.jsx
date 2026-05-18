import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import Spinner from '../components/Spinner.jsx';
import MatchBadge from '../components/MatchBadge.jsx';

export default function AIShortlist() {
  const [form, setForm] = useState({ requiredSkills: '', preferredSkills: '', minExperience: 0 });
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setData(null);
    try {
      const { data } = await api.post('/ai/shortlist', {
        requiredSkills: form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        preferredSkills: form.preferredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        minExperience: Number(form.minExperience) || 0,
      });
      setData(data);
    } catch (e) { toast.error(e?.response?.data?.error || 'AI request failed'); }
    finally { setBusy(false); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI shortlist</h1>
        <p className="text-slate-400 mt-1">Powered by OpenRouter</p>
      </div>

      <form onSubmit={submit} className="glass p-6 space-y-3 max-w-3xl">
        <input className="input" placeholder="Required skills (comma-separated)" value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} />
        <input className="input" placeholder="Preferred skills" value={form.preferredSkills} onChange={(e) => setForm({ ...form, preferredSkills: e.target.value })} />
        <input className="input" type="number" min="0" step="0.5" placeholder="Minimum experience" value={form.minExperience} onChange={(e) => setForm({ ...form, minExperience: e.target.value })} />
        <button className="btn-primary" disabled={busy}>{busy ? <Spinner /> : 'Ask the AI'}</button>
      </form>

      {data && (
        <div className="space-y-4">
          {data.explanation && (
            <div className="glass p-6">
              <h2 className="font-semibold mb-2">Overall recommendation</h2>
              <p className="text-slate-200 whitespace-pre-wrap">{data.explanation}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.topCandidates || []).map((t, i) => (
              <div key={t.id || i} className="glass p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Rank #{i + 1}{data.bestFitId === t.id && ' · ⭐ Best fit'}</div>
                    <h3 className="text-lg font-semibold">{t.name}</h3>
                  </div>
                  <MatchBadge percent={Math.round(t.score || 0)} />
                </div>
                <p className="mt-2 text-sm text-slate-300">{t.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
