

import React, { useState, useEffect } from 'react';

//total value en 0 primero
function TotalValueComponent({ updateTrigger }) {
    const [totalValue, setTotalValue] = useState(0);
    //busca el tokken en localStorage
    useEffect(() => {
        const token = localStorage.getItem('token'); // token de localStorage

        // fetch con auth
        fetch('https://mcsbt-integration-pe.ew.r.appspot.com/api/portfolio', {
            headers: {
                'Authorization': `Bearer ${token}` // Incluye  JWT
            }
        })
        .then(response => { // si la respuesta no es ok
            if (!response.ok) {
                //
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            //  if data.total_value existe defined y es  number
            if (data && typeof data.total_value === 'number') {
                setTotalValue(data.total_value);
            } else {
                //
                console.error('Total value is undefined or not a number', data);
                setTotalValue(0); // Reset
            }
        })
        .catch(error => {
            console.error('Error fetching portfolio data:', error);
            setTotalValue(0); // Reset y  message
        });
    }, [updateTrigger]); //  updateTrigger para repeat

    return (
        <div>
            <h2>Total Portfolio Value</h2>
            <p>Total value is ${totalValue.toFixed(2)}</p>
        </div>
    );
}

export default TotalValueComponent;