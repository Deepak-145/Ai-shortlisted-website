import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function sign(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return next({ status: 400, message: 'Missing fields' });
    if (password.length < 6) return next({ status: 400, message: 'Password too short' });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return next({ status: 409, message: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    res.json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user) return next({ status: 401, message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return next({ status: 401, message: 'Invalid credentials' });
    res.json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) { next(e); }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.userId).select('name email createdAt');
    if (!user) return next({ status: 404, message: 'Not found' });
    res.json(user);
  } catch (e) { next(e); }
}
