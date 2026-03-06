import competitiveRepository from '../repositories/competitiveRepository.js';

const competitiveController = {
  async getAll(req, res) {
    try {
      const filters = {};
      if (req.query.move_type) filters.move_type = req.query.move_type;
      if (req.query.impact) filters.impact = req.query.impact;

      const data = await competitiveRepository.findAll(filters);
      res.json({ data });
    } catch (error) {
      console.error('competitiveController.getAll error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },
};

export default competitiveController;
