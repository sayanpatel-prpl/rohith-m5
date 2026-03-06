import financialRepository from '../repositories/financialRepository.js';

const financialController = {
  async getAll(req, res) {
    try {
      const data = await financialRepository.findAll();
      res.json({ data });
    } catch (error) {
      console.error('financialController.getAll error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  async getByCompany(req, res) {
    try {
      const data = await financialRepository.findByCompany(req.params.companyId);
      res.json({ data });
    } catch (error) {
      console.error('financialController.getByCompany error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  async getLatestQuarter(req, res) {
    try {
      const data = await financialRepository.getLatestQuarter();
      res.json({ data });
    } catch (error) {
      console.error('financialController.getLatestQuarter error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },
};

export default financialController;
