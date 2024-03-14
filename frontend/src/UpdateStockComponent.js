
import React, { useState } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

function UpdateStockComponent(props) {
    const [stockSymbol, setStockSymbol] = useState('');
    const [quantity, setQuantity] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    // el debounce es para que no se fetch con cada input
    const searchStocks = debounce(async (keyword) => {
        if (!keyword.trim()) return setSuggestions([]); // limpia si empty
        try {
            //revisar axios not sure la verdad
            const response = await axios.get('https://www.alphavantage.co/query', {
                params: {
                    function: 'SYMBOL_SEARCH',
                    keywords: keyword,
                    apikey: 'KMC0W0JHJHYPEQDO',
                },
            });
            // las sugerencias
            setSuggestions(response.data.bestMatches || []);
        } catch (error) {
            console.error('Error fetching stock data:', error);
            setSuggestions([]);
        }
    }, 300);

 const updateStock = async (symbol, qty) => {
  try {
    const response = await axios.post('http://localhost:5000/api/update_user', {
      symbol,
      quantity: parseInt(qty, 10),
    });
    console.log(response.data);

    // si update es successful, call onStockUpdate y notifica a App.js
    props.onStockUpdate(); // This line is crucial
  } catch (error) {
    console.error('Error updating stock:', error);
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  await updateStock(stockSymbol, quantity); // trigger props.onStockUpdate

};

    const handleSelectSuggestion = (symbol) => {
        setStockSymbol(symbol);
        setSuggestions([]); // limpia las sugerencias
    };

    return (
        <div style={{ position: 'relative' }}>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        value={stockSymbol}
                        onChange={(e) => {
                            setStockSymbol(e.target.value);
                            searchStocks(e.target.value);
                        }}
                        placeholder="Stock Symbol"
                        required
                    />
                    {suggestions.length > 0 && (
                        <ul style={{
                            position: 'absolute',
                            zIndex: 1000,
                            width: '100%',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderTop: 'none',
                            listStyleType: 'none',
                            padding: 0,
                            margin: 0,
                            top: '100%',
                            left: 0,
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            {suggestions.map((suggestion, index) => (
                                <li key={index} onClick={() => handleSelectSuggestion(suggestion['1. symbol'])} style={{
                                    cursor: 'pointer',
                                    padding: '10px',
                                    borderBottom: '1px solid #ddd',
                                    color: 'black',
                                    fontSize: '14px',
                                }}>
                                    {suggestion['1. symbol']} - {suggestion['2. name']}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Quantity"
                    required
                    min="0"
                />
                <button type="submit">Update Stock</button>
            </form>
        </div>
    );
}

export default UpdateStockComponent;
