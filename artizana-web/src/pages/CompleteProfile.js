import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

const CompleteProfile = () => {
  const [role, setRole] = useState('Buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.put(
        `${API_BASE_URL}/auth/update-role`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem('token', res.data.token);

      if (role === 'Buyer') navigate('/buyer-dashboard');
      else if (role === 'Artisan') navigate('/artisan-dashboard');
      else navigate('/ngo-dashboard');

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Complete Profile</h1>
          <p className="text-gray-600 mt-2">Please select your account type to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white"
            >
              <option value="Buyer">Buyer</option>
              <option value="Artisan">Artisan</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-lg transition duration-200 disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;