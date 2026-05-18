import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created');
      nav('/', { replace: true });
    } catch (e) { toast.error(e?.response?.data?.error || 'Failed'); }
    finally { setBusy(false); }
  }

  return (
    <div className="max-w-md mx-auto mt-12 glass p-8">
      <h1 className="text-2xl font-bold mb-1">Create account</h1>
      <p className="text-sm text-slate-400 mb-6">Start shortlisting candidates</p>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input" type="password" placeholder="Password (min 6)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={6} required />
        <button className="btn-primary w-full" disabled={busy}>{busy ? <Spinner /> : 'Register'}</button>
      </form>
      <p className="text-sm text-slate-400 mt-4">Have one? <Link className="text-indigo-300" to="/login">Sign in</Link></p>
    </div>
  );
}
