import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; 

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('handleSubmit wywołane');
    
        try {
            console.log('Wysyłanie danych logowania:', { username, password });
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password,
            });
    
            console.log('Odpowiedź z backendu:', response.data.userId, response.data.token);
    
            if (response.data.token && response.data.userId) {
                console.log('Logowanie pomyślne, przekazanie tokenu i userId do komponentu nadrzędnego');
                onLogin(response.data.token, response.data.userId);
            } else {
                console.error('Brak tokenu lub userId w odpowiedzi z backendu');
                setError('Błąd logowania: brak tokenu lub userId');
            }
        } catch (error) {
            console.error('Błąd logowania:', error);
            setError('Błędne dane logowania');
        }
    };

    return (
        <div className="login-container">
            <h2>Logowanie</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nazwa użytkownika"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Zaloguj</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Login;