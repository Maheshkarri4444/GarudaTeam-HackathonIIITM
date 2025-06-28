
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MainSystem from './components/MainSystem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/system" element={<MainSystem />} />
      </Routes>
    </Router>
  );
}

export default App;