import { Router } from 'express';
import leadershipController from '../controllers/leadershipController.js';

const router = Router();

router.get('/', leadershipController.getAll);

export default router;
