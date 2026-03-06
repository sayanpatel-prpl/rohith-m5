import { Router } from 'express';
import dealController from '../controllers/dealController.js';

const router = Router();

router.get('/', dealController.getAll);

export default router;
