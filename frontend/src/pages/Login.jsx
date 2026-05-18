import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      toast.success('Welcome back');
      nav('/dashboard', { replace: true });
    } catch (e) { toast.error(e?.response?.data?.error || 'Login failed'); }
    finally { setBusy(false); }
  }

  return (
    <div className="max-w-md mx-auto mt-12 glass p-8">
      <h1 className="text-2xl font-bold mb-1">Sign in</h1>
      <p className="text-sm text-slate-400 mb-6">Recruiter access</p>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn-primary w-full" disabled={busy}>{busy ? <Spinner /> : 'Sign in'}</button>
      </form>
      <p className="text-sm text-slate-400 mt-4">No account? <Link className="text-indigo-300" to="/register">Register</Link></p>
    </div>
  );
}
