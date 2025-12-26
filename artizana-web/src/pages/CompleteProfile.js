import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

const CompleteProfile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Buyer', // Default
    bio: '',
    location: '',
    phoneNumber: '',
    shippingAddress: ''
  });
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Get token from URL or LocalStorage
  const urlToken = searchParams.get('token');
  const token = urlToken || localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // If URL token exists, sync to localStorage
    if (urlToken) {
      localStorage.setItem('token', urlToken);
    }

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate, urlToken]); // fetchUser is stable or can be ignored here as it's defined outside or we use callback, but simplest is ignore or add. Adding eslint-disable is safer if fetchUser changes often or causes loops.
  // Actually, fetchUser is defined BELOW this useEffect, which is also bad practice if it's used inside.
  // Best practice: move fetchUser definition INSIDE useEffect or wrap in useCallback.
  // Given the structure, I will move fetchUser inside useEffect to avoid complexity or loop issues.

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = res.data.user;

      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'Buyer',
        bio: user.bio || '',
        location: user.location || '',
        phoneNumber: user.phoneNumber || '',
        shippingAddress: user.shippingAddress || ''
      }));

      if (user.profilePhoto) {
        setPhotoPreview(user.profilePhoto);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch user data');
      setLoading(false);
      // If unauthorized, maybe redirect to login?
      if (err.response && err.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Validation
    if (formData.role === 'Artisan' && (!formData.bio || !formData.location)) {
      setError('Bio and Location are required for Artisans');
      setSaving(false);
      return;
    }
    if (formData.role === 'Buyer' && (!formData.phoneNumber || !formData.shippingAddress)) {
      setError('Phone Number and Shipping Address are required for Buyers');
      setSaving(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      if (formData.password) data.append('password', formData.password);
      data.append('role', formData.role);

      if (formData.role === 'Artisan') {
        data.append('bio', formData.bio);
        data.append('location', formData.location);
      } else if (formData.role === 'Buyer') {
        data.append('phoneNumber', formData.phoneNumber);
        data.append('shippingAddress', formData.shippingAddress);
      }

      if (profilePhotoFile) {
        data.append('profilePhoto', profilePhotoFile);
      }

      const res = await axios.put(
        `${API_BASE_URL}/auth/update-profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Update token in localStorage if a new one is returned
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }

      // Redirect
      if (formData.role === 'Buyer') navigate('/buyer-dashboard');
      else if (formData.role === 'Artisan') navigate('/artisan-dashboard');
      else navigate('/ngo-dashboard');

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">Finish setting up your {formData.role} account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
              )}
            </div>
            <label className="cursor-pointer bg-white border border-gray-300 rounded-md py-2 px-4 shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <span>Upload Photo</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Password (Optional)</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                <option value="Buyer">Buyer</option>
                <option value="Artisan">Artisan</option>
                <option value="NGO/Edu Partner">NGO / Educational Partner</option>
              </select>
            </div>
          </div>

          {/* Role Specific Fields */}
          {formData.role === 'Artisan' && (
            <div className="space-y-6 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900">Artisan Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself and your craft..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Kandy, Sri Lanka" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
              </div>
            </div>
          )}

          {formData.role === 'Buyer' && (
            <div className="space-y-6 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900">Buyer Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
                <textarea name="shippingAddress" rows="3" value={formData.shippingAddress} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded">{error}</p>}

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-lg transition duration-200 disabled:bg-gray-400"
            >
              {saving ? 'Saving Profile...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;