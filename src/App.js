import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Home from './components/Home';
import TestAxios from './components/TestAxios';
import Arrendatarios from './components/Arrendatarios';
import Departamentos from './components/Departamento';
import NavBar from './components/NavBar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/test-axios" element={<TestAxios />} />
          <Route path="/arrendatarios" element={<Arrendatarios />} />
          <Route path="/departamentos" element={<Departamentos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
