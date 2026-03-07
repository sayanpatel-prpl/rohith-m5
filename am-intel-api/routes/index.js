import { Router } from 'express';
import companiesRouter from './companies.js';
import financialsRouter from './financials.js';
import signalsRouter from './signals.js';
import opportunitiesRouter from './opportunities.js';
import driftsRouter from './drifts.js';
import themesRouter from './themes.js';
import competitiveRouter from './competitive.js';
import marketPulseRouter from './marketPulse.js';
import talkVsWalkRouter from './talkVsWalk.js';
import watchlistRouter from './watchlist.js';
import dealsRouter from './deals.js';
import leadershipRouter from './leadership.js';
import actionLensRouter from './actionLens.js';
import dashboardRouter from './dashboard.js';
import sectorSignalsRouter from './sectorSignals.js';

const router = Router();

// Entity routes
router.use('/companies', companiesRouter);
router.use('/financials', financialsRouter);
router.use('/signals', signalsRouter);
router.use('/opportunities', opportunitiesRouter);
router.use('/drifts', driftsRouter);
router.use('/themes', themesRouter);
router.use('/competitive', competitiveRouter);
router.use('/market-pulse', marketPulseRouter);
router.use('/talk-vs-walk', talkVsWalkRouter);
router.use('/watchlist', watchlistRouter);
router.use('/deals', dealsRouter);
router.use('/leadership', leadershipRouter);
router.use('/action-lens', actionLensRouter);

// Sector signal architecture routes
router.use('/sector-signals', sectorSignalsRouter);

// Composite dashboard routes
router.use('/dashboard', dashboardRouter);

export default router;
