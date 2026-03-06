import { Router } from 'express';
import watchlistController from '../controllers/watchlistController.js';

const router = Router();

router.get('/', watchlistController.getAll);

export default router;
