import React, { useState, useEffect } from 'react';

function TotalValueComponent() {
    const [totalValue, setTotalValue] = useState(0);

    useEffect(() => {
        // Call al cargar el componente
        fetch('/api/portfolio')
            .then(response => response.json())
            .then(data => setTotalValue(data.total_value))
            .catch(error => console.error('Error fetching portfolio data:', error));
    }, []); // Para que solo se ejecute una vez

    return (
        <div>
            <h2>Total Portfolio Value</h2>
            <p>Total value is ${totalValue.toFixed(2)}</p>
        </div>
    );
}

export default TotalValueComponent;
