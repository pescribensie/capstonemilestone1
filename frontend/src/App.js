import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from "react";
import MyComponent  from "./MyComponent";
import PortfolioComponent from "./PortfolioComponent";
import TotalValueComponent from "./TotalValueComponent";
import UpdateStockComponent from "./UpdateStockComponent";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'flex' }}>

          <div className="debug-border" style={{ marginRight: '20px' }}>
            <UpdateStockComponent />
          </div>

          <div>
            <div className="debug-border">
              <PortfolioComponent />
            </div>
            <div className="debug-border">
              <TotalValueComponent />
            </div>
          </div>

        </div>
      </header>
    </div>
  );
}

export default App;