import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const link = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-white/15 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-slate-900/40 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight text-white">
          ✦ AI Shortlist
        </Link>
        {user && (
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={link}>Dashboard</NavLink>
            <NavLink to="/candidates" className={link}>Candidates</NavLink>
            <NavLink to="/candidates/new" className={link}>Add</NavLink>
            <NavLink to="/match" className={link}>Match</NavLink>
            <NavLink to="/ai" className={link}>AI Shortlist</NavLink>
          </nav>
        )}
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="btn-ghost text-sm" title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {user ? (
            <button onClick={() => { logout(); nav('/login'); }} className="btn-ghost text-sm">Logout</button>
          ) : (
            <Link to="/login" className="btn-primary text-sm">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
