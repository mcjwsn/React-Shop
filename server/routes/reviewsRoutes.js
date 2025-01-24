const express = require('express');
const { getReviewsAll } = require('../controllers/reviewsController');

const router = express.Router();
router.get('/', getReviewsAll);

module.exports = router;