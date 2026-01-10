import React from 'react';

interface Product {
    _id: string;
    title: string;
    price: number;
    images?: string[];
    artisan?: {
        name: string;
    };
}

interface ProductCardProps {
    product: Product;
    onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    const { title, price, images, artisan } = product;

    // State to handle image source, defaulting to the first image or a clean placeholder
    const [imgSrc, setImgSrc] = React.useState(images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80');

    // Update state if prop changes (e.g. reused component)
    React.useEffect(() => {
        setImgSrc(images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80');
    }, [images]);

    const handleImageError = () => {
        // Fallback to a nice "craft" themed placeholder if the actual image fails
        setImgSrc('https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80');
    };

    // Placeholder stub for Rating (since backend doesn't support it yet)
    const ratingStub = 4.8;
    const reviewCountStub = 124;

    return (
        <div
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer overflow-hidden border border-gray-100"
            onClick={onClick}
        >
            {/* Image Container */}
            <div className="relative h-64 w-full bg-gray-100">
                <img
                    src={imgSrc}
                    alt={title}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                />
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                    {/* Heart Icon SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{title}</h3>

                {/* Artisan Info */}
                <p className="text-sm text-gray-500 mb-2">By {artisan?.name || 'Artisan'}</p>

                {/* Rating Stub */}
                <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400 text-sm">
                        {'★'.repeat(Math.floor(ratingStub))}
                        {'☆'.repeat(5 - Math.floor(ratingStub))}
                    </div>
                    <span className="text-xs text-gray-400 ml-1">({reviewCountStub})</span>
                </div>

                {/* Footer: Price + Add Button */}
                <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-gray-900">
                        LKR {price?.toLocaleString()}
                    </span>

                    <button className="p-2 bg-green-50 rounded-full hover:bg-green-100 text-green-700">
                        {/* Cart Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
