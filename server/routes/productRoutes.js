const express = require('express');
const { authenticate, isAdmin } = require('../middleware/middleware');
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct,addReview,getReviews,getOrders,getOrdersbyId, addOrder,deleteReview,getReviewsAll } = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticate,isAdmin, addProduct); 
router.put('/:id', authenticate,isAdmin, updateProduct); 
router.delete('/:id', authenticate, isAdmin, deleteProduct);

router.post('/:id/reviews', addReview); 
router.get('/:id/reviews', (req, res) => {
    console.log('Review Request - Full URL:', req.originalUrl);
    console.log('Product ID:', req.params.id);
    getReviews(req, res);
});
router.delete('/reviews/:reviewId', authenticate, deleteReview);

module.exports = router;