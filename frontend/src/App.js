import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from "react";
import MyComponent  from "./MyComponent";
import PortfolioComponent from "./PortfolioComponent";
import TotalValueComponent from "./TotalValueComponent";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        {/*<p>*/}
        {/*  Edit <code>src/App.js</code> and save to reload.*/}
        {/*</p>*/}
        {/*<a*/}
        {/*  className="App-link"*/}
        {/*  href="https://reactjs.org"*/}
        {/*  target="_blank"*/}
        {/*  rel="noopener noreferrer"*/}
        {/*>*/}
        {/*  Learn React*/}
        {/*</a>*/}
      <MyComponent /> {/* Using MyComponent */}
      <PortfolioComponent /> {/* Using PortfolioComponent */}
      <TotalValueComponent /> {/* Using TotalValueComponent */}
      </header>
    </div>
  );
}

export default App;
