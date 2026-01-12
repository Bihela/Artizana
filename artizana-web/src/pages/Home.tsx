import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import LanguageSelectorModal from '../components/LanguageSelectorModal';
import { useLanguage } from '../context/LanguageContext';

// Placeholder for logic if needed
const API_URL = 'http://localhost:5001/api/products/search';

const Home: React.FC = () => {
    const { language, selectLanguage, isLoading } = useLanguage();
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(API_URL);
                // Limit to 4-8 products for the "Top Picks" section as per wireframe logic
                // Verify response structure - assuming array based on previous check
                const data = Array.isArray(response.data) ? response.data : [];
                setProducts(data.slice(0, 8));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Placeholder navigation handlers
    const handleViewAll = () => {
        console.log('Navigate to full search page (KAN-24)');
    };

    const handleProductClick = (productId: string) => {
        console.log(`Navigate to product details for ID: ${productId} (KAN-17)`);
        // In a real app, use navigate(`/products/${productId}`)
        alert('Product Details Coming Soon (KAN-17)');
    };

    useEffect(() => {
        if (!isLoading && !language) {
            setShowLanguageModal(true);
        }
    }, [isLoading, language]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Language Modal */}
            {showLanguageModal && (
                <LanguageSelectorModal
                    onSelect={(lang: string) => {
                        selectLanguage(lang);
                        setShowLanguageModal(false);
                    }}
                />
            )}

            {/* Hero Banner */}
            <HeroSection />

            <main className="w-full px-4 sm:px-6 lg:px-8 mt-12">
                {/* Top Picks Header */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Top Picks for You</h2>
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>

                    <button
                        onClick={handleViewAll}
                        className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center transition-colors"
                    >
                        View All
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && products.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <p className="text-gray-500 text-lg">No products found at the moment.</p>
                        <p className="text-gray-400 text-sm">Check back soon for new arrivals!</p>
                    </div>
                )}

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onClick={() => handleProductClick(product._id)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Home;
