import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from './pages/MainPage';
import SignupPage from './pages/SignupPage';
import MemberMap from './components/map/MemberMap';
import MapPage from './pages/MapPage';

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />}/>
          <Route path="/signup" element={<SignupPage />}/>
          <Route path="/membermap" element={<MemberMap />}/>
      </Routes>
    </Router>
  );
};

export default App;