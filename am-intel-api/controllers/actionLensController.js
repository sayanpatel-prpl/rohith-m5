import actionLensRepository from '../repositories/actionLensRepository.js';

const actionLensController = {
  async getAll(req, res) {
    try {
      const filters = {};
      if (req.query.persona) filters.persona = req.query.persona;

      const data = await actionLensRepository.findAll(filters);
      res.json({ data });
    } catch (error) {
      console.error('actionLensController.getAll error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },
};

export default actionLensController;
