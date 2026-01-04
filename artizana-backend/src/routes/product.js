const express = require('express');
const router = express.Router();
const productController = require('../controllers/addProduct');
const searchController = require('../controllers/searchProducts');
const auth = require('../middleware/auth');

// POST /api/products/add
// Using auth middleware to protect the route
router.post('/add', auth, productController.addProduct);

// GET /api/products/search
// Public route
router.get('/search', searchController.searchProducts);

module.exports = router;
