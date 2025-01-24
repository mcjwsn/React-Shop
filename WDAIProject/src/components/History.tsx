import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './History.css'; 

const History = ({ userId }) => {
    const [orders, setOrders] = useState([]);
    const [singleOrder, setSingleOrder] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('all');

    useEffect(() => {
        if (!userId) return;

        const fetchUserStatusAndOrders = async () => {
            try {
                setIsLoading(true);

                
                const adminCheckResponse = await axios.get(`http://localhost:5000/api/users/${userId}/isAdmin`);
                const isAdmin = adminCheckResponse.data.isAdmin;
                setIsAdmin(isAdmin);

                
                const url = isAdmin
                    ? 'http://localhost:5000/api/orders'
                    : `http://localhost:5000/api/orders/${userId}`;

                const ordersResponse = await axios.get(url);
                setOrders(ordersResponse.data);
            } catch (error) {
                console.error('Błąd pobierania danych:', error);
                setError('Wystąpił błąd podczas pobierania danych.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserStatusAndOrders();
    }, [userId]);

    const findSingleOrder = (orderId) => {
        const order = orders.find(order => order.id === orderId);
        if (order) {
            setSingleOrder(order);
            setViewMode('single');
        } else {
            setError('Nie znaleziono zamówienia o podanym ID.');
        }
    };

    const downloadAllOrdersAsCSV = () => {
        const headers = ["ID Zamówienia", "ID Użytkownika", "Kwota", "Status", "Data"];
        const rows = orders.map(order => [
            order.id,
            order.userId,
            order.totalAmount,
            order.status,
            order.createdAt
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'wszystkie_zamowienia.csv';
        link.click();
    };

    const downloadSingleOrderAsJSON = () => {
        if (!singleOrder) return;

        const jsonContent = JSON.stringify(singleOrder, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `zamowienie_${singleOrder.id}.json`;
        link.click();
    };

    const goBackToAllOrders = () => {
        setSingleOrder(null);
        setViewMode('all');
    };

    if (isLoading) {
        return <p className="loading-message">Ładowanie...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="history-container">
            <h1>Historia zamówień</h1>

            {viewMode === 'all' ? (
                <>
                    {orders.length === 0 ? (
                        <p>Brak zamówień do wyświetlenia.</p>
                    ) : (
                        <>
                            <button className="download-button" onClick={downloadAllOrdersAsCSV}>
                                Pobierz wszystkie zamówienia (CSV)
                            </button>
                            <ul>
                                {orders.map(order => (
                                    <li key={order.id}>
                                        <p>ID zamówienia: {order.id}</p>
                                        <p>Użytkownik ID: {order.userId}</p>
                                        <p>Kwota: {order.totalAmount} zł</p>
                                        <p>Status: {order.status}</p>
                                        <p>Data: {order.createdAt}</p>
                                        <button onClick={() => findSingleOrder(order.id)}>Pokaż szczegóły</button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </>
            ) : (
                <>
                    <h2>Szczegóły zamówienia</h2>
                    {singleOrder ? (
                        <div>
                            <p>ID zamówienia: {singleOrder.id}</p>
                            <p>Użytkownik ID: {singleOrder.userId}</p>
                            <p>Kwota: {singleOrder.totalAmount} zł</p>
                            <p>Status: {singleOrder.status}</p>
                            <p>Data: {singleOrder.createdAt}</p>
                            <button className="download-button" onClick={downloadSingleOrderAsJSON}>
                                Pobierz zamówienie (JSON)
                            </button>
                            <button className="back-button" onClick={goBackToAllOrders}>
                                Powrót do wszystkich zamówień
                            </button>
                        </div>
                    ) : (
                        <p>Nie znaleziono szczegółów zamówienia.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default History;