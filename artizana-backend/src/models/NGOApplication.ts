// models/NGOApplication.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface INGOApplication extends Document {
  organizationName: string;
  registrationNumber: string;
  certificateUrl: string;
  proofUrl: string;
  logoUrl?: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  address: string;
  mission: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  submittedAt: Date;
}

const NGOApplicationSchema: Schema = new Schema({
  organizationName: { type: String, required: true, trim: true },
  registrationNumber: { type: String, required: true },
  certificateUrl: { type: String, required: true },
  proofUrl: { type: String, required: true },
  logoUrl: { type: String },
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

export default mongoose.model<INGOApplication>('NGOApplication', NGOApplicationSchema);