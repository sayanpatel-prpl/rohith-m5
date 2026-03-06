import { Router } from 'express';
import financialController from '../controllers/financialController.js';

const router = Router();

router.get('/', financialController.getAll);
router.get('/latest-quarter', financialController.getLatestQuarter);

export default router;
