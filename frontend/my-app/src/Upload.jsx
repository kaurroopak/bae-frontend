import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Upload.css';
import UploadOverlay from './UploadOverlay.jsx';
import logo from './images/logo.jpg';

const BACKEND_BASE = "https://bae-bringing-aesthetics-to-emotions.onrender.com";

export default function Upload() {
  const fileInputRef = useRef(null);
  const [uploaded, setUploaded] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [predictedCategory, setPredictedCategory] = useState("");

  const USER = localStorage.getItem("userEmail");

  useEffect(() => {
    return () => {
      if (uploaded?.preview) URL.revokeObjectURL(uploaded.preview);
    };
  }, [uploaded]);

  function openFilePicker() { fileInputRef.current?.click(); }
  function onInputChange(e) { handleFiles(e.target.files); }
  function onDrop(e) { e.preventDefault(); handleFiles(e.dataTransfer.files); }
  function onDragOver(e) { e.preventDefault(); }

  function handleFiles(files) {
    if (!files || files.length === 0) return;

    const file = files[0];
    const preview = URL.createObjectURL(file);

    setUploaded({
      file,
      preview,
    });

    setPredictedCategory("");
    setShowOverlay(true);
  }

  async function handleOverlayAdd(itemData) {
    if (!uploaded?.file) return;

    try {
      const formData = new FormData();

      formData.append("image", uploaded.file);
      formData.append("userId", USER);

      const res = await fetch(`${BACKEND_BASE}/wardrobe/add`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setShowOverlay(false);

      if (uploaded.preview) {
        URL.revokeObjectURL(uploaded.preview);
      }

      setUploaded(null);
      setPredictedCategory("");

      alert(
        `Item uploaded successfully!\nCategory: ${data.predicted_category}`
      );

    } catch (err) {
      console.error(err);
      alert("Error uploading item: " + err.message);
    }
  }

  return (
    <div className="upload-root">
      <div className="page-grad" />
      <div className="upload-inner">
        <aside className="upload-sidebar">
          <div className="brand">
            <img src={logo} alt="BAE Logo" className="brand-logo" />
          </div>
          <nav className="menu">
            <Link to="/dashboard" className="menu-item">Dashboard</Link>
            <Link to="/wardrobe" className="menu-item">Wardrobe</Link>
            <Link to="/favorites" className="menu-item">Favorites</Link>
            <Link to="/generator" className="menu-item">Outfit Generator</Link>
            <Link to="/upload" className="menu-item active">Upload Clothes</Link>
          </nav>
          <Link to="/profile" className="guest">
            <div className="guest-meta">
              <div className="guest-name">{localStorage.getItem("userName") || "Guest User"}</div>
              <div className="guest-link">View Profile</div>
            </div>
          </Link>
        </aside>

        <main className="upload-main">
          <div className="page-header">
            <h1>Upload Clothes</h1>
            <p className="lead">Add new items to your wardrobe</p>
          </div>

          <section className="drop-area">
            <div className="drop-card" onDrop={onDrop} onDragOver={onDragOver}>
              <div className="drop-inner">
                <div className="upload-icon" />
                <h2>Drop your images here</h2>
                <p className="muted">or click to browse from your computer</p>
                <button className="choose-btn" onClick={openFilePicker}>Choose Files</button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={onInputChange}
                />
              </div>
            </div>

            <div className="pro-tip">
              <h4>Pro Tip</h4>
              <p>Take photos against a plain background for best results with auto background removal</p>
            </div>
          </section>
        </main>
      </div>

      <div className="bg-lines" />

      {showOverlay && uploaded && (
        <UploadOverlay
          file={uploaded}
          predictedCategory={predictedCategory}
          onClose={() => setShowOverlay(false)}
          onAdd={handleOverlayAdd}
        />
      )}
    </div>
  );
}
