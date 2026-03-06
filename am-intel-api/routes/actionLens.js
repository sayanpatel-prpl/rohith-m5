import { Router } from 'express';
import actionLensController from '../controllers/actionLensController.js';

const router = Router();

router.get('/', actionLensController.getAll);

export default router;
