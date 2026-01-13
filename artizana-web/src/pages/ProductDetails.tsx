import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Carousel from '../components/Carousel';

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    quantity: number;
    images: string[];
    artisan: {
        _id: string;
        name: string;
        profilePhoto?: string;
        location?: string;
        bio?: string;
    };
    feedback?: {
        averageRating: number | null;
        reviewCount: number;
        reviews: any[];
    };
}

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
                // Handle error (e.g. redirect to 404)
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div role="status" className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!product) {
        return <div className="text-center p-10">Product not found</div>;
    }

    const { title, price, description, artisan, images, quantity: stock } = product;
    const stockStatus = stock > 0 ? `Stock: ${stock} left` : 'Out of Stock';

    return (
        <div className="container mx-auto px-4 py-8">
            <button onClick={() => navigate(-1)} className="mb-4 text-gray-600 hover:text-black">
                &larr; Back
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Images */}
                <div className="space-y-4">
                    {/* Main Image View using Carousel or Custom Grid */}
                    {/* Reusing common Carousel component as requested or if suitable */}
                    <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <Carousel images={images} autoPlay={false} />
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="space-y-6">
                    <div>
                        <p className="text-sm text-gray-500">Product Details</p>
                        <h1 className="text-3xl font-bold text-gray-900 mt-1">{title}</h1>
                    </div>

                    <p className="text-gray-600">{description}</p>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">LKR {price?.toLocaleString()}</h2>
                        <p className={`text-sm mt-1 font-medium ${stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {stockStatus}
                        </p>
                        <div className="flex items-center mt-2">
                            {artisan?.profilePhoto ? (
                                <img
                                    src={artisan.profilePhoto}
                                    alt={artisan.name}
                                    className="w-8 h-8 rounded-full bg-gray-200 mr-2 object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold mr-2 text-xs">
                                    {artisan?.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                            )}
                            <p className="text-sm text-gray-600">Artisan: <span className="font-semibold">{artisan?.name}</span></p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Wishlist */}
                        <button title="Add to Wishlist" className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>

                        {/* Quantity */}
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                            >-</button>
                            <span className="px-4 py-2 font-medium">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(stock || 99, quantity + 1))}
                                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                            >+</button>
                        </div>

                        {/* Add to Cart */}
                        <button className="flex-1 bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors">
                            Add to Cart
                        </button>

                        {/* Report Product */}
                        <button title="Report Product" className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Reviews Section Placeholder */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Customer Reviews</h3>
                        <div className="flex items-center mb-4">
                            <div className="flex text-yellow-400 mr-2">★★★★★</div>
                            <span className="text-gray-600 text-sm">4.5 (23 Reviews)</span>
                        </div>
                        {/* Mock Review */}
                        <div className="border-b border-gray-100 pb-4 mb-4">
                            <div className="flex items-center mb-1">
                                <span className="font-semibold text-sm mr-2">Anusha S.</span>
                                <span className="text-yellow-400 text-xs">★★★★★</span>
                            </div>
                            <p className="text-sm text-gray-600">Absolutely beautiful basket! The craftsmanship is excellent...</p>
                        </div>

                        {/* Write Review */}
                        <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="text-sm font-semibold mb-2">Write a Review</h4>
                            <textarea
                                className="w-full text-sm border border-gray-300 rounded p-2 mb-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                placeholder="Share your thoughts..."
                                rows={3}
                            ></textarea>
                            <div className="flex justify-between items-center">
                                <div className="flex text-gray-300 text-sm">★★★★★</div>
                                <button className="bg-green-500 text-white text-xs px-3 py-2 rounded hover:bg-green-600">Submit Review</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* "You may also like" placeholder */}
            <div className="mt-12">
                <h3 className="text-xl font-bold mb-4">You may also like</h3>
                {/* Product List Component would go here */}
            </div>
        </div>
    );
};

export default ProductDetails;
