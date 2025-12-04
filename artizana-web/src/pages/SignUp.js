// src/pages/SignUp.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// Dynamically load API base URL from .env
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Buyer');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roles = ['Buyer', 'Artisan'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword || !role || !agreeTerms) {
      setError('All fields and agreement to Terms & Conditions are required');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Invalid email format');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
        role,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);

      switch (role) {
        case 'Buyer':
          navigate('/buyer-dashboard');
          break;
        case 'Artisan':
          navigate('/artisan-dashboard');
          break;
        case 'NGO/Edu Partner':
          navigate('/ngo-dashboard');
          break;
        default:
          setError('Invalid role');
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    alert('Google sign-in functionality to be implemented');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-4">Artizana</h1>
        <p className="text-sm text-gray-600 mb-6">
          Join Artizana to discover unique handmade crafts.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2 bg-gray-50"
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2 bg-gray-50"
            placeholder="Password"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2 bg-gray-50"
            placeholder="Confirm Password"
            required
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2 bg-gray-50"
            placeholder="Full Name"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2 bg-gray-50"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <input
            id="terms"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mr-2"
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the Terms & Conditions
          </label>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded-full hover:bg-green-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="my-4 text-center text-gray-600">or</div>
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-gray-800 text-white p-2 rounded-full hover:bg-gray-900"
        >
          Continue with Google
        </button>

        <p className="text-sm text-gray-600 mt-4">Apply as an NGO</p>

        {/* KAN-5: link to login for existing users */}
        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-green-500 font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
