import { Router } from 'express';
import driftController from '../controllers/driftController.js';

const router = Router();

router.get('/', driftController.getAll);

export default router;
