import driftRepository from '../repositories/driftRepository.js';

const driftController = {
  async getAll(req, res) {
    try {
      const data = await driftRepository.findAll();
      res.json({ data });
    } catch (error) {
      console.error('driftController.getAll error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  async getByCompany(req, res) {
    try {
      const data = await driftRepository.findByCompany(req.params.companyId);
      res.json({ data });
    } catch (error) {
      console.error('driftController.getByCompany error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },
};

export default driftController;
