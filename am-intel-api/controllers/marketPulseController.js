import marketPulseRepository from '../repositories/marketPulseRepository.js';

const marketPulseController = {
  async getAll(req, res) {
    try {
      const data = await marketPulseRepository.findAll();
      res.json({ data });
    } catch (error) {
      console.error('marketPulseController.getAll error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },
};

export default marketPulseController;
