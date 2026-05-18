import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { match } from '../controllers/match.controller.js';

const r = Router();
r.use(requireAuth);
r.post('/', match);
export default r;
