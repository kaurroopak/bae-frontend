import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Wardrobe.css';
import logo from './images/logo.jpg';

// Replace with your Render backend URL
const RENDER_BACKEND_URL = "https://bae-bringing-aesthetics-to-emotions.onrender.com";

export default function Wardrobe() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const USER = localStorage.getItem("userEmail");

  // Fetch wardrobe items
  const fetchWardrobe = async () => {
    try {
      const response = await fetch(`${RENDER_BACKEND_URL}/wardrobe/all?userId=${USER}`);
      const data = await response.json();
      if (response.ok) setItems(data.items);
      else console.error(data.error || "Failed to fetch items");
    } catch (err) {
      console.error("Error fetching wardrobe:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWardrobe(); }, []);

  // Soft delete
  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`${RENDER_BACKEND_URL}/wardrobe/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER, itemId }),
      });
      const data = await res.json();
      if (res.ok) {
        setItems(prev => prev.map(i => i.id === itemId ? { ...i, deleted: true } : i));
      } else {
        alert(data.error || "Failed to delete item");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting item: " + err.message);
    }
  };

  // Permanent delete
  const handlePermanentDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to permanently delete this item?")) return;

    try {
      const res = await axios.post(`${RENDER_BACKEND_URL}/wardrobe/deletePermanent`, {
        userId: USER,
        itemId
      });

      if (res.data.message) {
        alert(res.data.message);
        fetchWardrobe(); // refresh items
      }
    } catch (err) {
      console.error("Permanent delete error:", err);
      alert("Failed to delete item permanently!");
    }
  };

  const filteredItems = items.filter(it => !it.deleted &&
    (selectedCategory === "All" || it.category?.toLowerCase() === selectedCategory.toLowerCase())
  );

  const TAGS = ["All", "Topwear", "Bottomwear"];

  return (
    <div className="dashboard-root">
      <aside className="sidebar">
        <div className="brand">
          <img src={logo} alt="BAE Logo" className="brand-logo" loading="lazy" />
        </div>
        <nav className="nav">
          <Link to="/dashboard" className="nav-btn"><span>Dashboard</span></Link>
          <Link to="/wardrobe" className="nav-btn active"><span>Wardrobe</span></Link>
          <Link to="/favorites" className="nav-btn"><span>Favorites</span></Link>
          <Link to="/generator" className="nav-btn"><span>Outfit Generator</span></Link>
          <Link to="/upload" className="nav-btn"><span>Upload Clothes</span></Link>
          <Link to="/trash" className="trash-link">Trash</Link>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <Link to="/profile" className="profile">
            <div className="profile-meta">
              <div className="profile-name">{localStorage.getItem("userName") || "Guest User"}</div>
              <div className="profile-link">View Profile</div>
            </div>
          </Link>
        </div>
      </aside>

      <main className="main-area">
        <div className="wardrobe-inner">
          <header className="wardrobe-header">
            <div>
              <h2>My Wardrobe</h2>
              <p className="muted">{loading ? "Loading..." : `${filteredItems.length} items`}</p>
            </div>
            <div className="header-actions">
              <button className="btn add" onClick={() => navigate('/upload')}>Add Item</button>
            </div>
          </header>

          <div className="search-row">
            <div className="search-input">
              <input placeholder="Search your wardrobe..." />
            </div>
          </div>

          <div className="tags-row">
            {TAGS.map((t) => (
              <button
                key={t}
                className={`tag ${selectedCategory === t ? "active" : ""}`}
                onClick={() => setSelectedCategory(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid">
            {filteredItems.map((it) => (
              <article className="card" key={it.id}>
                <div className="image" data-category={it.category}>
                  <img src={it.imageUrl} alt={it.category} loading="lazy" />
                </div>
                <div className="card-body">
                  <div className="card-title">{it.title || it.category}</div>
                  <div className="card-meta">{it.category} {it.color ? `• ${it.color}` : ''}</div>
                  <button className="btn delete-btn" onClick={() => handleDelete(it.id)}>Delete</button>
                  <button className="btn delete-btn" onClick={() => handlePermanentDelete(it.id)}>Delete Permanently</button>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="bg-vectors"></div>
      </main>
    </div>
  );
}
