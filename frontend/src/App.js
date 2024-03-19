import './App.css';
import React, {useState, useEffect} from "react";
import LoginComponent from "./LoginComponent";
import PortfolioComponent from "./PortfolioComponent";
import TotalValueComponent from "./TotalValueComponent";
import UpdateStockComponent from "./UpdateStockComponent";
import GraphComponent from './GraphComponent';

function App() {
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStockData, setCurrentStockData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const triggerPortfolioUpdate = () => {
    setUpdateTrigger(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        {!isAuthenticated ? (
          <LoginComponent onLoginSuccess={() => setIsAuthenticated(true)} />
        ) : (
          <div style={{ display: 'flex' }}>
            <div className="debug-border" style={{ marginRight: '20px' }}>
              <UpdateStockComponent onStockUpdate={triggerPortfolioUpdate}/>
            </div>
            <div>
              <div className="debug-border">
                <PortfolioComponent
                  updateTrigger={updateTrigger}
                  setCurrentStockData={setCurrentStockData}
                />
              </div>
              <div className="debug-border">
                <TotalValueComponent updateTrigger={updateTrigger}/>
              </div>
              {/* Assign an ID to the div that wraps GraphComponent for scrolling */}
              {currentStockData && (
        <div id="graphComponent" className="debug-border">
            <GraphComponent stockData={currentStockData}/>
        </div>
    )}
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
