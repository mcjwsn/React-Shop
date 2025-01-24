const express = require('express');
const db = require('../db');
const { authenticate, isAdmin } = require('../middleware/middleware');
const { getUsers, getUserById, addUser, updateUser, deleteUser} = require('../controllers/userController');
const { getReviews, addReview } = require('../controllers/productController');

const router = express.Router();

router.get('/', authenticate, isAdmin, getUsers); 
router.get('/:id', authenticate, getUserById); 
router.post('/users', (req, res) => {
    const { username, password } = req.body;
    const trimmedUsername = username.trim();


    const query = `SELECT * FROM users WHERE LOWER(username) = LOWER(?)`;
    const db = new sqlite3.Database(dbPath);

    db.get(query, [trimmedUsername], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (row) {
            return res.status(400).json({ error: 'Użytkownik już istnieje' });
        }

        const insertQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;
        db.run(insertQuery, [trimmedUsername, password], function (err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.status(200).json({ message: 'Zarejestrowano pomyślnie' });
        });
    });

    db.close();
}); 
router.put('/:id', authenticate, isAdmin, updateUser); 
router.delete('/:id', authenticate, isAdmin, deleteUser); 
router.post('/', addUser)

router.get('/:userId/isAdmin', (req, res) => {
    const userId = req.params.userId;

   
    const sql = `SELECT role FROM users WHERE id = ?`;
    db.get(sql, [userId], (err, row) => {
        if (err) {
            console.error('Błąd zapytania SQL:', err);
            return res.status(500).json({ message: 'Wewnętrzny błąd serwera' });
        }

        if (!row) {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }

        const isAdmin = row.role === 'admin'; 
        res.json({ isAdmin });
    });
});

module.exports = router;