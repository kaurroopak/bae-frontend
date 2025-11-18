import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Trash.css";
import logo from "./images/logo.jpg";

export default function Trash() {
  const [deletedItems, setDeletedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const USER = localStorage.getItem("userEmail");
  const BASE_URL = "https://bae-bringing-aesthetics-to-emotions.onrender.com"; // <-- replace this

  const fetchTrash = async () => {
    try {
      const res = await fetch(`${BASE_URL}/wardrobe/all?userId=${USER}`);
      const data = await res.json();
      if (res.ok) setDeletedItems(data.items.filter(i => i.deleted));
      else console.error(data.error);
    } catch (err) {
      console.error("Error fetching trash:", err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTrash(); }, []);

  const handleRestore = async (itemId) => {
    try {
      const res = await fetch(`${BASE_URL}/wardrobe/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER, itemId }),
      });
      const data = await res.json();
      if (res.ok) fetchTrash();
      else alert(data.error || "Failed to restore item");
    } catch (err) {
      console.error(err);
      alert("Error restoring item: " + err.message);
    }
  };

  const handlePermanentDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to permanently delete this item?")) return;
    try {
      const res = await axios.post(`${BASE_URL}/wardrobe/deletePermanent`, {
        userId: USER,
        itemId
      });
      if (res.data.message) {
        alert(res.data.message);
        fetchTrash();
      }
    } catch (err) {
      console.error("Permanent delete error:", err);
      alert("Failed to delete item permanently");
    }
  };

  const filteredItems = deletedItems.filter(it => filter === "All" || it.category === filter);

  return (
    <div className="wardrobe-page-root">
      <aside className="sidebar">
        <div className="brand"><img src={logo} alt="BAE Logo" className="brand-logo" /></div>
        <nav className="nav">
          <Link to="/dashboard" className="nav-btn"><span>Dashboard</span></Link>
          <Link to="/wardrobe" className="nav-btn"><span>Wardrobe</span></Link>
          <Link to="/favorites" className="nav-btn"><span>Favorites</span></Link>
          <Link to="/generator" className="nav-btn"><span>Outfit Generator</span></Link>
          <Link to="/upload" className="nav-btn"><span>Upload Clothes</span></Link>
          <Link to="/trash" className="nav-btn active"><span>Trash</span></Link>
        </nav>
        <div style={{ marginTop: "auto" }}>
          <Link to="/profile" className="profile">
            <div className="profile-meta">
              <div className="profile-name">{localStorage.getItem("userName") || "Guest User"}</div>
              <div className="profile-link">View Profile</div>
            </div>
          </Link>
        </div>
      </aside>

      <main className="wardrobe-main">
        <div className="wardrobe-inner">
          <header className="wardrobe-header">
            <h2>Trash</h2>
            <p className="muted">{loading ? "Loading..." : `${deletedItems.length} deleted items`}</p>
          </header>

          <div className="tags-row">
            {["All", "Topwear", "Bottomwear"].map(t => (
              <button key={t} className={`tag ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>{t}</button>
            ))}
          </div>

          <div className="grid">
            {filteredItems.length === 0
              ? <p style={{ color: "#fff" }}>No items found in this filter.</p>
              : filteredItems.map(it => (
                  <article className="card" key={it.id}>
                    <div className="image" data-category={it.category}>
                      <img src={it.imageUrl} alt={it.title} loading="lazy" />
                    </div>
                    <div className="card-body">
                      <div className="card-title">{it.title || it.category}</div>
                      <div className="card-meta">{it.category} {it.color ? `• ${it.color}` : ""}</div>
                      <button className="restore-btn" onClick={() => handleRestore(it.id)}>Restore</button>
                      <button className="delete-btn" onClick={() => handlePermanentDelete(it.id)}>Delete Permanently</button>
                    </div>
                  </article>
              ))
            }
          </div>
        </div>
      </main>
    </div>
  );
}
