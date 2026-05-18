import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  create, list, getOne, update, remove,
} from '../controllers/candidate.controller.js';

const r = Router();
r.use(requireAuth);
r.post('/', create);
r.get('/', list);
r.get('/:id', getOne);
r.put('/:id', update);
r.delete('/:id', remove);
export default r;
