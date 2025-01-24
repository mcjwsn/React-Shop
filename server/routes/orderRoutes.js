const express = require('express');
const { isAdmin, authenticate } = require('../middleware/middleware');
const { getOrders, addOrder, getOrdersbyId } = require('../controllers/productController'); 

const router = express.Router();

router.get('/orders',  getOrders);

router.get('/orders/:userId',  getOrdersbyId);

router.post('/orders', addOrder);

module.exports = router;