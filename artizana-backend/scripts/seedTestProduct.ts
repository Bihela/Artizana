import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User';
import Product from '../src/models/Product';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seed = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Find or Create User
        const email = 'bihela@gmail.com';
        let user = await User.findOne({ email });

        if (!user) {
            console.log('User not found. Creating user Bihela...');
            user = await User.create({
                name: 'Bihela',
                email: email,
                password: 'password123', // Default password for testing
                role: 'Artisan',
                phone: '0771234567'
            });
            console.log('User created:', user._id);
        } else {
            console.log('User found:', user._id);
            // Ensure role is Artisan for adding products
            if (user.role !== 'Artisan') {
                user.role = 'Artisan';
                await user.save();
                console.log('Updated user role to Artisan');
            }
        }

        // 2. Create or Update Product
        const productTitle = 'Fake product/1';
        let product = await Product.findOne({ title: productTitle, artisan: user._id });

        const artisanImages = [
            'https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Pottery/Basket
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'  // Wall decor
        ];

        if (product) {
            console.log('Product already exists. Updating images...');
            product.images = artisanImages;
            await product.save();
            console.log('Product images updated. ID:', product._id);
        } else {
            console.log('Creating Product...');
            product = await Product.create({
                title: productTitle,
                description: 'This is a fake product for testing purposes. It features high quality fake craftsmanship.',
                price: 1500,
                category: 'Test',
                quantity: 50,
                images: artisanImages,
                tags: ['fake', 'test'],
                artisan: user._id
            });
            console.log('Product created successfully!');
            console.log('------------------------------------------------');
            console.log('PRODUCT ID:', product._id);
            console.log('------------------------------------------------');
        }

    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
};

seed();
