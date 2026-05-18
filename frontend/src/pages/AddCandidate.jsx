import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import Spinner from '../components/Spinner.jsx';

export default function AddCandidate() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', skills: '', experience: 0, bio: '' });
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/candidates', { ...form, skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean) });
      toast.success('Candidate added');
      nav('/candidates');
    } catch (e) { toast.error(e?.response?.data?.error || 'Failed'); }
    finally { setBusy(false); }
  }

  return (
    <div className="max-w-2xl mx-auto glass p-8">
      <h1 className="text-2xl font-bold mb-1">Add candidate</h1>
      <p className="text-slate-400 mb-6 text-sm">Skills are comma-separated.</p>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input" placeholder="Skills (e.g. React, Node.js, MongoDB)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        <input className="input" type="number" min="0" step="0.5" placeholder="Experience (years)" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
        <textarea className="input min-h-[120px]" placeholder="Bio / Projects" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <button className="btn-primary w-full" disabled={busy}>{busy ? <Spinner /> : 'Save candidate'}</button>
      </form>
    </div>
  );
}
