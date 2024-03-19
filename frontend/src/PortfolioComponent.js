import React, { useState, useEffect } from 'react';

function PortfolioComponent({ updateTrigger }) {
    const [portfolio, setPortfolio] = useState({});
    const [visibleDetails, setVisibleDetails] = useState({});
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [stockData, setStockData] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token'); // JWT de localStorage

        fetch('/api/portfolio', {
            headers: {
                'Authorization': `Bearer ${token}` // JWT en Authorization header
            }
        })
        .then(response => response.json())
        .then(data => setPortfolio(data))
        .catch(error => console.error('Error fetching portfolio data:', error));
    }, [updateTrigger]); // React to changes in updateTrigger

    // Función para alternar la visibilidad de los detalles de un stock específico
    const toggleDetailsVisibility = (stock) => {
        setVisibleDetails(prevVisibleDetails => ({
            ...prevVisibleDetails,
            [stock]: !prevVisibleDetails[stock], // Invierte la visibilidad actual del stock específico
        }));
    };

    // Manejador para cambios en los inputs de fecha
    const handleDateChange = (e, type) => {
        const value = e.target.value;
        setDateRange(prevDateRange => ({
            ...prevDateRange,
            [type]: value, // Actualiza el rango de fechas según el input modificado
        }));
    };

    // Función para cargar datos de stock basados en el rango de fechas seleccionado
    const fetchDateRangeData = (stock) => {
        if (dateRange.start && dateRange.end) {
            const token = localStorage.getItem('token'); //  include  token
            const daterange = `${dateRange.start}_${dateRange.end}`;

            fetch(`/api/portfolio/${stock}/${daterange}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Include  JWT
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch date range data');
                }
                return response.json();
            })
            .then(data => {
                setStockData(prevData => ({
                    ...prevData,
                    [stock]: data,
                }));
            })
            .catch(error => console.error('Error fetching date range data:', error));
        }
    };

    // Renderiza los datos de stock para un stock específico
    const renderStockData = (stock) => {
        const data = stockData[stock];
        if (!data || !data.values_daily) return null; // Verifica si hay datos disponibles para el stock

        return (
            <div>
                <h3>Details for {stock}:</h3> {/* Muestra los detalles históricos del stock */}
                <ul>
                    {Object.entries(data.values_daily).map(([date, details]) => (
                        <li key={date}>
                            {date}, Open: {details["1. open"]}, High: {details["2. high"]}, Low: {details["3. low"]}, Close: {details["4. close"]}, Volume: {details["5. volume"]}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    // Renderiza el portafolio, excluyendo las claves 'username' y 'total_value' del objeto de portafolio
    const renderPortfolio = () => {
        const stockEntries = Object.entries(portfolio).filter(([key]) => key !== 'username' && key !== 'total_value');

        return stockEntries.map(([stock, details]) => (
            <li key={stock} style={{ cursor: 'pointer' }}>
                <div onClick={() => toggleDetailsVisibility(stock)}> {/* Alterna la visibilidad de los detalles al hacer clic */}
                    {stock}: {details.num_stocks} shares at ${details.last_close} each for a total of ${(details.num_stocks * parseFloat(details.last_close)).toFixed(2)}
                </div>
                {visibleDetails[stock] && ( // Muestra los detalles si están visibles
                    <div>
                        <input type="date" onChange={(e) => handleDateChange(e, 'start')} value={dateRange.start} />
                        <input type="date" onChange={(e) => handleDateChange(e, 'end')} value={dateRange.end} />
                        <button onClick={() => fetchDateRangeData(stock)}>Fetch Data</button>
                        {renderStockData(stock)} {/* Muestra los datos históricos del stock */}
                    </div>
                )}
            </li>
        ));
    };

    return (
        <div>
            <h2>User Portfolio</h2> {/* Título del componente */}
            <ul>{renderPortfolio()}</ul> {/* Renderiza la lista del portafolio */}
        </div>
    );
}

export default PortfolioComponent; // Exporta el componente para su uso en otras partes de la aplicación
