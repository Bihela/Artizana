import { Request, Response } from 'express';
import Product from '../models/Product';
import { IUser } from '../models/User';

export const updateProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const allowedUpdates = ['title', 'description', 'price', 'category', 'quantity', 'images', 'tags'];
        const updateKeys = Object.keys(updates);

        // Filter out disallowed updates
        const isValidOperation = updateKeys.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates!' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        const user = req.user as IUser;

        // Find product first to check ownership
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check ownership
        if (product.artisan.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Access denied. You can only update your own products.' });
        }

        // Apply updates
        updateKeys.forEach((update) => {
            (product as any)[update] = updates[update];
        });

        await product.save();

        res.status(200).json({
            message: 'Product updated successfully',
            product
        });

    } catch (error: any) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error while updating product', error: error.message });
    }
};
