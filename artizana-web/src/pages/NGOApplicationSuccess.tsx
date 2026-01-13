import React from 'react';
import { Link } from 'react-router-dom';
import trophy from '../assets/hourglass.svg'; 

export default function NGOApplicationSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-10 text-center">
        <img src={trophy} alt="Success" className="w-28 h-28 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Registration Submitted</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Thank you for registering with Artizana.<br />
          Your application is now pending approval from our admin team.
        </p>

        <div className="bg-green-50 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-lg mb-5 text-center">What's Next?</h3>
          <div className="space-y-5 text-sm">
            <div className="flex gap-4">
              <div className="text-3xl">Verification</div>
              <div>
                <p className="font-medium">Admin Verification</p>
                <p className="text-gray-600">Our team will review your details. Usually takes 2–3 business days.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">Email</div>
              <div>
                <p className="font-medium">Email Notification</p>
                <p className="text-gray-600">You’ll receive an email with login details once approved.</p>
              </div>
            </div>
          </div>
        </div>

        <Link
          to="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-4 rounded-full rounded-full"
        >
          Back to Sign Up
        </Link>
      </div>
    </div>
  );
}