const db = require('../db');

const getReviewsAll = (req, res) => {
    console.log('Fetching all reviews');

    db.all('SELECT * FROM Reviews', (err, reviews) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: err.message });
        }

        console.log('Found reviews:', reviews);
        res.status(200).json(reviews || []);
    });
};

module.exports = { getReviewsAll };