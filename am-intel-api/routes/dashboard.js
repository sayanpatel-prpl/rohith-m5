import { Router } from 'express';
import dashboardController from '../controllers/dashboardController.js';

const router = Router();

router.get('/executive-snapshot', dashboardController.executiveSnapshot);
router.get('/financial-performance', dashboardController.financialPerformance);
router.get('/transcript-intel', dashboardController.transcriptIntel);
router.get('/sub-sector-deep-dive', dashboardController.subSectorDeepDive);
router.get('/advisory-pipeline', dashboardController.advisoryPipeline);

export default router;
