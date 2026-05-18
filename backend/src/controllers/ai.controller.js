import Candidate from '../models/Candidate.js';
import { scoreCandidates } from '../services/match.service.js';
import { aiShortlist } from '../services/openrouter.service.js';
import { normalizeSkills } from '../utils/skills.js';

export async function shortlist(req, res, next) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return next({ status: 500, message: 'OPENROUTER_API_KEY not set' });
    }
    const required = normalizeSkills(req.body?.requiredSkills);
    const preferred = normalizeSkills(req.body?.preferredSkills);
    const minExperience = Number(req.body?.minExperience) || 0;

    const candidates = await Candidate.find({ owner: req.userId }).lean();
    if (!candidates.length) return res.json({ topCandidates: [], explanation: 'No candidates yet.' });

    // Pre-rank to give the model better context and to cap payload.
    const ranked = scoreCandidates(candidates, { required, preferred, minExperience }).slice(0, 25);

    const result = await aiShortlist({
      job: { requiredSkills: required, preferredSkills: preferred, minExperience },
      candidates: ranked.map((r) => ({
        id: String(r.candidate._id),
        name: r.candidate.name,
        email: r.candidate.email,
        skills: r.candidate.skills,
        experience: r.candidate.experience,
        bio: r.candidate.bio,
        preMatchPercent: r.matchPercent,
      })),
    });

    res.json(result);
  } catch (e) { next(e); }
}
