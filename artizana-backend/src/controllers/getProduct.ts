import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';

/**
 * Get a single product by ID
 * @route GET /api/products/:id
 */
export const getProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Validate ID format to prevent CastError
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        const product = await Product.findById(id).populate('artisan', 'name profilePhoto location bio');

        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        // Transform to object to attach placeholder feedback
        const productObj = product.toObject ? product.toObject() : product;

        // PLACEHOLDER: Feedback system
        // This ensures the frontend receives the expected structure even without a full Feedback model
        (productObj as any).feedback = {
            averageRating: null, // or mock value like 4.5
            reviewCount: 0,
            reviews: []
        };

        res.status(200).json(productObj);
    } catch (error) {
        console.error('Get Product Error:', error);
        res.status(500).json({ message: 'Server error retrieving product' });
    }
};
