import React from 'react';
import './App.css';

import {DisplayCountExplicit} from "./explicit-set-mutate/DisplayCountExplicit";
import {DisplayCountImplicit} from "./implicit-set-mutate/DisplayCountImplicit";

function App() {
  return (
    <div className="App">
      <DisplayCountExplicit/>
      <DisplayCountImplicit/>
    </div>
  );
}

export default App;
