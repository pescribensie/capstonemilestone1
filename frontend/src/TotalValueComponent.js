import React, { useState, useEffect } from 'react';

// Definición del componente TotalValueComponent
function TotalValueComponent(updateTrigger) {
    // Estado para almacenar el valor total del portafolio
    const [totalValue, setTotalValue] = useState(0);

    // Efecto para cargar el valor total del portafolio desde la API cuando el componente se monta o se actualiza updateTrigger
    useEffect(() => {
        // Realiza una solicitud fetch a la API para obtener los datos del portafolio
        // fetch('https://mcsbt-integration-pe.ew.r.appspot.com/api/portfolio')
        fetch('https://mcsbt-integration-pe.ew.r.appspot.com/api/portfolio')
            .then(response => response.json()) // Convierte la respuesta en JSON
            .then(data => setTotalValue(data.total_value)) // Actualiza el estado del valor total con los datos recibidos
            .catch(error => console.error('Error fetching portfolio data:', error)); // Maneja errores de la solicitud
    }, [updateTrigger]); // Dependencia del efecto: updateTrigger para re-ejecutar cuando este cambie

    // Renderiza el componente TotalValueComponent
    return (
        <div>
            <h2>Total Portfolio Value</h2> {/* Título del componente */}
            <p>Total value is ${totalValue.toFixed(2)}</p> {/* Muestra el valor total del portafolio formateado a 2 decimales */}
        </div>
    );
}

export default TotalValueComponent; // Exporta el componente para su uso en otras partes de la aplicación
