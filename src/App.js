import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from './pages/MainPage';
import SignupPage from './pages/SignupPage';
import MemberMap from './components/map/MemberMap';
import MapPage from './pages/MapPage';
import RequestPage from './pages/RequestPage';

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />}/>
          <Route path="/signup" element={<SignupPage />}/>
          <Route path="/membermap" element={<MemberMap />}/>
          <Route path="/request" element={<RequestPage />}/>
      </Routes>
    </Router>
  );
};

export default App;