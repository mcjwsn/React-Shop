const db = require('../db');
const bcrypt = require('bcrypt');


const getUsers = (req, res) => {
    db.all('SELECT id, username FROM Users', [], (err, users) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(users);
    });
};


const getUserById = (req, res) => {
    const userId = req.params.id;
    db.get('SELECT * FROM Users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Użytkownik nie znaleziony' });
            return;
        }
        res.json(row);
    });
};



const addUser = async (req, res) => {
    console.log('Raw request body:', req.body);
    const { username, password, role = 'user' } = req.body;


    if (!username || !password) {
        console.error('Missing username or password');
        return res.status(400).json({ error: 'Nazwa użytkownika i hasło są wymagane' });
    }

    try {
    
        const existingUser = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM Users WHERE username = ?', [username], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        if (existingUser) {
            console.log('User already exists:', username);
            return res.status(400).json({ error: 'Użytkownik już istnieje' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            'INSERT INTO Users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role],
            function(err) {
                if (err) {
                    console.error('Database insertion error:', err);
                    return res.status(500).json({ error: err.message });
                }
                console.log('User created successfully:', this.lastID);
                return res.status(201).json({ id: this.lastID });
            }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Błąd serwera' });
    }}


const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, password, role } = req.body;

    if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Brak uprawnień do edycji tego użytkownika' });
    }


    let hashedPassword;
    if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
    }


    const updates = [];
    const params = [];
    if (username) {
        updates.push('username = ?');
        params.push(username);
    }
    if (hashedPassword) {
        updates.push('password = ?');
        params.push(hashedPassword);
    }
    if (role && req.user.role === 'admin') { 
        updates.push('role = ?');
        params.push(role);
    }

    if (updates.length === 0) {
        return res.status(400).json({ message: 'Brak danych do aktualizacji' });
    }

    params.push(userId);

    const query = `UPDATE Users SET ${updates.join(', ')} WHERE id = ?`;

    db.run(query, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Użytkownik zaktualizowany' });
    });
};


const deleteUser = (req, res) => {
    const userId = req.params.id;
    db.run('DELETE FROM Users WHERE id = ?', [userId], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Użytkownik usunięty' });
    });
};


module.exports = { getUsers, getUserById, addUser, updateUser, deleteUser };