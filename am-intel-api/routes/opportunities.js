import { Router } from 'express';
import opportunityController from '../controllers/opportunityController.js';

const router = Router();

router.get('/', opportunityController.getAll);

export default router;
