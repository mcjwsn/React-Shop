import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import ProductList from './components/ProductsList';
import ProductDetails from './components/ProductsDetails';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import History from './components/History';
import AdminReviews from './components/AdminReviews'; 
import ErrorBoundary from './components/ErrorBoundary';
import axios from 'axios';

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedProduct, setSelectedProduct] = useState(null);
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

        setCurrentPage('products');
    };

    const handleRegister = () => {
        console.log('Przekierowanie do logowania...');
        setCurrentPage('login');
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

        setCurrentPage('home');
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

    const navigateTo = (page) => {
        if (page === 'products' || page === 'cart' || page === 'history' || page === 'admin-reviews') {
            if (!isLoggedIn) {
                alert('Musisz się zalogować, aby przejść do tej strony.');
                setCurrentPage('login');
                return;
            }
        }
        setCurrentPage(page);
    };
    

    return (
        <div>
            <nav>
                <button onClick={() => navigateTo('home')}>Strona główna</button>
                <button onClick={() => navigateTo('products')} disabled={!isLoggedIn}>
                    Produkty
                </button>
                <button onClick={() => navigateTo('cart')} disabled={!isLoggedIn}>
                    Koszyk ({cart.length})
                </button>
                <button onClick={() => navigateTo('history')} disabled={!isLoggedIn}>
                    Historia zamówień
                </button>
                {isLoggedIn && isAdmin && (
                    <button onClick={() => navigateTo('admin-reviews')}>Zarządzaj opiniami</button>
                )}
                {isLoggedIn ? (
                    <button onClick={handleLogout}>Wyloguj</button>
                ) : (
                    <>
                        <button onClick={() => navigateTo('login')}>Logowanie</button>
                        <button onClick={() => navigateTo('register')}>Rejestracja</button>
                    </>
                )}
            </nav>

            {currentPage === 'home' && (
    <div>
        <h1 className="welcome-text">Witaj na stronie głównej!</h1>
        {!isLoggedIn && <p className="welcome-text">Zaloguj się, aby przejść do produktów, koszyka lub historii zamówień.</p>}
        <br></br>       
        <div className="cube-container">
            <div className="cube">
                <div className="face front">Witaj!</div>
                <div className="face back">👋</div>
                <div className="face right">😊</div>
                <div className="face left">🚀</div>
                <div className="face top">🌟</div>
                <div className="face bottom">🎉</div>
            </div>
        </div>
    </div>
)}

            {currentPage === 'admin-reviews' && isLoggedIn && isAdmin && (
                <ErrorBoundary>
                    <AdminReviews />
                </ErrorBoundary>
            )}

            {currentPage === 'products' && isLoggedIn && (
                <ErrorBoundary>
                    <ProductList 
                        onProductSelect={(product) => {
                            setSelectedProduct(product);
                            navigateTo('details');
                        }}
                    />
                </ErrorBoundary>
            )}

            {currentPage === 'details' && isLoggedIn && (
                <ErrorBoundary>
                    <ProductDetails
                        product={selectedProduct}
                        onAddToCart={addToCart}
                        userId={userId}
                    />
                </ErrorBoundary>
            )}

            {currentPage === 'cart' && isLoggedIn && (
                <ErrorBoundary>
                    <Cart 
                        userId={userId} 
                        cart={cart} 
                        onRemoveFromCart={removeFromCart} 
                        onClearCart={clearCart}
                    />
                </ErrorBoundary>
            )}

            {currentPage === 'history' && isLoggedIn && (
                <ErrorBoundary>
                    <History userId={userId} isAdmin={isAdmin} />
                </ErrorBoundary>
            )}

            {currentPage === 'login' && !isLoggedIn && (
                <ErrorBoundary>
                    <Login onLogin={handleLogin} />
                </ErrorBoundary>
            )}

            {currentPage === 'register' && !isLoggedIn && (
                <ErrorBoundary>
                    <Register onRegister={handleRegister} />
                </ErrorBoundary>
            )}
        </div>
    );
}

export default App;