// Importaciones de recursos y componentes necesarios
import './App.css'; // Importa los estilos CSS para este componente
import React, {useState, useEffect} from "react"; // Importa React y dos Hooks: useState y useEffect
import LoginComponent from "./LoginComponent";
import PortfolioComponent from "./PortfolioComponent"; // Importa el componente para mostrar el portafolio
import TotalValueComponent from "./TotalValueComponent"; // Importa el componente para mostrar el valor total
import UpdateStockComponent from "./UpdateStockComponent"; // Importa el componente para actualizar stocks

// Define el componente principal App
function App() {
  // Estado para controlar la actualización del portafolio
  // Se usa un booleano que se cambia para disparar efectos en otros componentes
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state to manage authentication status

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Función para cambiar el estado updateTrigger, invirtiendo su valor actual
  // Esto sirve como un disparador para efectos secundarios en otros componentes
  const triggerPortfolioUpdate = () => {
    setUpdateTrigger(prev => !prev); // Cambia el valor de updateTrigger de true a false o viceversa
  };

  // Logout function to clear the token from localStorage and update authentication status
  // This effectively "logs out" the user by removing their session token and updating the UI accordingly
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // Renderiza el componente App
  return (
    <div className="App">
      <header className="App-header">
        {!isAuthenticated ? (
          // login component if not auth
          <LoginComponent onLoginSuccess={() => setIsAuthenticated(true)} />
        ) : (
          // para authenticated users
          <div style={{ display: 'flex' }}>
            <div className="debug-border" style={{ marginRight: '20px' }}>
              <UpdateStockComponent onStockUpdate={triggerPortfolioUpdate} />
            </div>
            <div>
              <div className="debug-border">
                <PortfolioComponent updateTrigger={updateTrigger} />
              </div>
              <div className="debug-border">
                <TotalValueComponent updateTrigger={updateTrigger} />
              </div>
              {/* Logout  */}
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
