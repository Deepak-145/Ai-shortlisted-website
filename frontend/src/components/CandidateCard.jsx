import { Link } from 'react-router-dom';
import MatchBadge from './MatchBadge.jsx';

export default function CandidateCard({ c, result, onDelete, showRank }) {
  return (
    <div className="glass p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          {showRank && result && (
            <div className="text-xs text-slate-400 mb-1">Rank #{result.rank}</div>
          )}
          <h3 className="text-lg font-semibold">{c.name}</h3>
          <div className="text-sm text-slate-300">{c.email}</div>
          <div className="text-sm text-slate-400 mt-1">{c.experience} yrs experience</div>
        </div>
        {result && <MatchBadge percent={result.matchPercent} tier={result.tier} />}
      </div>

      <div className="mt-3 flex flex-wrap">
        {(c.skills || []).map((s) => (
          <span key={s} className="chip">{s}</span>
        ))}
      </div>

      {result?.matchedSkills?.length > 0 && (
        <div className="mt-3 text-sm">
          <span className="text-slate-400">Matched: </span>
          <span className="text-emerald-300">{result.matchedSkills.join(', ')}</span>
        </div>
      )}
      {result?.missingRequired?.length > 0 && (
        <div className="text-sm">
          <span className="text-slate-400">Missing: </span>
          <span className="text-rose-300">{result.missingRequired.join(', ')}</span>
        </div>
      )}

      {c.bio && <p className="mt-3 text-sm text-slate-300 line-clamp-3">{c.bio}</p>}

      {(onDelete) && (
        <div className="mt-4 flex gap-2">
          <Link to={`/candidates/${c._id}/edit`} className="btn-ghost text-sm">Edit</Link>
          <button onClick={() => onDelete(c)} className="btn-ghost text-sm text-rose-300">Delete</button>
        </div>
      )}
    </div>
  );
}
