const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Błąd połączenia z bazą danych:', err.message);
    } else {
        console.log('Połączono z bazą danych SQLite.');
        initializeDatabase();
    }
});


const initializeDatabase = () => {
    // Tabela Products
    db.run(`
        CREATE TABLE IF NOT EXISTS Products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            category TEXT,
            available_quantity INTEGER,
            features TEXT
        )
    `, (err) => {
        if (err) {
            console.error('Błąd tworzenia tabeli Products:', err.message);
        } else {
            console.log('Tabela Products gotowa.');
        }
    });

    // Tabela Users
    db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user'
        )
    `, (err) => {
        if (err) {
            console.error('Błąd tworzenia tabeli Users:', err.message);
        } else {
            console.log('Tabela Users gotowa.');
        }
    });

    // Tabela Reviews (opinie o produktach)
    db.run(`
        CREATE TABLE IF NOT EXISTS Reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        createdAt TEXT,
        FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
        )
    `, (err) => {
        if (err) {
            console.error('Błąd tworzenia tabeli Reviews:', err.message);
        } else {
            console.log('Tabela Reviews gotowa.');
        }
    });

    // Tabela Cart (koszyk)
    db.run(`
        CREATE TABLE IF NOT EXISTS Cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            productId INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            FOREIGN KEY (userId) REFERENCES Users(id),
            FOREIGN KEY (productId) REFERENCES Products(id)
        )
    `, (err) => {
        if (err) {
            console.error('Błąd tworzenia tabeli Cart:', err.message);
        } else {
            console.log('Tabela Cart gotowa.');
        }
    });

    // Tabela Orders (zamówienia)
    db.run(`
        CREATE TABLE IF NOT EXISTS Orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            totalAmount REAL NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES Users(id)
        )
    `, (err) => {
        if (err) {
            console.error('Błąd tworzenia tabeli Orders:', err.message);
        } else {
            console.log('Tabela Orders gotowa.');
        }
    });

    // Tabela OrderItems (produkty w zamówieniu)
    db.run(`
        CREATE TABLE IF NOT EXISTS OrderItems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orderId INTEGER NOT NULL,
            productId INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (orderId) REFERENCES Orders(id),
            FOREIGN KEY (productId) REFERENCES Products(id)
        )
    `, (err) => {
        if (err) {
            console.error('Błąd tworzenia tabeli OrderItems:', err.message);
        } else {
            console.log('Tabela OrderItems gotowa.');
        }
    });
};

module.exports = db;