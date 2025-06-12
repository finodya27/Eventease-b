const Form = require('../models/form');
const path = require('path');

// Submit a form
exports.submitForm = async (req, res) => {
  const { jenisUsaha, namaUsaha, deskripsiUsaha, nomorWhatsApp } = req.body;

  // Gunakan path atau URL langsung dari Cloudinary
  const ktpNpwpUrl = req.files['ktpNpwp'] 
    ? req.files['ktpNpwp'][0].path // atau req.files['ktpNpwp'][0].url 
    : null;
  const fotoUsahaUrl = req.files['fotoUsaha'] 
    ? req.files['fotoUsaha'][0].path // atau req.files['fotoUsaha'][0].url
    : null;

  try {
    // Validate required fields
    if (!jenisUsaha || !namaUsaha || !deskripsiUsaha || !nomorWhatsApp || !ktpNpwpUrl || !fotoUsahaUrl) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newForm = new Form({ 
      jenisUsaha, 
      namaUsaha, 
      deskripsiUsaha, 
      nomorWhatsApp,
      ktpNpwpUrl,
      fotoUsahaUrl
    });

    await newForm.save();
    
    res.status(201).json({ 
      message: 'Form submitted successfully', 
      formId: newForm._id 
    });
  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({ 
      message: 'Error submitting form', 
      error: error.message 
    });
  }
};

// Get all unverified submissions
exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Form.find({ isVerified: { $ne: true } });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching submissions', 
      error: error.message 
    });
  }
};

// Get verified businesses
exports.getVerifiedBusinesses = async (req, res) => {
  try {
    const businesses = await Form.find({ isVerified: true });
    res.status(200).json(businesses);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching verified businesses', 
      error: error.message 
    });
  }
};

// Verify or reject a submission
exports.verifySubmission = async (req, res) => {
  const { id } = req.params;
  const { isVerified } = req.body;

  try {
    const submission = await Form.findByIdAndUpdate(
      id, 
      { isVerified }, 
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(200).json({ 
      message: `Submission ${isVerified ? 'verified' : 'rejected'}`, 
      submission 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error verifying submission', 
      error: error.message 
    });
  }
};

// Get a specific business by ID
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Form.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching business details', 
      error: error.message 
    });
  }
};
