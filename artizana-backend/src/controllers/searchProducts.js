const Product = require('../models/Product');

/**
 * Search products with query parameters
 * @route GET /api/products/search
 * @query q - Keyword search for title/description
 * @query category - Filter by category
 * @query minPrice - Minimum price filter
 * @query maxPrice - Maximum price filter
 */
exports.searchProducts = async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice } = req.query;

        // Build query object
        const query = {};

        // Keyword search (case-insensitive regex)
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ];
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Execute query
        const products = await Product.find(query)
            .populate('artisan', 'name profilePhoto location bio') // Include artisan profile
            .sort({ createdAt: -1 }); // Newest first

        // Transform results to include Feedback placeholder
        const results = products.map(product => {
            const productObj = product.toObject();

            // PLACEHOLDER: Feedback system to be implemented later
            // Current implementation returns default values
            productObj.feedback = {
                averageRating: null,
                reviewCount: 0,
                reviews: [] // Placeholder for future review list
            };

            return productObj;
        });

        res.status(200).json(results);
    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({ message: 'Server error during search' });
    }
};
