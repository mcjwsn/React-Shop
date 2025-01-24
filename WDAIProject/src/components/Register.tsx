import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            console.log('Wysyłanie danych rejestracji:', { username, password }); 
            const response = await axios.post('http://localhost:5000/api/users/', {
                username,
                password,
            });
    
            console.log('Odpowiedź z serwera:', response.data); 
    
            if (response.status === 201) {
                setSuccess('Zarejestrowano pomyślnie! Możesz się zalogować.');
                setError('');
                setTimeout(() => {
                    console.log('Przekierowanie do logowania...'); 
                    onRegister(); 
                }, 1500); 
            }
        } catch (error) {
            console.error('Błąd rejestracji:', error);
            if (error.response && error.response.data.error === 'Użytkownik już istnieje') {
                setError('Nazwa użytkownika jest już zajęta. Wybierz inną.');
            } else {
                setError('Błąd rejestracji. Spróbuj ponownie później.');
            }
            setSuccess('');
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <h2>Rejestracja</h2>
            <input
                type="text"
                placeholder="Nazwa użytkownika"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Zarejestruj</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </form>
    );
};

export default Register;