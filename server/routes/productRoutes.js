const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductReviews, createReview } = require('../controllers/productController');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/reviews/:id', getProductReviews);
router.post('/reviews/:id', createReview);
// Admin routes (in a real app, protect these routes!)
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
