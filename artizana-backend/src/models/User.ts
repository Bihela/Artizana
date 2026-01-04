import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  role?: 'Buyer' | 'Artisan' | 'NGO/Edu Partner' | 'Admin' | null;
  profilePhoto?: string;
  bio?: string;
  location?: string;
  phoneNumber?: string;
  shippingAddress?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
  _id: mongoose.Types.ObjectId;
}

const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, select: false },
  googleId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['Buyer', 'Artisan', 'NGO/Edu Partner', 'Admin'], default: null },
  profilePhoto: String,

  // Artisan specific
  bio: { type: String, trim: true },
  location: { type: String, trim: true },

  // Buyer specific
  phoneNumber: { type: String, trim: true },
  shippingAddress: { type: String, trim: true },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);