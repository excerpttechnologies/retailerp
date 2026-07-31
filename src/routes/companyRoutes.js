const express = require('express');
const {
  createCompany, getCompanies, getCompanyById, updateCompany, updateCompanyStatus, deleteCompany, getAdminDashboard,
} = require('../controllers/companyController');
const { protect, superAdminOnly } = require('../middleware/auth');
const { makeUploader } = require('../middleware/upload');

const router = express.Router();
const uploadLogo = makeUploader('companies', /jpeg|jpg|png|webp/);

router.use(protect, superAdminOnly);

router.get('/dashboard', getAdminDashboard);
router.route('/companies')
  .get(getCompanies)
  .post(uploadLogo.single('logo'), createCompany);
router.route('/companies/:id')
  .get(getCompanyById)
  .put(uploadLogo.single('logo'), updateCompany)
  .delete(deleteCompany);
router.patch('/companies/:id/status', updateCompanyStatus);

module.exports = router;
