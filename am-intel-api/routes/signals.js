import { Router } from 'express';
import signalController from '../controllers/signalController.js';

const router = Router();

router.get('/', signalController.getAll);
router.get('/:id/evidence', signalController.getEvidence);

export default router;
