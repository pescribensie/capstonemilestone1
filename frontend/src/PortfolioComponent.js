
import React, { useState, useEffect } from 'react';

function PortfolioComponent({ updateTrigger, setCurrentStockData }) {
    const [portfolio, setPortfolio] = useState({});
    const [visibleDetails, setVisibleDetails] = useState({});
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [stockData, setStockData] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('https://mcsbt-integration-pe.ew.r.appspot.com/api/portfolio', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => setPortfolio(data))
        .catch(error => console.error('Error fetching portfolio data:', error));
    }, [updateTrigger]);

    // manejo de la visibilidad de los detalles
    const toggleDetailsVisibility = (stock) => {
        setVisibleDetails(prevVisibleDetails => ({
            ...prevVisibleDetails,
            [stock]: !prevVisibleDetails[stock],
        }));
    };

    // manejo del graph
    const handleViewGraph = (stock) => {
        if (stockData[stock]) {
            setCurrentStockData(stockData[stock]);
            setTimeout(() => {
                document.getElementById('graphComponent').scrollIntoView({ behavior: 'smooth' });
            }, 0);
        }
    };

    // cambio de fecha
    const handleDateChange = (e, type) => {
        const value = e.target.value;
        setDateRange(prevDateRange => ({
            ...prevDateRange,
            [type]: value,
        }));
    };

    // fetch data para un rango de fechas
    const fetchDateRangeData = (stock) => {
        if (dateRange.start && dateRange.end) {
            const token = localStorage.getItem('token');
            const daterange = `${dateRange.start}_${dateRange.end}`;

            fetch(`https://mcsbt-integration-pe.ew.r.appspot.com/api/portfolio/${stock}/${daterange}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
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
                setCurrentStockData(data); // Render data
            })
            .catch(error => console.error('Error fetching date range data:', error));
        }
    };

    return (
        <div>
            <h2>User Portfolio</h2>
            <table>
                <thead>
                    <tr>
                        <th>Stock</th>
                        <th>NumStock</th>
                        <th>CloseValue</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(portfolio).filter(([key]) => key !== 'username' && key !== 'total_value').map(([stock, details]) => (
                        <React.Fragment key={stock}>
                            <tr style={{ cursor: 'pointer' }} onClick={() => toggleDetailsVisibility(stock)}>
                                <td>{stock}</td>
                                <td>{details.num_stocks}</td>
                                <td>${details.last_close}</td>
                                <td>${(details.num_stocks * parseFloat(details.last_close)).toFixed(2)}</td>
                            </tr>
                            {visibleDetails[stock] && (
                                <tr>
                                    <td colSpan="4">
                                        <div>
                                            <input type="date" onChange={(e) => handleDateChange(e, 'start')} value={dateRange.start} />
                                            <input type="date" onChange={(e) => handleDateChange(e, 'end')} value={dateRange.end} />
                                            <button onClick={() => fetchDateRangeData(stock)}>Fetch Data</button>
                                            {stockData[stock] && (
                                                <>
                                                    <button onClick={() => handleViewGraph(stock)}>View Graph</button>
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <table style={{ fontSize: '0.5em' }}>
                                                            <thead>
                                                                <tr>
                                                                    <th>Date</th>
                                                                    <th>Open</th>
                                                                    <th>High</th>
                                                                    <th>Low</th>
                                                                    <th>Close</th>
                                                                    <th>Volume</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {Object.entries(stockData[stock].values_daily).map(([date, details]) => (
                                                                    <tr key={date}>
                                                                        <td>{date}</td>
                                                                        <td>${parseFloat(details["1. open"]).toFixed(2)}</td>
                                                                        <td>${parseFloat(details["2. high"]).toFixed(2)}</td>
                                                                        <td>${parseFloat(details["3. low"]).toFixed(2)}</td>
                                                                        <td>${parseFloat(details["4. close"]).toFixed(2)}</td>
                                                                        <td>{parseInt(details["5. volume"]).toLocaleString()}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PortfolioComponent;
