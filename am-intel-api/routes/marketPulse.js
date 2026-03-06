import { Router } from 'express';
import marketPulseController from '../controllers/marketPulseController.js';

const router = Router();

router.get('/', marketPulseController.getAll);

export default router;
