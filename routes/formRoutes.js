const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const upload = require('../config/cloudinaryConfig');

// Submit form route with multiple file uploads to Cloudinary
router.post('/submit', 
  upload.fields([
    { name: 'ktpNpwp', maxCount: 1 },
    { name: 'fotoUsaha', maxCount: 1 }
  ]), 
  formController.submitForm
);

router.get('/submissions', formController.getSubmissions);
router.get('/verified-businesses', formController.getVerifiedBusinesses);
router.post('/verify/:id', formController.verifySubmission);
router.get('/business/:id', formController.getBusinessById);

module.exports = router;