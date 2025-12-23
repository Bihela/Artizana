// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Use same API base as Login (env or 5001)
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

    useEffect(() => {
        const fetchProfile = async () => {
            // Fix: Login.js sets 'authToken', not 'token'
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // Fix: Use API_BASE_URL (5001)
                const response = await axios.get(`${API_BASE_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data.user);
            } catch (err) {
                console.error('Failed to fetch profile', err);
                setError('Failed to load profile');
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) return <div className="p-8 text-center" data-testid="loading">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500" data-testid="error">{error}</div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                    {/* Left Column: User Card (takes 3/12 cols on large screens) */}
                    <div className="lg:col-span-3 xl:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center h-fit sticky top-24">
                            <div className="relative group">
                                {user.profilePhoto ? (
                                    <img
                                        src={user.profilePhoto}
                                        alt={user.name}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-emerald-50"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center text-emerald-600 text-4xl font-bold shadow-inner ring-4 ring-white">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full shadow-md border-2 border-white cursor-pointer hover:bg-emerald-600 transition-transform hover:scale-105">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </div>
                            </div>

                            <h2 className="mt-4 text-2xl font-bold text-gray-900" data-testid="user-name">{user.name}</h2>
                            <p className="text-gray-500 font-medium" data-testid="user-email">{user.email}</p>

                            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold border border-emerald-100">
                                    {user.role}
                                </span>
                            </div>

                            <button className="mt-8 w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors focus:ring-4 focus:ring-gray-200">
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Content (takes 9/12 cols) */}
                    <div className="lg:col-span-9 xl:col-span-9 space-y-6">
                        {/* Stats / Quick Info (Placeholder) */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                                <span className="block text-2xl font-bold text-gray-900">0</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Orders</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                                <span className="block text-2xl font-bold text-gray-900">0</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Wishlist</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                                <span className="block text-2xl font-bold text-gray-900">0</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Reviews</span>
                            </div>
                        </div>

                        {/* Recent Activity Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-grow">
                            <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                                <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">View All</button>
                            </div>

                            <div className="p-8 flex flex-col items-center justify-center min-h-[300px] text-center" data-testid="activity-placeholder">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h4 className="text-lg font-medium text-gray-900 mb-1">No recent activity</h4>
                                <p className="text-gray-500 max-w-sm">
                                    Your recent interactions with products and artisans will appear here. Start exploring!
                                </p>
                                <button className="mt-6 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm shadow-emerald-200">
                                    Browse Artisans
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
