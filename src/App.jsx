import React from 'react';
import Navbar from './components/Navbar.jsx';
import AnimatedAvatarScene from './components/AnimatedAvatarScene.jsx';
import Home from './components/Home.jsx';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/abc" element={<Home />} />
          <Route path="/home" element={<AnimatedAvatarScene />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}