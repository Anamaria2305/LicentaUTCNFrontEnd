import logo from './res/images/energy-icon.webp';
import './App.css';
import {NavLink} from 'react-router-dom';
import {APP_NAME} from './res/STRINGS';
import React from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import 'react-responsive-modal/styles.css';
function App() {
  return <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo"/>
      <br/>
      <h1>{APP_NAME}</h1>
      <br/>
      <NavLink to={"/login"}><button className="form-button"> LogIn </button></NavLink>
      <br/>
      <NavLink to={"/signup"}><button className="form-button"> SignUp </button></NavLink>
    </header>
  </div>;
}

export default App;
