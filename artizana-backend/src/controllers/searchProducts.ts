import { Request, Response } from 'express';
import Product from '../models/Product';
// Assuming User model is imported for populate type checking, though distinct query params don't strictly require it if using 'any' or proper interface.
// For now, we'll keep it simple.

/**
 * Search products with query parameters
 * @route GET /api/products/search
 * @query q - Keyword search for title/description
 * @query category - Filter by category
 * @query minPrice - Minimum price filter
 * @query maxPrice - Maximum price filter
 */
export const searchProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q, category, minPrice, maxPrice } = req.query;

        // Build query object
        const query: any = {};

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
        const results = products.map((product: any) => {
            const productObj = product.toObject ? product.toObject() : product;

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
