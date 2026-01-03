import express from 'express';
import { addProduct } from '../controllers/addProduct';
import auth from '../middleware/auth';

const router = express.Router();

// POST /api/products/add
// Using auth middleware to protect the route
router.post('/add', auth, addProduct);


export default router;
