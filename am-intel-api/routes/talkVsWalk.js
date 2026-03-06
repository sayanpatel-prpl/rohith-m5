import { Router } from 'express';
import talkVsWalkController from '../controllers/talkVsWalkController.js';

const router = Router();

router.get('/', talkVsWalkController.getAll);

export default router;
