import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from "react";
import MyComponent  from "./MyComponent";
import PortfolioComponent from "./PortfolioComponent";
import TotalValueComponent from "./TotalValueComponent";
import UpdateStockComponent from "./UpdateStockComponent";



function App() {
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const triggerPortfolioUpdate = () => {
    setUpdateTrigger(prev => !prev); // trigger useeffect
  };
  return (
    <div className="App">
      <header className="App-header">
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
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;