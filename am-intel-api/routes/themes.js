import { Router } from 'express';
import themeController from '../controllers/themeController.js';

const router = Router();

router.get('/', themeController.getAll);
router.get('/:id', themeController.getById);

export default router;
