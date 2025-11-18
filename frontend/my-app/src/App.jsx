import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginScreen from './LoginScreen';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Wardrobe from './Wardrobe';
import Favorites from './Favorites';
import Mood from './Mood';
import Generator from './Generator';
import Upload from './Upload';
import Trash from './Trash';

import './App.css';
import './moodTheme.css';
import BAELanding from "./BAELanding";
import { initMood } from "./moodTheme.js";

export default function App() {

  useEffect(() => {
    console.log("INIT MOOD RAN");
    initMood();
    console.log("HTML ATTR IS:", document.documentElement.getAttribute("data-mood"));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BAELanding />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/wardrobe" element={<Wardrobe />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/trash" element={<Trash />} />
      </Routes>
    </BrowserRouter>
  );
}
