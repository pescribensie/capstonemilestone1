import React, { useState, useEffect } from 'react';

function PortfolioComponent() {
    const [portfolio, setPortfolio] = useState({});

    useEffect(() => {
        // Call al cargar el componente
        fetch('/api/portfolio')
            .then(response => response.json())
            .then(data => setPortfolio(data))
            .catch(error => console.error('Error fetching portfolio data:', error));
    }, []); // Para que solo se ejecute una vez

    const renderPortfolio = () => {
    // recorta el objeto portfolio para que no incluya el username y el total_value
        const stockEntries = Object.entries(portfolio).filter(([key, _]) => key !== 'username' && key !== 'total_value');

        return stockEntries.map(([stock, details]) => (
            <li key={stock}>
                {stock}: {details.num} shares at ${details.last_close_value} each for a total of ${(details.num * parseFloat(details.last_close_value)).toFixed(2)}
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
