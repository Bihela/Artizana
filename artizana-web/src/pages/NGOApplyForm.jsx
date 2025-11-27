// src/pages/NGOApplyForm.jsx  (or wherever you keep it)
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export default function NGOApplyForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);
  const navigate = useNavigate();

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo must be under 5MB');
        return;
      }
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await axios.post(`${API_BASE_URL}/ngo-applications/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/ngo-success');
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">

        {/* Header - Artizana Title */}
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Artizana</h1>

        {/* NGO Logo Upload Circle */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="NGO Logo"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-dashed border-gray-400 flex items-center justify-center">
                <span className="text-5xl text-gray-500 font-bold">NGO</span>
              </div>
            )}
          </div>
          <label className="mt-4 cursor-pointer">
            <span className="text-green-600 font-semibold hover:underline text-lg">
              Upload NGO Logo 
            </span>
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Apply as NGO/Edu Partner
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Join us in empowering artisans globally
          </p>

          <form onSubmit={handleSubmit} className="space-y-7">

            {/* Organization Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Organization Name *</label>
              <input
                name="organizationName"
                type="text"
                required
                className="w-full px-5 py-4 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. Hope Foundation"
              />
            </div>

            {/* Registration Number */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Registration Number *</label>
              <input
                name="registrationNumber"
                type="text"
                required
                className="w-full px-5 py-4 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="NGO-DARPAN ID or Certificate No."
              />
            </div>

            {/* Contact Person Info */}
            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Contact Person Name *</label>
                <input
                  name="contactName"
                  type="text"
                  required
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl bg-gray-50"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email *</label>
                <input
                  name="contactEmail"
                  type="email"
                  required
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl bg-gray-50"
                  placeholder="contact@ngo.org"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Phone *</label>
                <input
                  name="contactPhone"
                  type="tel"
                  required
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl bg-gray-50"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Organization Address *</label>
              <textarea
                name="address"
                required
                rows="3"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Full address"
              />
            </div>

            {/* Mission */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Mission & Description <span className="text-gray-500">Description (min 50 characters) *</span>
              </label>
              <textarea
                name="mission"
                required
                minLength="50"
                rows="5"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Tell us about your mission and impact..."
              />
            </div>

            {/* File Uploads */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                Registration Certificate *
              </label>
              <input
                type="file"
                name="certificate"
                accept="image/*,.pdf"
                required
                className="w-full text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-3">
                Additional Proof (80G, 12A, etc.) *
              </label>
              <input
                type="file"
                name="proof"
                accept="image/*,.pdf"
                required
                className="w-full text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-600 text-center font-medium bg-red-50 py-3 rounded-lg">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold text-lg py-5 rounded-full transition transform hover:scale-105 shadow-lg"
            >
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}