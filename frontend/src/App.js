// Importaciones de recursos y componentes necesarios
import './App.css'; // Importa los estilos CSS para este componente
import React, {useState, useEffect} from "react"; // Importa React y dos Hooks: useState y useEffect
import PortfolioComponent from "./PortfolioComponent"; // Importa el componente para mostrar el portafolio
import TotalValueComponent from "./TotalValueComponent"; // Importa el componente para mostrar el valor total
import UpdateStockComponent from "./UpdateStockComponent"; // Importa el componente para actualizar stocks

// Define el componente principal App
function App() {
  // Estado para controlar la actualización del portafolio
  // Se usa un booleano que se cambia para disparar efectos en otros componentes
  const [updateTrigger, setUpdateTrigger] = useState(false);

  // Función para cambiar el estado updateTrigger, invirtiendo su valor actual
  // Esto sirve como un disparador para efectos secundarios en otros componentes
  const triggerPortfolioUpdate = () => {
    setUpdateTrigger(prev => !prev); // Cambia el valor de updateTrigger de true a false o viceversa
  };

  // Renderiza el componente App
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'flex' }}>
          <div className="debug-border" style={{ marginRight: '20px' }}>
            {/* Renderiza el componente para actualizar stocks.
                Pasa la función triggerPortfolioUpdate como prop para ser llamada después de una actualización */}
            <UpdateStockComponent onStockUpdate={triggerPortfolioUpdate} />
          </div>
          <div>
            <div className="debug-border">
              {/* Renderiza el componente de portafolio pasándole el estado updateTrigger como prop.
                  Este estado le permite saber cuándo debe actualizar su contenido */}
              <PortfolioComponent updateTrigger={updateTrigger} />
            </div>
            <div className="debug-border">
              {/* Renderiza el componente que muestra el valor total, también recibe updateTrigger
                  para saber cuándo actualizar su información */}
              <TotalValueComponent updateTrigger={updateTrigger} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App; // Exporta el componente App para ser usado en otras partes de la aplicación
