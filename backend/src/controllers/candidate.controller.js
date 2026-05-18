import Candidate from '../models/Candidate.js';
import { normalizeSkills } from '../utils/skills.js';

export async function create(req, res, next) {
  try {
    const { name, email, skills, experience, bio } = req.body || {};
    if (!name || !email) return next({ status: 400, message: 'Name and email required' });
    const doc = await Candidate.create({
      owner: req.userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      skills: normalizeSkills(skills),
      experience: Number(experience) || 0,
      bio: bio || '',
    });
    res.json(doc);
  } catch (e) {
    if (e.code === 11000) return next({ status: 409, message: 'Candidate with this email exists' });
    next(e);
  }
}

export async function list(req, res, next) {
  try {
    const { search = '', skill = '', page = 1, limit = 50 } = req.query;
    const q = { owner: req.userId };
    if (search) {
      const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      q.$or = [{ name: rx }, { email: rx }, { bio: rx }];
    }
    if (skill) q.skills = { $in: [new RegExp(`^${skill}$`, 'i')] };
    const p = Math.max(1, Number(page));
    const l = Math.min(100, Math.max(1, Number(limit)));
    const [items, total] = await Promise.all([
      Candidate.find(q).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l),
      Candidate.countDocuments(q),
    ]);
    res.json({ items, total, page: p, limit: l });
  } catch (e) { next(e); }
}

export async function getOne(req, res, next) {
  try {
    const doc = await Candidate.findOne({ _id: req.params.id, owner: req.userId });
    if (!doc) return next({ status: 404, message: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
}

export async function update(req, res, next) {
  try {
    const patch = { ...req.body };
    if (patch.skills) patch.skills = normalizeSkills(patch.skills);
    if (patch.experience != null) patch.experience = Number(patch.experience) || 0;
    if (patch.email) patch.email = String(patch.email).toLowerCase().trim();
    const doc = await Candidate.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      patch,
      { new: true }
    );
    if (!doc) return next({ status: 404, message: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
}

export async function remove(req, res, next) {
  try {
    const r = await Candidate.deleteOne({ _id: req.params.id, owner: req.userId });
    if (!r.deletedCount) return next({ status: 404, message: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
}
