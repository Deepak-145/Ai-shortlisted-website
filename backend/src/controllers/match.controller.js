import Candidate from '../models/Candidate.js';
import { scoreCandidates } from '../services/match.service.js';
import { normalizeSkills } from '../utils/skills.js';

export async function match(req, res, next) {
  try {
    const required = normalizeSkills(req.body?.requiredSkills);
    const preferred = normalizeSkills(req.body?.preferredSkills);
    const minExperience = Number(req.body?.minExperience) || 0;
    const candidates = await Candidate.find({ owner: req.userId }).lean();
    const ranked = scoreCandidates(candidates, { required, preferred, minExperience });
    res.json({ count: ranked.length, results: ranked });
  } catch (e) { next(e); }
}
