import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Mood.css';
import MoodPrompt from './MoodPrompt';
import { setMood } from './moodTheme';
import logo from './images/logo.jpg';

const moods = [
  { id: 'happy', title: 'Happy', desc: 'Bright & Cheerful', colorClass: 'mood-happy' },
  { id: 'neutral', title: 'Neutral', desc: 'Balanced & Calm', colorClass: 'mood-neutral' },
  { id: 'sad', title: 'Sad', desc: 'Soft & Comforting', colorClass: 'mood-sad' }
];

export default function Mood() {
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(false);

  function handleAutoDetect() {
    setShowPrompt(true);
  }

  function handleManualSelect(mood) {
    setMood(mood);
    navigate('/dashboard');
  }

  return (
    <div className="mood-root">
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
          <Link to="/dashboard" className="nav-btn">Dashboard</Link>
          <Link to="/wardrobe" className="nav-btn">Wardrobe</Link>
          <Link to="/favorites" className="nav-btn">Favorites</Link>
          <Link to="/generator" className="nav-btn">Outfit Generator</Link>
          <Link to="/upload" className="nav-btn">Upload Clothes</Link>
        </nav>
      </aside>

      <main className="main-area">
        <div className="main-inner">
          <header className="mood-header">
            <div>
              <h1>Mood Detection</h1>
              <p className="sub">Let your mood guide your style</p>
            </div>
          </header>

          <section className="prompt-card">
            <div className="prompt-inner">
              <h2>How are you feeling today?</h2>
              <p className="muted">
                Select your current mood or let us detect it using your webcam
              </p>

              <div className="actions-row">
                <button className="btn auto" onClick={handleAutoDetect}>
                  Auto-Detect My Mood
                </button>
              </div>
            </div>
          </section>

          <section className="mood-cards">
            {moods.map((m) => (
              <article key={m.id} className={`mood-card ${m.colorClass}`}>
                <div className="mood-card-inner">
                  <div className="mood-title">{m.title}</div>
                  <div className="mood-desc">{m.desc}</div>
                  <div className="mood-select">
                    <button className="btn select" onClick={() => handleManualSelect(m.id)}>
                      Select
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>

      {showPrompt && (
        <MoodPrompt
          onAutoDetect={(mood) => {
            setMood(mood);
            setShowPrompt(false);
            navigate('/dashboard');
          }}
          onManual={() => setShowPrompt(false)}
          onClose={() => setShowPrompt(false)}
        />
      )}
    </div>
  );
}
