import { Router } from 'express';
import companyController from '../controllers/companyController.js';
import financialController from '../controllers/financialController.js';
import signalController from '../controllers/signalController.js';
import driftController from '../controllers/driftController.js';
import talkVsWalkController from '../controllers/talkVsWalkController.js';

const router = Router();

// Core company endpoints
router.get('/', companyController.getAll);
router.get('/:id', companyController.getById);
router.get('/:id/full', companyController.getByIdFull);

// Write endpoints (for /intel skill)
router.put('/:id', companyController.update);
router.put('/:id/taxonomy', companyController.upsertTaxonomy);
router.post('/:id/product-mix', companyController.replaceProductMix);
router.put('/:id/premium-mix', companyController.upsertPremiumMix);

// Nested company resources
router.get('/:companyId/financials', financialController.getByCompany);
router.get('/:companyId/signals', signalController.getByCompany);
router.post('/:companyId/signals', signalController.bulkInsert);
router.get('/:companyId/drifts', driftController.getByCompany);
router.put('/:companyId/talk-vs-walk', talkVsWalkController.upsert);

export default router;
