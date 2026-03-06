import talkVsWalkRepository from '../repositories/talkVsWalkRepository.js';

const talkVsWalkController = {
  async getAll(req, res) {
    try {
      const data = await talkVsWalkRepository.findAll();
      res.json({ data });
    } catch (error) {
      console.error('talkVsWalkController.getAll error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  async upsert(req, res) {
    try {
      const data = await talkVsWalkRepository.upsert(req.params.companyId, req.body);
      res.json({ data });
    } catch (error) {
      console.error('talkVsWalkController.upsert error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },
};

export default talkVsWalkController;
