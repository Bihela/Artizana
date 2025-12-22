const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, select: false },
  googleId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['Buyer', 'Artisan', 'NGO/Edu Partner', 'Admin'], default: null },
  profilePhoto: String,
<<<<<<< HEAD
}, { timestamps: true });

userSchema.pre('save', async function(next) {
=======

  // Artisan specific
  bio: { type: String, trim: true },
  location: { type: String, trim: true },

  // Buyer specific
  phoneNumber: { type: String, trim: true },
  shippingAddress: { type: String, trim: true },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
>>>>>>> dev
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

<<<<<<< HEAD
userSchema.methods.comparePassword = async function(candidatePassword) {
=======
userSchema.methods.comparePassword = async function (candidatePassword) {
>>>>>>> dev
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);