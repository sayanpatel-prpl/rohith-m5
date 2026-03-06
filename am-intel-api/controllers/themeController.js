import themeRepository from '../repositories/themeRepository.js';

const themeController = {
  async getAll(req, res) {
    try {
      const data = await themeRepository.findAllWithEvidence();
      res.json({ data });
    } catch (error) {
      console.error('themeController.getAll error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await themeRepository.findById(req.params.id);
      res.json({ data });
    } catch (error) {
      console.error('themeController.getById error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },
};

export default themeController;
