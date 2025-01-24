import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import ProductList from './components/ProductsList';
import ProductDetails from './components/ProductsDetails';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';7
import History from './components/History';
import AdminReviews from './components/AdminReviews';
import ErrorBoundary from './components/ErrorBoundary';
import axios from 'axios';

function FakeApp() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [cart, setCart] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                try {
                    const parsedCart = JSON.parse(savedCart);
                    if (Array.isArray(parsedCart)) {
                        return parsedCart;
                    }
                } catch (error) {
                    console.error('Błąd parsowania koszyka:', error);
                    localStorage.removeItem('cart');
                }
            }
        }
        return [];
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const savedCart = localStorage.getItem('cart');

        if (token && userId) {
            setIsLoggedIn(true);
            setToken(token);
            setUserId(userId);

            const checkAdminStatus = async () => {
                try {
                    const adminCheckResponse = await axios.get(`http://localhost:5000/api/users/${userId}/isAdmin`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const isAdmin = adminCheckResponse.data.isAdmin;
                    setIsAdmin(isAdmin);
                    localStorage.setItem('isAdmin', isAdmin);
                } catch (error) {
                    console.error('Błąd sprawdzania uprawnień administratora:', error);
                    setIsAdmin(false);
                }
            };

            checkAdminStatus();
        }

        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                if (Array.isArray(parsedCart)) {
                    setCart(parsedCart);
                }
            } catch (error) {
                console.error('Błąd parsowania koszyka:', error);
            }
        }
    }, []);

    const handleLogin = async (token, userId) => {
        setIsLoggedIn(true);
        setToken(token);
        setUserId(userId);

        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);

        try {
            const adminCheckResponse = await axios.get(`http://localhost:5000/api/users/${userId}/isAdmin`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const isAdmin = adminCheckResponse.data.isAdmin;
            setIsAdmin(isAdmin);
            localStorage.setItem('isAdmin', isAdmin);
        } catch (error) {
            console.error('Błąd sprawdzania uprawnień administratora:', error);
            setIsAdmin(false);
        }
    };

    const handleRegister = () => {
        console.log('Przekierowanie do logowania...');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setToken(null);
        setUserId(null);
        setIsAdmin(false);
        setCart([]);

        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('cart');
    };

    const addToCart = (product) => {
        setCart((prevCart) => [...prevCart, product]);
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    return (
        <BrowserRouter>
            <nav>
                <Link to="/">Strona główna</Link>
                <Link to="/products" style={{ pointerEvents: isLoggedIn ? 'auto' : 'none' }}>
                    Produkty
                </Link>
                <Link to="/cart" style={{ pointerEvents: isLoggedIn ? 'auto' : 'none' }}>
                    Koszyk ({cart.length})
                </Link>
                <Link to="/history" style={{ pointerEvents: isLoggedIn ? 'auto' : 'none' }}>
                    Historia zamówień
                </Link>
                {isLoggedIn && isAdmin && (
                    <Link to="/admin-reviews">Zarządzaj opiniami</Link>
                )}
                {isLoggedIn ? (
                    <button onClick={handleLogout}>Wyloguj</button>
                ) : (
                    <>
                        <Link to="/login">Logowanie</Link>
                        <Link to="/register">Rejestracja</Link>
                    </>
                )}
            </nav>

            <Routes>
                <Route path="/" element={
                    <div>
                        <h1>Witaj na stronie głównej!</h1>
                        {!isLoggedIn && <p>Zaloguj się, aby przejść do produktów, koszyka lub historii zamówień.</p>}
                    </div>
                } />
                <Route path="/products" element={
                    isLoggedIn ? (
                        <ErrorBoundary>
                            <ProductList onProductSelect={(product) => navigate(`/details/${product.id}`)} />
                        </ErrorBoundary>
                    ) : (
                        <div>Musisz się zalogować, aby przejść do produktów.</div>
                    )
                } />
                <Route path="/details/:id" element={
                    isLoggedIn ? (
                        <ErrorBoundary>
                            <ProductDetails onAddToCart={addToCart} userId={userId} />
                        </ErrorBoundary>
                    ) : (
                        <div>Musisz się zalogować, aby zobaczyć szczegóły produktu.</div>
                    )
                } />
                <Route path="/cart" element={
                    isLoggedIn ? (
                        <ErrorBoundary>
                            <Cart userId={userId} cart={cart} onRemoveFromCart={removeFromCart} onClearCart={clearCart} />
                        </ErrorBoundary>
                    ) : (
                        <div>Musisz się zalogować, aby przejść do koszyka.</div>
                    )
                } />
                <Route path="/history" element={
                    isLoggedIn ? (
                        <ErrorBoundary>
                            <History userId={userId} isAdmin={isAdmin} />
                        </ErrorBoundary>
                    ) : (
                        <div>Musisz się zalogować, aby przejść do historii zamówień.</div>
                    )
                } />
                <Route path="/admin-reviews" element={
                    isLoggedIn && isAdmin ? (
                        <ErrorBoundary>
                            <AdminReviews />
                        </ErrorBoundary>
                    ) : (
                        <div>Brak uprawnień do zarządzania opiniami.</div>
                    )
                } />
                <Route path="/login" element={
                    !isLoggedIn ? (
                        <ErrorBoundary>
                            <Login onLogin={handleLogin} />
                        </ErrorBoundary>
                    ) : (
                        <div>Jesteś już zalogowany.</div>
                    )
                } />
                <Route path="/register" element={
                    !isLoggedIn ? (
                        <ErrorBoundary>
                            <Register onRegister={handleRegister} />
                        </ErrorBoundary>
                    ) : (
                        <div>Jesteś już zalogowany.</div>
                    )
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default FakeApp;