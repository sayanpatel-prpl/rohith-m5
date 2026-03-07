import { Router } from 'express';
import sectorSignalController from '../controllers/sectorSignalController.js';

const router = Router();

// Unified sector signal feed
router.get('/', sectorSignalController.getAll);

// Cross-dimensional patterns
router.get('/patterns', sectorSignalController.getPatterns);

// Advisory pipeline (service line mapping)
router.get('/advisory-pipeline', sectorSignalController.getAdvisoryPipeline);

// Watchlist (critical signals + patterns)
router.get('/watchlist', sectorSignalController.getWatchlist);

// Financial signals
router.get('/financial', sectorSignalController.getFinancialSignals);

// Analyst interactions
router.get('/analyst-interactions', sectorSignalController.getAnalystInteractions);

// Per-company signals
router.get('/company/:companyId', sectorSignalController.getByCompany);

// Per-dimension signals
router.get('/dimension/:dimension', sectorSignalController.getByDimension);

// Trigger agents (event-driven)
router.post('/trigger', sectorSignalController.trigger);

export default router;
