const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Brak tokenu autoryzacyjnego' });
    }

    try {
  
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tajny_klucz'); 
        req.user = decoded;
        next(); 
    } catch (err) {
  
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token wygasł' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Nieprawidłowy token' });
        } else {
            return res.status(401).json({ message: 'Błąd autoryzacji' });
        }
    }
};


const isAdmin = (req, res, next) => {
   
    if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'Brak uprawnień' });
    }


    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Brak uprawnień administratora' });
    }

    next(); 
};

module.exports = { authenticate, isAdmin };