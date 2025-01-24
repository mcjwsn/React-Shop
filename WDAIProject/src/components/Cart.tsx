import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cart.css';

const Cart = ({ userId, cart, onRemoveFromCart, onClearCart }) => {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const validItems = cart.filter(item => 
            item.price !== undefined &&
            !isNaN(parseFloat(item.price))
        );
    
        const totalAmount = validItems.reduce((sum, item) => 
            sum + parseFloat(item.price), 0);
        console.log('Total Amount:', totalAmount);
    
        setTotal(totalAmount);
    }, [cart]);

    const handleCheckout = () => {
    
        const orderData = {
            userId: userId,
            totalAmount: total > 100 ? (total * 0.9).toFixed(2) : total.toFixed(2)
        };

        if (total == 0) {
            alert('Koszyk jest pusty. Dodaj produkty przed złożeniem zamówienia.');
            return;
        }
        

    
        axios.post('http://localhost:5000/api/orders', orderData)
            .then(response => {
                alert('Zamówienie złożone!');
                onClearCart(); 
            })
            .catch(error => {
                console.error('Błąd składania zamówienia:', error);
                alert('Wystąpił błąd podczas składania zamówienia.');
            });
    };

    return (
        <div className="cart-container">
            <h1>Koszyk użytkownika {userId}</h1>
            {total > 100 && (
                <p className="discount-message">Rabat 10% przy zakupach powyżej 100 zł</p>
            )}
            <p>Twój koszyk</p>
            <ul className="cart-items">
                {cart.map((item, index) => (
                    <li key={index} className="cart-item">
                        <span>
                            {item.name} - {item.price} zł x 1
                        </span>
                        <button onClick={() => onRemoveFromCart(item.id)}>Usuń</button>
                    </li>
                ))}
            </ul>
            <p className="cart-total">
                Suma: {total > 100 ? (total * 0.9).toFixed(2) : total.toFixed(2)} zł
            </p>
            <button 
                className="checkout-button" 
                onClick={handleCheckout}
                disabled={total === 0}
            >
                Złóż zamówienie
            </button>
        </div>
    );
};

export default Cart;