import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

const CompleteProfile = () => {
  const [role, setRole] = useState('Buyer');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);

      // Remove token from URL without reloading page
      const newURL = window.location.pathname;
      window.history.replaceState({}, document.title, newURL);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/auth/complete-profile`,
        { role },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // Update token in case backend returns a new one
      if (res.data.token) localStorage.setItem('token', res.data.token);

      // Redirect based on role
      if (role === 'Artisan') navigate('/artisan-dashboard');
      else if (role === 'Buyer') navigate('/buyer-dashboard');
      else navigate('/ngo-dashboard');
    } catch (err) {
      alert('Failed to save role: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome to Artizana!</h1>
        <p className="text-gray-600 mb-8">Please select your role to continue</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-4 border rounded-lg text-lg"
            required
          >
            <option value="Buyer">Buyer</option>
            <option value="Artisan">Artisan (Sell Crafts)</option>
            <option value="NGO/Edu Partner">NGO / Educational Partner</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Continue →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;