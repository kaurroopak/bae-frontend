import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./Dashboard.css";
import MoodPrompt from './MoodPrompt';
import logo from './images/logo.jpg';

export default function Dashboard() {
  const navigate = useNavigate();
  const [showMoodPrompt, setShowMoodPrompt] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [userName, setUserName] = useState("Guest User");
  const [wardrobeCount, setWardrobeCount] = useState(0);
  const [favouritesCount, setFavouritesCount] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL; // <--- deployed backend URL

  /* ---------------- LOAD USER INFO & MOOD ---------------- */
  useEffect(() => {
    try {
      const just = localStorage.getItem('justLoggedIn');
      if (just === 'true') {
        setShowMoodPrompt(true);
        localStorage.removeItem('justLoggedIn');
      }
      const savedMood = localStorage.getItem('detectedMood');
      if (savedMood) setCurrentMood(savedMood);

      const savedName = localStorage.getItem("userName");
      if (savedName) setUserName(savedName);
    } catch (e) {}
  }, []);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "userName") {
        setUserName(e.newValue || "Guest User");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  /* ---------------- FETCH WARDROBE & FAVOURITES COUNTS ---------------- */
  useEffect(() => {
    const userId = localStorage.getItem("userEmail");
    if (!userId) return;

    // Fetch wardrobe items
    fetch(`${API_URL}/wardrobe/all?userId=${userId}`)
      .then(res => res.json())
      .then(data => setWardrobeCount(data.items?.length || 0))
      .catch(err => console.error("Wardrobe fetch error:", err));

    // Fetch favourites
    fetch(`${API_URL}/getFavourites?userId=${userId}`)
      .then(res => res.json())
      .then(data => setFavouritesCount(data.favourites?.length || 0))
      .catch(err => console.error("Favourites fetch error:", err));
  }, [API_URL]);

  /* ---------------- MOOD HANDLERS ---------------- */
  function handleAutoDetect(mood) {
    try {
      localStorage.setItem('moodPromptShown', 'true');
      localStorage.setItem('detectedMood', mood);
    } catch (e) {}
    setCurrentMood(mood);
    setShowMoodPrompt(false);
  }

  function handleManual() {
    try {
      localStorage.setItem('moodPromptShown', 'true');
    } catch (e) {}
    setShowMoodPrompt(false);
    navigate('/mood');
  }

  function handleLogout() {
    try {
      localStorage.removeItem('moodPromptShown');
      localStorage.removeItem('detectedMood');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
    } catch (e) {}
    navigate('/');
  }

  /* ---------------- QUICK ACTIONS ---------------- */
  function goToWardrobe() { navigate('/wardrobe'); }
  function goToUpload() { navigate('/upload'); }
  function goToGenerator() { navigate('/generator'); }

  return (
    <div className="dashboard-root">
      <aside className="sidebar">
        <div className="brand">
          <img
            src={logo}
            alt="BAE Logo"
            className="brand-logo"
            loading="lazy"
          />
        </div>
        <nav className="nav">
          <Link to="/dashboard" className="nav-btn active">
            <span>Dashboard</span>
          </Link>
          <Link to="/wardrobe" className="nav-btn">
            <span>Wardrobe</span>
          </Link>
          <Link to="/favorites" className="nav-btn">
            <span>Favorites</span>
          </Link>
          <Link to="/generator" className="nav-btn">
            <span>Outfit Generator</span>
          </Link>
          <Link to="/upload" className="nav-btn">
            <span>Upload Clothes</span>
          </Link>
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <Link to="/profile" className="profile">
            <div className="profile-meta">
              <div className="profile-name">{userName}</div>
              <div className="profile-link">View Profile</div>
            </div>
          </Link>
          <button className="nav-btn logout" onClick={handleLogout} style={{ marginTop: 12 ,width: "100%" }}>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="main-area">
        <div className="main-inner">
          <div className="heading">
            <h1>Welcome Back!</h1>
            <p className="sub">Here’s what’s happening with your wardrobe today</p>
          </div>

          {currentMood && (
            <div className="mood-message">
              <h2>Today's detected mood: <span>{currentMood}</span></h2>
            </div>
          )}

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{wardrobeCount}</div>
              <div className="stat-label">Items in Wardrobe</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{favouritesCount}</div>
              <div className="stat-label">Favorites Saved</div>
            </div>
          </div>

          <div className="lower-grid">
            <div className="panel">
              <h3>Quick Actions</h3>
              <div className="action-list">
                <div className="quick-action" onClick={goToWardrobe} tabIndex={0} role="button">View Wardrobe Items</div>
                <div className="quick-action" onClick={goToUpload} tabIndex={0} role="button">Upload New Item</div>
                <div className="quick-action" onClick={goToGenerator} tabIndex={0} role="button">Generate New Outfit</div>
              </div>
            </div>

            <div className="panel">
              <h3>Today's Mood</h3>
              <p className="muted">Your vibe sets the tone! Detect or choose your mood.</p>
              <div className="action-list">
                <div
                  className="quick-action"
                  role="button"
                  tabIndex={0}
                  onClick={() => setShowMoodPrompt(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setShowMoodPrompt(true);
                  }}
                >
                  Detect My Mood
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showMoodPrompt && (
        <MoodPrompt
          onAutoDetect={handleAutoDetect}
          onManual={handleManual}
          onClose={() => setShowMoodPrompt(false)}
        />
      )}
    </div>
  );
}
