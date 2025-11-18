import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Generator.css';
import logo from './images/logo.jpg';

export default function Generator() {
  const userId = localStorage.getItem("userEmail") || "";  

  const [notification, setNotification] = useState('');
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [animation, setAnimation] = useState('');
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);

  const startY = useRef(null);

  /* ---------------- FETCH OUTFIT ---------------- */
  const fetchNextOutfit = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/generator/next?userId=${userId}`);
      const d = res.data || {};

      const normalizeItem = (val) => {
        if (!val) return null;
        if (typeof val === 'string') return { imageUrl: val, name: '' };
        if (typeof val === 'object') {
          if (val.imageUrl) return val;
          return { imageUrl: val.imageUrl || null, name: val.name || val.title || '' , ...val };
        }
        return null;
      };

      const top = normalizeItem(d.topwear);
      const bottom = normalizeItem(d.bottomwear);

      if (top || bottom) {
        setOutfit({ topwear: top, bottomwear: bottom });
      } else {
        setOutfit({ topwear: null, bottomwear: null });
        setNotification("No more outfits available!");
      }
    } catch (err) {
      console.error("Fetch outfit error:", err);
      setNotification("Failed to fetch outfits!");
      setOutfit({ topwear: null, bottomwear: null });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextOutfit();
  }, []);

  /* ---------------- LIKE ---------------- */
  const handleLike = async () => {
    if (!userId) {
      alert("You must be logged in to save favorites!");
      return;
    }

    try {
      if (outfit?.topwear?.imageUrl || outfit?.bottomwear?.imageUrl) {
        await axios.post(`${import.meta.env.VITE_API_URL}/saveFavourite`, {
          userId,
          topwear: outfit.topwear?.imageUrl || "",
          bottomwear: outfit.bottomwear?.imageUrl || "",
        });
      }
    } catch (err) {
      console.error("Error saving favorite:", err);
    }

    setAnimation("animate-like");
    setNotification("Outfit added to Favorites 💖");

    setTimeout(() => {
      setAnimation("");
      setNotification("");
      setDragOffset(0);
      fetchNextOutfit();
    }, 450);
  };

  /* ---------------- SKIP ---------------- */
  const handleSkip = () => {
    setAnimation("animate-skip");

    setTimeout(() => {
      setAnimation("");
      setDragOffset(0);
      fetchNextOutfit();
    }, 450);
  };

  /* ---------------- DRAG ---------------- */
  const startDrag = (y) => {
    startY.current = y;
    setDragging(true);
  };

  const updateDrag = (y) => {
    if (!dragging) return;
    const diff = y - startY.current;
    setDragOffset(diff);
  };

  const endDrag = () => {
    setDragging(false);

    if (dragOffset < -120) handleLike();
    else if (dragOffset > 120) handleSkip();
    else setDragOffset(0);
  };

  /* ---------------- EVENTS ---------------- */
  const handleMouseDown = (e) => startDrag(e.clientY);
  const handleMouseMove = (e) => updateDrag(e.clientY);
  const handleMouseUp = () => endDrag();

  const handleTouchStart = (e) => startDrag(e.touches[0].clientY);
  const handleTouchMove = (e) => updateDrag(e.touches[0].clientY);
  const handleTouchEnd = () => endDrag();

  return (
    <div className="generator-root" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {/* Sidebar */}
      <aside className="left-sidebar">
        <div className="sidebar-inner">
          <div className="brand">
            <img src={logo} alt="BAE Logo" className="brand-logo" loading="lazy" />
          </div>

          <nav className="menu">
            <Link to="/dashboard" className="menu-item"><span>Dashboard</span></Link>
            <Link to="/wardrobe" className="menu-item"><span>Wardrobe</span></Link>
            <Link to="/favorites" className="menu-item"><span>Favorites</span></Link>
            <Link to="/generator" className="menu-item active"><span>Outfit Generator</span></Link>
            <Link to="/upload" className="menu-item"><span>Upload Clothes</span></Link>
          </nav>

          <Link to="/profile" className="guest-box">
            <div className="guest-meta">
              <div className="guest-name">{localStorage.getItem("userName") || "Guest User"}</div>
              <div className="guest-link">View Profile</div>
            </div>
          </Link>
        </div>
      </aside>

      {/* MAIN GENERATOR AREA */}
      <main className="generator-main">
        <div className="main-header">
          <h1>Outfit Generator</h1>
          <p className="subtitle left-align-subtitle">Swipe up to like, swipe down to pass</p>
        </div>

        <div className="content-wrap">
          <section className="center-stage">
            <div className="card-wrapper">
              <div
                className={`swipe-card ${dragging ? "dragging" : ""} ${animation}`}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ transform: `translateY(${dragOffset}px)` }}
              >
                <div className="card-media">
                  {loading ? (
                    <div className="bottomwear-placeholder">Loading outfit...</div>
                  ) : (
                    <>
                      {outfit?.topwear?.imageUrl ? (
                        <img
                          src={outfit.topwear.imageUrl}
                          alt="Topwear"
                          className="topwear-img"
                        />
                      ) : (
                        <div className="topwear-placeholder">No topwear available</div>
                      )}

                      {outfit?.bottomwear?.imageUrl ? (
                        <img
                          src={outfit.bottomwear.imageUrl}
                          alt="Bottomwear"
                          className="bottomwear-img"
                        />
                      ) : (
                        <div className="bottomwear-placeholder">No bottomwear available</div>
                      )}
                    </>
                  )}
                </div>

                {/* Card Footer */}
                <div className="card-footer">
                  <div className="footer-left">
                    <div className="outfit-title">
                      {outfit?.topwear?.name || "Outfit"}
                    </div>

                    <div className="outfit-tags">
                      {`${outfit?.topwear?.tags || ""} • ${outfit?.bottomwear?.tags || ""}`}
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS (EMOJIS) */}
                <div className="action-row">
                  <button className="action action-skip" onClick={handleSkip}>⏭️</button>
                  <button className="action action-like" onClick={handleLike}>❤️</button>
                </div>
              </div>
            </div>

            {notification && <div className="notif-popup">{notification}</div>}
          </section>

          <aside className="right-panel">
            <div className="panel glass how-panel">
              <h4>How it Works</h4>
              <ul>
                <li>Swipe up to save outfits you love</li>
                <li>Swipe down to skip outfits</li>
                <li>Liked outfits saved to favorites</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
