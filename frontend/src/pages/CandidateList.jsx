import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import CandidateCard from '../components/CandidateCard.jsx';
import Spinner from '../components/Spinner.jsx';
import { useCandidates } from '../hooks/useCandidates.js';

const PAGE = 9;

export default function CandidateList() {
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [page, setPage] = useState(1);
  const params = useMemo(() => ({ search, skill, page, limit: PAGE }), [search, skill, page]);
  const { items, total, loading, refresh } = useCandidates(params);

  async function onDelete(c) {
    if (!confirm(`Delete ${c.name}?`)) return;
    try { await api.delete(`/candidates/${c._id}`); toast.success('Deleted'); refresh(); }
    catch (e) { toast.error(e?.response?.data?.error || 'Failed'); }
  }

  const pages = Math.max(1, Math.ceil(total / PAGE));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Candidates <span className="text-slate-400 text-base">({total})</span></h1>
        <Link to="/candidates/new" className="btn-primary">+ Add</Link>
      </div>

      <div className="glass p-4 flex flex-wrap gap-3">
        <input className="input flex-1 min-w-[200px]" placeholder="Search name, email, bio" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
        <input className="input w-48" placeholder="Filter by skill" value={skill} onChange={(e) => { setPage(1); setSkill(e.target.value); }} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : items.length === 0 ? (
        <div className="glass p-10 text-center text-slate-400">No candidates yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((c) => <CandidateCard key={c._id} c={c} onDelete={onDelete} />)}
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`btn-ghost text-sm ${page === i + 1 ? 'ring-2 ring-indigo-400' : ''}`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
