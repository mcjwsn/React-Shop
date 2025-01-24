const db = require('../db');

const getProducts = (req, res) => {
    const { search, category } = req.query;
    let query = 'SELECT * FROM Products';
    const params = [];

    if (search) {
        query += ' WHERE name LIKE ?';
        params.push(`%${search}%`);
    }

    if (category) {
        query += search ? ' AND category = ?' : ' WHERE category = ?';
        params.push(category);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
};

const getProductById = (req, res) => {
    const productId = req.params.id;
    db.get('SELECT * FROM Products WHERE id = ?', [productId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Produkt nie znaleziony' });
            return;
        }
        res.json(row);
    });
};

const addProduct = (req, res) => {
    const { name, description, price } = req.body;
    db.run(
        'INSERT INTO Products (name, description, price) VALUES (?, ?, ?)',
        [name, description, price],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
};

const updateProduct = (req, res) => {
    const productId = req.params.id;
    const { name, description, price } = req.body;
    db.run(
        'UPDATE Products SET name = ?, description = ?, price = ? WHERE id = ?',
        [name, description, price, productId],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Produkt zaktualizowany' });
        }
    );
};

const deleteProduct = (req, res) => {
    const productId = req.params.id;
    db.run('DELETE FROM Products WHERE id = ?', [productId], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Produkt usunięty' });
    });
};


const getReviews = (req, res) => {
    const productId = req.params.id;
    console.log('Fetching reviews for productId:', productId);

    db.all('SELECT * FROM Reviews WHERE productId = ?', [productId], (err, reviews) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: err.message });
        }

        console.log('Found reviews:', reviews);
        res.status(200).json(reviews || []);
    });
};

const getReviewsAll = (req, res) => {
    console.log('Fetching reviews for productId:', productId);

    db.all('SELECT * FROM Reviews', (err, reviews) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: err.message });
        }

        console.log('Found reviews:', reviews);

        res.status(200).json(reviews || []);
    });
};

const getOrders = (req, res) => {
    db.all('SELECT * FROM orders', (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Błąd pobierania zamówień', error: err.message });
        } else {
            res.status(200).json(rows);
        }
    });
};

const getOrdersbyId = (req, res) => {
    const userId = req.params.userId; 

  
    if (!userId) {
        return res.status(400).json({ message: 'Brak userId w żądaniu' });
    }

 
    db.all('SELECT * FROM orders WHERE userId = ?', [userId], (err, rows) => {
        if (err) {
 
            console.error('Błąd bazy danych:', err.message);
            return res.status(500).json({ 
                message: 'Błąd pobierania zamówień', 
                error: err.message 
            });
        }

      
        if (rows.length === 0) {
            return res.status(404).json({ 
                message: 'Nie znaleziono zamówień dla tego użytkownika' 
            });
        }

       
        res.status(200).json(rows);
    });
};


const addOrder = (req, res) => {
    const { userId, totalAmount } = req.body;

  
    if (!userId || !totalAmount) {
        return res.status(400).json({ message: 'Nieprawidłowe dane zamówienia' });
    }

 
    if (isNaN(totalAmount)) {
        return res.status(400).json({ message: 'TotalAmount musi być liczbą' });
    }

    
    const status = 'pending';
    const createdAt = new Date().toISOString().replace('T', ' ').replace('Z', ''); // Format daty: "YYYY-MM-DD HH:MM:SS"


    const query = `
        INSERT INTO orders (userId, totalAmount, status, createdAt)
        VALUES (?, ?, ?, ?)
    `;


    db.run(
        query,
        [userId, totalAmount, status, createdAt], 
        function (err) {
            if (err) {
                console.error('Błąd dodawania zamówienia:', err.message);
                return res.status(500).json({ 
                    message: 'Błąd dodawania zamówienia', 
                    error: err.message 
                });
            }

   
            res.status(201).json({ 
                message: 'Zamówienie dodane', 
                orderId: this.lastID 
            });
        }
    );
};

const addReview = (req, res) => {
    const productId = req.params.id;
    console.log('Próba dodania opinii dla produktu o ID:', productId); 

    const { userId, rating, comment, createdAt } = req.body;
    console.log('Otrzymane dane:', { userId, rating, comment, createdAt }); 


    db.get('SELECT * FROM Products WHERE id = ?', [productId], (err, product) => {
        if (err) {
            console.error('Błąd weryfikacji produktu:', err);
            return res.status(500).json({ error: err.message });
        }

        if (!product) {
            console.error('Produkt nie istnieje:', productId); 
            return res.status(404).json({ error: 'Produkt nie istnieje' });
        }

        // Dodaj opinię
        const insertQuery = 'INSERT INTO Reviews (productId, userId, rating, comment, createdAt) VALUES (?, ?, ?, ?, ?)';
        const values = [productId, userId, rating, comment, createdAt || new Date().toISOString()];

        db.run(insertQuery, values, function (err) {
            if (err) {
                console.error('Błąd dodawania recenzji:', err);
                return res.status(500).json({ error: 'Nie udało się dodać recenzji', details: err.message });
            }

            console.log(`Dodano recenzję dla produktu ${productId}`);
            res.status(201).json({
                id: this.lastID,
                productId,
                userId,
                rating,
                comment,
                createdAt: values[4]
            });
        });
    });
};
const deleteReview = (req, res) => {
    const reviewId = req.params.reviewId;
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Brak uprawnień do usunięcia opinii' });
    }

    db.run('DELETE FROM Reviews WHERE id = ?', [reviewId], function (err) {
        if (err) {
            console.error('Błąd usuwania opinii:', err);
            return res.status(500).json({ error: 'Nie udało się usunąć opinii', details: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Opinia nie istnieje' });
        }

        console.log(`Usunięto opinię o ID: ${reviewId}`);
        res.status(200).json({ message: 'Opinia usunięta' });
    });
};
module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct, addReview, getReviews,getOrders, addOrder,getOrdersbyId, deleteReview, getReviewsAll };