import leadershipRepository from '../repositories/leadershipRepository.js';

const leadershipController = {
  async getAll(req, res) {
    try {
      const data = await leadershipRepository.findAll();
      res.json({ data });
    } catch (error) {
      console.error('leadershipController.getAll error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },
};

export default leadershipController;
