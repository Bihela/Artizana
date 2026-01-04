import { Request, Response } from 'express';
import Product from '../models/Product';
import { IUser } from '../models/User';

export const addProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, description, price, category, quantity, images, tags } = req.body;

        // Check if user is authenticated and is an Artisan (assuming middleware adds req.user)
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        const user = req.user as IUser;

        // Optional: Check role
        if (user.role !== 'Artisan') {
            return res.status(403).json({ message: 'Access denied. Only Artisans can add products.' });
        }

        const newProduct = new Product({
            title,
            description,
            price,
            category,
            quantity,
            images,
            tags,
            artisan: user._id
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: 'Product added successfully',
            product: savedProduct
        });
    } catch (error: any) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Server error while adding product', error: error.message });
    }
};
