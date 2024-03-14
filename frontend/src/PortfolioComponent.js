
import React, { useState, useEffect } from 'react';

function PortfolioComponent(updateTrigger) {
    const [portfolio, setPortfolio] = useState({});
    const [visibleDetails, setVisibleDetails] = useState({});
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [stockData, setStockData] = useState({});

    useEffect(() => {
        // fetch('https://mcsbt-integration-pe.ew.r.appspot.com/api/portfolio')
        fetch('/api/portfolio')

            .then(response => response.json())
            .then(data => setPortfolio(data))
            .catch(error => console.error('Error fetching portfolio data:', error));
    }, [updateTrigger]);

    const toggleDetailsVisibility = (stock) => {
        setVisibleDetails(prevVisibleDetails => ({ // togglea la visibilidad de los detalles. REVISAR
            ...prevVisibleDetails,
            [stock]: !prevVisibleDetails[stock],
        }));
    };

    const handleDateChange = (e, type) => {
        const value = e.target.value;
        setDateRange(prevDateRange => ({ // cambia el estado del rango de fecha
            ...prevDateRange,
            [type]: value,
        }));
    };

    const fetchDateRangeData = (stock) => {
        if (dateRange.start && dateRange.end) {
            const daterange = `${dateRange.start}_${dateRange.end}`; // el string para el date range
            // fetch(`https://mcsbt-integration-pe.ew.r.appspot.com/api/portfolio/${stock}/${daterange}`)
            fetch(`/api/portfolio/${stock}/${daterange}`)

                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch date range data');
                    }
                    return response.json();
                })
                .then(data => {
                    setStockData(prevData => ({
                        ...prevData,
                        [stock]: data, // Sobre escribe la data
                    }));
                })
                .catch(error => console.error('Error fetching date range data:', error));
        }
    };

    const renderStockData = (stock) => {
        const data = stockData[stock];
        if (!data || !data.values_daily) return null; // un check

        return (
            <div>
                <h3>Details for {stock}:</h3> {/* data histórica */}
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


    const renderPortfolio = () => {
        // filtra el objeto quitando las keys 'username' y 'total_value'
        const stockEntries = Object.entries(portfolio).filter(([key]) => key !== 'username' && key !== 'total_value');

        return stockEntries.map(([stock, details]) => (
            <li key={stock} style={{ cursor: 'pointer' }}>
                <div onClick={() => toggleDetailsVisibility(stock)}>  {/* si hace click en el stock, cambia el estado de visiblad */}
                    {stock}: {details.num_stocks} shares at ${details.last_close} each for a total of ${(details.num_stocks * parseFloat(details.last_close)).toFixed(2)}
                </div>
                {visibleDetails[stock] && ( // si está visible (si hace click) muestra el div
                    <div>
                        <input type="date" onChange={(e) => handleDateChange(e, 'start')} value={dateRange.start} />
                        <input type="date" onChange={(e) => handleDateChange(e, 'end')} value={dateRange.end} />
                        <button onClick={() => fetchDateRangeData(stock)}>Fetch Data</button>
                        {renderStockData(stock)} {/* muestra la data histórica. confirmar */}
                    </div>
                )}
            </li>
        ));
    };

    return (
        <div>
            <h2>User Portfolio</h2>
            <ul>{renderPortfolio()}</ul>
        </div>
    );
}

export default PortfolioComponent;