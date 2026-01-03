// models/NGOApplication.js
const mongoose = require('mongoose');

const NGOApplicationSchema = new mongoose.Schema({
  organizationName: { type: String, required: true, trim: true },
  registrationNumber: { type: String, required: true },
  certificateUrl: { type: String, required: true },
  proofUrl: { type: String, required: true },
  logoUrl: { type: String }, // NEW: NGO logo
  contactPerson: {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
  },
  address: { type: String, required: true },
  mission: { type: String, required: true, minlength: 50 },
  status: {
    type: String,
    enum: ['Pending Approval', 'Approved', 'Rejected'],
    default: 'Pending Approval',
  },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('NGOApplication', NGOApplicationSchema);