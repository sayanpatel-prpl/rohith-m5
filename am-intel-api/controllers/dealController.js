import dealRepository from '../repositories/dealRepository.js';

const dealController = {
  async getAll(req, res) {
    try {
      const filters = {};
      if (req.query.deal_type) filters.deal_type = req.query.deal_type;

      const data = await dealRepository.findAll(filters);
      res.json({ data });
    } catch (error) {
      console.error('dealController.getAll error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },
};

export default dealController;
