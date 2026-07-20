import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Favorites.css';
import logo from './images/logo.jpg';

export default function Favorites() {
  const [favs, setFavs] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userEmail");

    if (!userId) {
      console.warn("No user logged in — cannot fetch favourites");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/getFavourites?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setFavs(data.favourites || []);
      })
      .catch((err) => console.error(err));
  }, []);

  async function removeFavourite(id) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/removeFavourite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to remove favourite.");
      }

      setFavs((prev) => prev.filter((item) => item.id !== id));

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <div className="favorites-root">
      <aside className="sidebar">
        <div className="brand">
          <img src={logo} alt="BAE Logo" className="brand-logo" loading="lazy" />
        </div>

        <nav className="nav">
          <Link to="/dashboard" className="nav-btn"><span>Dashboard</span></Link>
          <Link to="/wardrobe" className="nav-btn"><span>Wardrobe</span></Link>
          <Link to="/favorites" className="nav-btn active"><span>Favorites</span></Link>
          <Link to="/generator" className="nav-btn"><span>Outfit Generator</span></Link>
          <Link to="/upload" className="nav-btn"><span>Upload Clothes</span></Link>
        </nav>

        <Link to="/profile" className="profile">
          <div className="profile-meta">
            <div className="profile-name">
              {localStorage.getItem("userName") || "Guest User"}
            </div>
            <div className="profile-link">View Profile</div>
          </div>
        </Link>
      </aside>

      <main className="main-area">
        <div className="main-inner">
          <header className="favorites-header">
            <div className="heading-left">
              <h1>Favorites</h1>
              <p className="sub">{favs.length} favorite outfits saved</p>
            </div>
          </header>

          <section className="cards-grid">
            {favs.map((fav, index) => (
              <article key={index} className="fav-card">
                <div className="card-image">
                  <img src={fav.topwear} alt="Topwear" className="fav-top-image" />
                  <img src={fav.bottomwear} alt="Bottomwear" className="fav-bottom-image" />
                </div>

                <div className="card-body">
                  <div className="card-title">Outfit {index + 1}</div>
                  <div className="card-tags">
                    <span className="pill">2 items</span>
                    <span className="pill">Saved</span>
                  </div>
                  <button
                    className="remove-fav-btn"
                    onClick={() => removeFavourite(fav.id)}
                  > Remove
                  </button>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
