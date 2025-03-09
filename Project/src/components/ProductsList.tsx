import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductList.css'; 

const ProductList = ({ onProductSelect }) => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Błąd pobierania produktów:', error));
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
        return matchesSearchTerm && matchesCategory;
    });

    const categories = [...new Set(products.map(product => product.category))];

    const handleDownloadAllProducts = () => {
        const dataStr = JSON.stringify(products, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `wszystkie_produkty_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDownloadProduct = (product, e) => {
        e.stopPropagation();
        const dataStr = JSON.stringify(product, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `produkt_${product.id}_${product.name.replace(/\s+/g, '_')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="product-list-container">
            <h1>Produkty</h1>
            <button
                className="download-all-button"
                onClick={handleDownloadAllProducts}
            >
                Pobierz wszystkie produkty (JSON)
            </button>
            <input
                type="text"
                placeholder="Wyszukaj produkt po nazwie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
            >
                <option value="">Wszystkie kategorie</option>
                {categories.map(category => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>
            <button
                className="clear-filter-button"
                onClick={() => setSelectedCategory('')}
            >
                Wyczyść filtr kategorii
            </button>
            {filteredProducts.length === 0 ? (
                <p className="no-products-message">Nie znaleziono produktów pasujących do kryteriów wyszukiwania.</p>
            ) : (
                <ul className="product-list">
                    {filteredProducts.map(product => (
                        <li
                            key={product.id}
                            onClick={() => onProductSelect(product)}
                        >
                            <strong>{product.name}</strong> - {product.description} (Kategoria: {product.category})
                            <button
                                onClick={(e) => handleDownloadProduct(product, e)}
                            >
                                Pobierz (JSON)
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductList;