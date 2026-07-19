import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { removeBackground } from "@imgly/background-removal";
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

  async function resizeImage(file, maxSize = 1024) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to resize image."));
              return;
            }
            resolve(
              new File(
                [blob],
                file.name,
                {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                }
              )
            );
          },
          "image/jpeg",
          0.9
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  async function handleOverlayAdd(itemData) {
    if (!uploaded?.file) return;

    try {
      // Resize image
      console.log("Resizing image...");
      const resizedFile = await resizeImage(uploaded.file);

      // Remove background
      console.log("Background removal...");   
      const blob = await removeBackground(uploaded.file);

      // Convert to PNG File
      const processedFile = new File(
        [blob],
        uploaded.file.name.replace(/\.[^/.]+$/, "") + ".png",
        {
          type: "image/png",
        }
      );

      console.log("Background removed.");

      const formData = new FormData();
      formData.append("image", processedFile);
      formData.append("userId", USER);

      console.log("Uploading...");

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
              <p>Place the clothing on a plain, contrasting surface and avoid including your hands in the frame.</p>
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
