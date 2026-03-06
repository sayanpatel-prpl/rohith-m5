import companyRepository from '../repositories/companyRepository.js';

const companyController = {
  async getAll(req, res) {
    try {
      const data = await companyRepository.findAll();
      res.json({ data });
    } catch (error) {
      console.error('companyController.getAll error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await companyRepository.findById(req.params.id);
      res.json({ data });
    } catch (error) {
      console.error('companyController.getById error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  async getByIdFull(req, res) {
    try {
      const data = await companyRepository.findByIdFull(req.params.id);
      res.json({ data });
    } catch (error) {
      console.error('companyController.getByIdFull error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { variance, source } = req.body;
      const data = await companyRepository.update(req.params.id, { variance, source });
      res.json({ data });
    } catch (error) {
      console.error('companyController.update error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  async upsertTaxonomy(req, res) {
    try {
      const data = await companyRepository.upsertTaxonomy(req.params.id, req.body);
      res.json({ data });
    } catch (error) {
      console.error('companyController.upsertTaxonomy error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  async replaceProductMix(req, res) {
    try {
      const data = await companyRepository.replaceProductMix(req.params.id, req.body.entries);
      res.json({ data });
    } catch (error) {
      console.error('companyController.replaceProductMix error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  async upsertPremiumMix(req, res) {
    try {
      const data = await companyRepository.upsertPremiumMix(req.params.id, req.body);
      res.json({ data });
    } catch (error) {
      console.error('companyController.upsertPremiumMix error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },
};

export default companyController;
