import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import Spinner from '../components/Spinner.jsx';

export default function EditCandidate() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get(`/candidates/${id}`).then(({ data }) =>
      setForm({ ...data, skills: (data.skills || []).join(', ') })
    ).catch(() => toast.error('Not found'));
  }, [id]);

  if (!form) return <div className="flex justify-center py-20"><Spinner /></div>;

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.put(`/candidates/${id}`, {
        ...form,
        skills: String(form.skills).split(',').map((s) => s.trim()).filter(Boolean),
      });
      toast.success('Updated');
      nav('/candidates');
    } catch (e) { toast.error(e?.response?.data?.error || 'Failed'); }
    finally { setBusy(false); }
  }

  return (
    <div className="max-w-2xl mx-auto glass p-8">
      <h1 className="text-2xl font-bold mb-6">Edit candidate</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        <input className="input" type="number" min="0" step="0.5" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
        <textarea className="input min-h-[120px]" value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <button className="btn-primary w-full" disabled={busy}>{busy ? <Spinner /> : 'Save changes'}</button>
      </form>
    </div>
  );
}
