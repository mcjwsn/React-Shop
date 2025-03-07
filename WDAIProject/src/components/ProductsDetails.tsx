import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import './ProductDetails.css'; 

const ProductDetails = ({ product, onAddToCart, userId }) => {
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        if (!product || !product.id) {
            console.error('Produkt nie jest dostępny.');
            return;
        }

        axios.get(`http://localhost:5000/api/products/${product.id}/reviews`)
            .then(response => {
                const reviewsData = Array.isArray(response.data) ? response.data : [];
                setReviews(reviewsData);
                calculateAverageRating(reviewsData);
            })
            .catch(error => {
                console.error('Błąd pobierania opinii:', error);
                setReviews([]);
            });
    }, [product, userId]);

    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) {
            setAverageRating(0);
            return;
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const average = totalRating / reviews.length;
        setAverageRating(average);
    };

    const renderStars = (rating) => {
        const roundedRating = Math.round(rating);
        return '★'.repeat(roundedRating) + '☆'.repeat(5 - roundedRating);
    };

    const handleAddReview = () => {
        if (!userId) {
            alert('Zaloguj się, aby dodać opinię.');
            return;
        }

        if (!newReview.comment.trim()) {
            alert('Komentarz nie może być pusty.');
            return;
        }

        const createdAt = new Date().toISOString();

        axios.post(`http://localhost:5000/api/products/${product.id}/reviews`, {
            userId,
            rating: newReview.rating,
            comment: newReview.comment,
            createdAt,
        })
            .then(response => {
                if (response.data && typeof response.data === 'object') {
                    const updatedReviews = [...reviews, response.data];
                    setReviews(updatedReviews);
                    calculateAverageRating(updatedReviews);
                } else {
                    console.error('Otrzymane dane nie są poprawną recenzją:', response.data);
                }
                setNewReview({ rating: 5, comment: '' });
            })
            .catch(error => {
                console.error('Błąd dodawania opinii:', error);
                if (error.response) {
                    console.error('Odpowiedź z serwera:', error.response.data);
                }
            });
    };

    if (!product) {
        return <div>Produkt nie jest dostępny.</div>;
    }

    return (
        <div className="product-details-container">
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>Cena: {product.price} zł</p>
            <p>Dostępna ilość: {product.available_quantity}</p>
            <p>Średnia ocena: {renderStars(averageRating)}</p>
            <button onClick={() => onAddToCart(product, quantity)}>Dodaj do koszyka</button>

            <h2>Opinie</h2>
            <ul className="reviews-list">
                {Array.isArray(reviews) && reviews
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map(review => (
                        <li key={review.id}>
                            <strong>Ocena:</strong>
                            <div className="rating-bar">
                                <div className="green" style={{ width: `${(review.rating / 5) * 100}%` }}></div>
                                <div className="red" style={{ width: `${100 - (review.rating / 5) * 100}%` }}></div>
                            </div>
                            <p>{review.comment}</p>
                            <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                        </li>
                    ))}
            </ul>

            <div className="add-review-section">
                <h3>Dodaj opinię</h3>
                <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                >
                    <option value="5">5</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                </select>
                <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                />
                <button onClick={handleAddReview}>Dodaj opinię</button>
            </div>
        </div>
    );
};

export default ProductDetails;