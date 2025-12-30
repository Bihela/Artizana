const express = require('express');
const router = express.Router();
const productController = require('../controllers/addProduct');
const auth = require('../middleware/auth');

// POST /api/products/add
// Using auth middleware to protect the route
router.post('/add', auth, productController.addProduct);


module.exports = router;
