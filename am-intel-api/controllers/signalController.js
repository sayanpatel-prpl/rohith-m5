import signalRepository from '../repositories/signalRepository.js';

const signalController = {
  async getAll(req, res) {
    try {
      const filters = {};
      if (req.query.severity) filters.severity = req.query.severity;
      if (req.query.status) filters.status = req.query.status;
      if (req.query.confidence) filters.confidence = req.query.confidence;

      const data = await signalRepository.findAll(filters);
      res.json({ data });
    } catch (error) {
      console.error('signalController.getAll error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  async getByCompany(req, res) {
    try {
      const data = await signalRepository.findByCompany(req.params.companyId);
      res.json({ data });
    } catch (error) {
      console.error('signalController.getByCompany error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  async getEvidence(req, res) {
    try {
      const data = await signalRepository.findEvidence(req.params.id);
      res.json({ data });
    } catch (error) {
      console.error('signalController.getEvidence error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  async bulkInsert(req, res) {
    try {
      const data = await signalRepository.bulkInsert(
        req.params.companyId,
        req.body.signals
      );
      res.status(201).json({ data });
    } catch (error) {
      console.error('signalController.bulkInsert error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },
};

export default signalController;
