import orchestrator from '../agents/orchestrator.js';
import sectorSignalRepository from '../repositories/sectorSignalRepository.js';
import financialSignalRepository from '../repositories/financialSignalRepository.js';
import analystInteractionRepository from '../repositories/analystInteractionRepository.js';

const sectorSignalController = {
  // GET /sector-signals?dimension=&severity=&signal_type=&pattern_type=&limit=
  async getAll(req, res) {
    try {
      const data = await sectorSignalRepository.findAll({
        dimension: req.query.dimension,
        severity: req.query.severity,
        signal_type: req.query.signal_type,
        pattern_type: req.query.pattern_type,
        limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      });
      res.json({ data });
    } catch (error) {
      console.error('sectorSignalController.getAll error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  // GET /sector-signals/patterns?pattern_type=&severity=&limit=
  async getPatterns(req, res) {
    try {
      const data = await sectorSignalRepository.findPatterns({
        pattern_type: req.query.pattern_type,
        severity: req.query.severity,
        limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      });
      res.json({ data });
    } catch (error) {
      console.error('sectorSignalController.getPatterns error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  // GET /sector-signals/company/:companyId
  async getByCompany(req, res) {
    try {
      const data = await sectorSignalRepository.findByCompany(req.params.companyId);
      res.json({ data });
    } catch (error) {
      console.error('sectorSignalController.getByCompany error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  // GET /sector-signals/dimension/:dimension
  async getByDimension(req, res) {
    try {
      const data = await sectorSignalRepository.findByDimension(req.params.dimension);
      res.json({ data });
    } catch (error) {
      console.error('sectorSignalController.getByDimension error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  // POST /sector-signals/trigger
  // Body: { trigger_type, company_id? }
  async trigger(req, res) {
    try {
      const { trigger_type, company_id } = req.body;
      if (!trigger_type) {
        return res.status(400).json({
          error: `trigger_type is required. Valid: ${Object.keys(orchestrator.TRIGGER_AGENTS).join(', ')}`
        });
      }

      // Fire and forget
      orchestrator.handleTrigger(trigger_type, { companyId: company_id })
        .catch(err => console.error('[SectorSignalController] trigger error:', err.message));

      res.json({ data: { status: 'triggered', trigger_type, company_id } });
    } catch (error) {
      console.error('sectorSignalController.trigger error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  // GET /sector-signals/advisory-pipeline
  async getAdvisoryPipeline(req, res) {
    try {
      const data = await orchestrator.getAdvisoryPipeline();
      res.json({ data });
    } catch (error) {
      console.error('sectorSignalController.getAdvisoryPipeline error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  // GET /sector-signals/financial?company_id=&signal_type=&severity=
  async getFinancialSignals(req, res) {
    try {
      const data = await financialSignalRepository.findAll({
        company_id: req.query.company_id,
        signal_type: req.query.signal_type,
        severity: req.query.severity,
      });
      res.json({ data });
    } catch (error) {
      console.error('sectorSignalController.getFinancialSignals error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  // GET /sector-signals/analyst-interactions?company_id=&signal_type=&severity=
  async getAnalystInteractions(req, res) {
    try {
      const data = await analystInteractionRepository.findAll({
        company_id: req.query.company_id,
        signal_type: req.query.signal_type,
        severity: req.query.severity,
      });
      res.json({ data });
    } catch (error) {
      console.error('sectorSignalController.getAnalystInteractions error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  // GET /sector-signals/watchlist
  async getWatchlist(req, res) {
    try {
      // Get watchlist with latest sector signals per company
      const [signals, patterns] = await Promise.all([
        sectorSignalRepository.findAll({ severity: 'Critical', limit: 20 }),
        sectorSignalRepository.findPatterns({ limit: 10 }),
      ]);
      res.json({ data: { critical_signals: signals, patterns } });
    } catch (error) {
      console.error('sectorSignalController.getWatchlist error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },
};

export default sectorSignalController;
