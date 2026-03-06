import { Router } from 'express';
import competitiveController from '../controllers/competitiveController.js';

const router = Router();

router.get('/moves', competitiveController.getAll);

export default router;
