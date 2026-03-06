import opportunityRepository from '../repositories/opportunityRepository.js';

const opportunityController = {
  async getAll(req, res) {
    try {
      const filters = {};
      if (req.query.stage) filters.stage = req.query.stage;

      const data = await opportunityRepository.findAll(filters);
      res.json({ data });
    } catch (error) {
      console.error('opportunityController.getAll error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },
};

export default opportunityController;
