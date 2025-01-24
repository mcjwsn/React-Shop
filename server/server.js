const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes'); 
const reviewsRoutes = require('./routes/reviewsRoutes');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', orderRoutes);
app.use('/api/reviews', reviewsRoutes);


app.listen(port, () => {
    console.log(`Serwer działa na http://localhost:${port}`);

});

