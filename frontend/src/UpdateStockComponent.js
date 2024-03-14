import React, { useState } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

// Componente para actualizar la información de acciones específicas
function UpdateStockComponent(props) {
    // Estado para el símbolo de la acción
    const [stockSymbol, setStockSymbol] = useState('');
    // Estado para la cantidad de acciones
    const [quantity, setQuantity] = useState('');
    // Estado para las sugerencias de búsqueda de acciones
    const [suggestions, setSuggestions] = useState([]);

    // Debounce para limitar las solicitudes de búsqueda mientras se escribe, reduciendo las llamadas a la API
    const searchStocks = debounce(async (keyword) => {
        if (!keyword.trim()) return setSuggestions([]); // Limpia las sugerencias si la entrada está vacía
        try {
            // Realiza una solicitud a la API de Alpha Vantage para buscar acciones por un término
            const response = await axios.get('https://www.alphavantage.co/query', {
                params: {
                    function: 'SYMBOL_SEARCH',
                    keywords: keyword,
                    apikey: 'KMC0W0JHJHYPEQDO',
                },
            });
            // Establece las sugerencias basadas en las coincidencias encontradas
            setSuggestions(response.data.bestMatches || []);
        } catch (error) {
            console.error('Error fetching stock data:', error);
            setSuggestions([]);
        }
    }, 300); // Establece un retraso de 300ms antes de ejecutar la búsqueda

    // Función para actualizar la información de una acción específica
    const updateStock = async (symbol, qty) => {
        try {
            const response = await axios.post('https://mcsbt-integration-pe.ew.r.appspot.com/api/update_user', {
                symbol,
                quantity: parseInt(qty, 10),
            });
            console.log(response.data);

            // Si la actualización es exitosa, llama a onStockUpdate para notificar a App.js
            props.onStockUpdate(); // Esta línea es crucial
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    // Manejador para el envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault();
        await updateStock(stockSymbol, quantity); // Llama a updateStock y luego a props.onStockUpdate
    };

    // Manejador para seleccionar una sugerencia
    const handleSelectSuggestion = (symbol) => {
        setStockSymbol(symbol); // Actualiza el símbolo de la acción con el seleccionado
        setSuggestions([]); // Limpia las sugerencias
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
                            searchStocks(e.target.value); // Busca sugerencias a medida que el usuario escribe
                        }}
                        placeholder="Stock Symbol"
                        required
                    />
                    {suggestions.length > 0 && (
                        // Despliega la lista de sugerencias
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
                    onChange={(e) => setQuantity(e.target.value)} // Actualiza la cantidad
                    placeholder="Quantity"
                    required
                    min="0"
                />
                <button type="submit">Update Stock</button>
            </form>
        </div>
    );
}

export default UpdateStockComponent; // Exporta el componente para su uso en otros lugares de la aplicación
