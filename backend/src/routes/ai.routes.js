import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { shortlist } from '../controllers/ai.controller.js';

const r = Router();
r.use(requireAuth);
r.post('/shortlist', shortlist);
export default r;
