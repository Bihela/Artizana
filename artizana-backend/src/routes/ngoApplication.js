// src/routes/ngoApplication.js
const express = require('express');
const multer = require('multer');
const NGOApplication = require('../models/NGOApplication');
const { uploadFileToFirebase } = require('../utils/uploadToFirebase');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// HANDLER EXTRACTED FOR UNIT TESTING
const applyNGOHandler = async (req, res) => {
  try {
    const {
      organizationName,
      registrationNumber,
      contactName,
      contactEmail,
      contactPhone,
      address,
      mission,
    } = req.body;

    const certificateFile = req.files['certificate']?.[0];
    const proofFile = req.files['proof']?.[0];
    const logoFile = req.files['logo']?.[0];

    // Validation: Required fields
    if (
      !organizationName ||
      !registrationNumber ||
      !contactName ||
      !contactEmail ||
      !contactPhone ||
      !address ||
      !mission ||
      !certificateFile ||
      !proofFile
    ) {
      return res.status(400).json({
        error: 'All fields and certificate/proof files are required',
      });
    }

    if (mission.length < 50) {
      return res.status(400).json({
        error: 'Mission must be at least 50 characters',
      });
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (
      certificateFile.size > MAX_SIZE ||
      proofFile.size > MAX_SIZE ||
      (logoFile && logoFile.size > MAX_SIZE)
    ) {
      return res.status(400).json({
        error: 'Each file must be under 5MB',
      });
    }

    // Upload files to Firebase
    const certificateUrl = await uploadFileToFirebase(
      certificateFile.buffer,
      certificateFile.originalname,
      'ngo-certificates'
    );
    const proofUrl = await uploadFileToFirebase(
      proofFile.buffer,
      proofFile.originalname,
      'ngo-proofs'
    );

    let logoUrl = null;
    if (logoFile) {
      logoUrl = await uploadFileToFirebase(
        logoFile.buffer,
        logoFile.originalname,
        'ngo-logos'
      );
    }

    // Save application to DB
    const application = new NGOApplication({
      organizationName,
      registrationNumber,
      certificateUrl,
      proofUrl,
      logoUrl,
      contactPerson: {
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
      },
      address,
      mission,
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: application._id,
    });
  } catch (error) {
    console.error('NGO Application Error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};

// Attach middleware + handler
router.post(
  '/apply',
  upload.fields([
    { name: 'certificate', maxCount: 1 },
    { name: 'proof', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]),
  applyNGOHandler
);

// Export both: router for app + handler for unit tests
module.exports = router;
module.exports.applyNGOHandler = applyNGOHandler;