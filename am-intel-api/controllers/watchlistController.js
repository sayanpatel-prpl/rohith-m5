import watchlistRepository from '../repositories/watchlistRepository.js';

const watchlistController = {
  async getAll(req, res) {
    try {
      const data = await watchlistRepository.findAll();
      res.json({ data });
    } catch (error) {
      console.error('watchlistController.getAll error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },
};

export default watchlistController;
