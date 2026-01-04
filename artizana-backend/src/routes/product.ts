import express from 'express';
import { addProduct } from '../controllers/addProduct';
import auth from '../middleware/auth';

const router = express.Router();

import { searchProducts } from '../controllers/searchProducts';

// POST /api/products/add
// Using auth middleware to protect the route
router.post('/add', auth, addProduct);

// GET /api/products/search
// Public route
router.get('/search', searchProducts);

export default router;
