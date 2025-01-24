const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');

const login = (req, res) => {
    const { username, password } = req.body;

  
    db.get('SELECT * FROM Users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(401).json({ message: 'Błędne dane logowania' });
        }

        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Błędne dane logowania' });
        }

        
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            'tajny_klucz', 
            { expiresIn: '1h' }
        );

        // Zwróć token i userId
        console.log('Znaleziony użytkownik:', user);
        console.log('Odpowiedź z backendu:', { token, userId: user.id });
        res.json({ token, userId: user.id });
    });
};

module.exports = { login };