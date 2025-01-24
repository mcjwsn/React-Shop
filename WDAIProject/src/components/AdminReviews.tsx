import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminReviews.css'; 

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Brak tokenu JWT');
                }

                const response = await axios.get('http://localhost:5000/api/reviews', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log('Odpowiedź z backendu:', response.data);

                if (response.data && Array.isArray(response.data)) {
                    setReviews(response.data);
                } else {
                    throw new Error('Otrzymane dane nie są tablicą opinii');
                }
            } catch (error) {
                console.error('Błąd pobierania opinii:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const handleDeleteReview = async (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć tę opinię?')) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Brak tokenu JWT');
                }

                const response = await axios.delete(`http://localhost:5000/api/products/reviews/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Odpowiedź z backendu:', response.data);

                setReviews((prevReviews) => prevReviews.filter(review => review.id !== id));
                alert('Opinia usunięta');
            } catch (error) {
                console.error('Błąd:', error.response?.data || error.message);
                alert('Nie udało się usunąć opinii');
            }
        }
    };

    if (loading) {
        return <div className="loading-message">Ładowanie opinii...</div>;
    }

    if (error) {
        return <div className="error-message">Błąd: {error}</div>;
    }

    if (!reviews || reviews.length === 0) {
        return <div className="no-reviews-message">Brak opinii do wyświetlenia.</div>;
    }

    return (
        <div className="admin-reviews-container">
            <h2>Zarządzanie opiniami</h2>
            <ul>
                {reviews.map(review => (
                    <li key={review.id}>
                        <p><strong>Produkt ID:</strong> {review.productId}</p>
                        <p><strong>Użytkownik ID:</strong> {review.userId}</p>
                        <p><strong>Ocena:</strong> {review.rating}</p>
                        <p><strong>Komentarz:</strong> {review.comment}</p>
                        <button onClick={() => handleDeleteReview(review.id)}>Usuń opinię</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminReviews;