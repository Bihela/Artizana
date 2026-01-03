import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signInAnonymously } from 'firebase/auth';
import { storage, auth } from '../firebase';
import axios from 'axios';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        quantity: '',
        tags: '',
    });

    const categories = ['Home Decor', 'Jewelry', 'Clothing', 'Accessories', 'Art', 'Crafts'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImages(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const [statusMessage, setStatusMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage('Starting submission...');

        try {
            // 1. Upload images to Firebase Storage
            // 1. Upload images to Firebase Storage
            if (images.length > 0) {
                // Check if user is authenticated with Firebase
                // Check if user is authenticated with Firebase
                if (!auth.currentUser) {
                    setStatusMessage('Authenticating for upload...');
                    try {
                        // 1. Try to get Custom Token from Backend
                        const authToken = localStorage.getItem('authToken');
                        const response = await axios.get('http://localhost:5001/api/auth/firebase-token', {
                            headers: { Authorization: `Bearer ${authToken}` }
                        });

                        if (response.data.token) {
                            const { signInWithCustomToken } = await import('firebase/auth');
                            await signInWithCustomToken(auth, response.data.token);
                            console.log('Signed in with Custom Token');
                        } else {
                            throw new Error('No custom token returned');
                        }
                    } catch (customAuthError) {
                        console.warn('Custom Token auth failed. Falling back to Anonymous.', customAuthError);
                        // 2. Fallback to Anonymous Auth
                        try {
                            await signInAnonymously(auth);
                            console.log('Signed in Anonymously');
                        } catch (anonError) {
                            console.warn('Anonymous auth failed. Proceeding with upload anyway (public rules check).', anonError);
                        }
                    }
                }

                setStatusMessage('Uploading images to Firebase...');
            }

            const imageUrls = await Promise.all(
                images.map(async (image) => {
                    try {
                        const storageRef = ref(storage, `products/${Date.now()}_${image.name}`);
                        const snapshot = await uploadBytes(storageRef, image);
                        const url = await getDownloadURL(snapshot.ref);
                        return url;
                    } catch (uploadErr) {
                        throw new Error(`Failed to upload image: ${image.name}`);
                    }
                })
            );

            // 2. Prepare payload
            setStatusMessage('Saving product details...');

            const payload = {
                ...formData,
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                tags: formData.tags.split(',').map(tag => tag.trim()), // Split tags by comma
                images: imageUrls,
            };

            // 3. Send to backend
            // Assuming user is authenticated and token is in localStorage or handled by axios interceptor
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            await axios.post('http://localhost:5001/api/products/add', payload, {
                ...config,
                timeout: 10000, // Increased to 10 seconds
            });

            setStatusMessage('Product published!');
            alert('Product added successfully!');
            navigate('/artisan-dashboard'); // Redirect to dashboard
        } catch (error) {
            console.error('Error adding product:', error);
            setStatusMessage('');
            if (error.code === 'ECONNABORTED') {
                alert('Request timed out. Please try publishing again.');
            } else {
                alert('Failed to add product: ' + (error.response?.data?.message || error.message));
            }
        } finally {
            setLoading(false);
            setStatusMessage('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <div className="mb-8 border-b pb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Add a Unique Item</h1>
                        <p className="mt-1 text-sm text-gray-500">Showcase your craftsmanship to the world.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Product Title</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                                placeholder="e.g. Handwoven Basket"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                id="description"
                                rows={4}
                                required
                                value={formData.description}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                                placeholder="Describe the materials, process, and story behind your product..."
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            {/* Price */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (LKR)</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">LKR</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        required
                                        min="0"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="focus:ring-green-500 focus:border-green-500 block w-full pl-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    id="quantity"
                                    required
                                    min="1"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                    placeholder="Available stock"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tags */}
                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
                                <input
                                    type="text"
                                    name="tags"
                                    id="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                    placeholder="e.g. handmade, organic, gift (comma separated)"
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Images</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-green-400 transition-colors">
                                <div className="space-y-1 text-center">
                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                            <span>Upload files</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleImageChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                </div>
                            </div>

                            {/* Image Previews */}
                            {images.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                    {images.map((img, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={URL.createObjectURL(img)}
                                                alt={`Preview ${index}`}
                                                className="h-24 w-full object-cover rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="pt-5 border-t border-gray-200 flex justify-end">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (statusMessage || 'Publishing...') : 'Publish Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
