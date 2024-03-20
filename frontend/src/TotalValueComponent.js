// import React, { useState, useEffect } from 'react';
//
// // Definición del componente TotalValueComponent
// function TotalValueComponent(updateTrigger) {
//     // Estado para almacenar el valor total del portafolio
//     const [totalValue, setTotalValue] = useState(0);
//
//     // Efecto para cargar el valor total del portafolio desde la API cuando el componente se monta o se actualiza updateTrigger
//     useEffect(() => {
//         // Realiza una solicitud fetch a la API para obtener los datos del portafolio
//         // fetch('https://mcsbt-integration-pe.ew.r.appspot.com/api/portfolio')
//         fetch('/api/portfolio')
//             .then(response => response.json()) // Convierte la respuesta en JSON
//             .then(data => setTotalValue(data.total_value)) // Actualiza el estado del valor total con los datos recibidos
//             .catch(error => console.error('Error fetching portfolio data:', error)); // Maneja errores de la solicitud
//     }, [updateTrigger]); // Dependencia del efecto: updateTrigger para re-ejecutar cuando este cambie
//
//     // Renderiza el componente TotalValueComponent
//     return (
//         <div>
//             <h2>Total Portfolio Value</h2> {/* Título del componente */}
//             <p>Total value is ${totalValue.toFixed(2)}</p> {/* Muestra el valor total del portafolio formateado a 2 decimales */}
//         </div>
//     );
// }
//
// export default TotalValueComponent; // Exporta el componente para su uso en otras partes de la aplicación

// import React, { useState, useEffect } from 'react';
//
// function TotalValueComponent({ updateTrigger }) {
//     const [totalValue, setTotalValue] = useState(0);
//
//     useEffect(() => {
//         fetch('/api/portfolio')
//             .then(response => response.json())
//             .then(data => {
//                 // Check if data.total_value is defined and is a number
//                 if (data && typeof data.total_value === 'number') {
//                     setTotalValue(data.total_value);
//                 } else {
//                     // Handle cases where data.total_value is not as expected
//                     console.log('Total value is undefined or not a number', data);
//                     setTotalValue(0); // Reset to default or handle accordingly
//                 }
//             })
//             .catch(error => console.error('Error fetching portfolio data:', error));
//     }, [updateTrigger]); // Ensure updateTrigger is correctly destructured if it's a prop
//
//     return (
//         <div>
//             <h2>Total Portfolio Value</h2>
//             {/* Safely displaying totalValue using toFixed */}
//             <p>Total value is ${totalValue.toFixed(2)}</p>
//         </div>
//     );
// }
//
// export default TotalValueComponent;

import React, { useState, useEffect } from 'react';

function TotalValueComponent({ updateTrigger }) {
    const [totalValue, setTotalValue] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token'); // token de localStorage

        // Make sure you send the Authorization header with the token
        fetch('https://mcsbt-integration-pe.ew.r.appspot.com/api/portfolio', {
            headers: {
                'Authorization': `Bearer ${token}` // Incluye  JWT
            }
        })
        .then(response => {
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