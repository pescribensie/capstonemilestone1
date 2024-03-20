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

    const toggleDetailsVisibility = (stock) => {
        setVisibleDetails(prevVisibleDetails => ({
            ...prevVisibleDetails,
            [stock]: !prevVisibleDetails[stock],
        }));
    };

    const handleViewGraph = (stock) => {
  // check por data
  if (stockData[stock]) {
    // data a graph
    setCurrentStockData(stockData[stock]);

    // timeout
    setTimeout(() => {
      // scroll a graph
      document.getElementById('graphComponent').scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }
};

    const handleDateChange = (e, type) => {
        const value = e.target.value;
        setDateRange(prevDateRange => ({
            ...prevDateRange,
            [type]: value,
        }));
    };

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
                setCurrentStockData(data); // render data
            })
            .catch(error => console.error('Error fetching date range data:', error));
        }
    };

    const renderPortfolio = () => {
        const stockEntries = Object.entries(portfolio).filter(([key]) => key !== 'username' && key !== 'total_value');

        return stockEntries.map(([stock, details]) => (
            <li key={stock} style={{ cursor: 'pointer' }}>
                <div onClick={() => toggleDetailsVisibility(stock)}>
                    {stock}: {details.num_stocks} shares at ${details.last_close} each for a total of ${(details.num_stocks * parseFloat(details.last_close)).toFixed(2)}
                </div>
                {visibleDetails[stock] && (
                    <div>
                        <div>Details for {stock}:</div>
                        <input type="date" onChange={(e) => handleDateChange(e, 'start')} value={dateRange.start} />
                        <input type="date" onChange={(e) => handleDateChange(e, 'end')} value={dateRange.end} />
                        <button onClick={() => fetchDateRangeData(stock)}>Fetch Data</button>
                        {stockData[stock] && (
                            <>
                                <button onClick={() => handleViewGraph(stock)}>View Graph</button>
                                <ul>
                                {Object.entries(stockData[stock].values_daily).map(([date, details]) => (
                                        <li key={date}>
                                            {date}, Open: {details["1. open"]}, High: {details["2. high"]}, Low: {details["3. low"]}, Close: {details["4. close"]}, Volume: {details["5. volume"]}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
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
