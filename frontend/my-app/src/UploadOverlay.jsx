import React, { useState, useEffect } from 'react';
import './UploadOverlay.css';

export default function UploadOverlay({ file, predictedCategory, mood, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [usage, setUsage] = useState('');
  const [gender, setGender] = useState('');
  const [color, setColor] = useState('');
  const [season, setSeason] = useState('');

  // Autofill usage from prediction but allow manual override
  useEffect(() => {
    if (predictedCategory) setUsage(predictedCategory);
  }, [predictedCategory]);

  // Update overlay background based on mood
  useEffect(() => {
    if (mood) {
      const panel = document.querySelector('.overlay-panel');
      switch (mood) {
        case 'happy':
          panel.style.setProperty('--bg', 'linear-gradient(135deg, #FFE4B2, #FF8C7E)');
          break;
        case 'neutral':
          panel.style.setProperty('--bg', 'linear-gradient(135deg, #E6D5B8, #B89D7F)');
          break;
        case 'sad':
          panel.style.setProperty('--bg', 'linear-gradient(135deg, #89F7FE, #66A6FF)');
          break;
        default:
          panel.style.setProperty('--bg', 'linear-gradient(135deg, #FFFFFF, #EEEEEE)');
      }
    }
  }, [mood]);

  function submit(e) {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      usage: usage || predictedCategory,
      gender,
      color,
      season,
    };
    onAdd(payload);
  }

  return (
    <div className="upload-overlay-backdrop" role="dialog" aria-modal="true">
      <div className="overlay-panel">
        {/* HEADER */}
        <div className="overlay-header">
          <h3>Item Details</h3>
          <button className="overlay-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* IMAGE PREVIEW */}
        <div className="preview-box">
          <img src={file.preview} alt="Preview" className="preview-img" />
        </div>

        {/* Predicted category pill */}
        {predictedCategory && (
          <div className="predicted-pill">
            Predicted: <span>{predictedCategory}</span>
          </div>
        )}

        {/* FORM */}
        <form className="overlay-form" onSubmit={submit}>
          <div className="row two-cols">
            <div className="field">
              <label className="label">Item Name</label>
              <input
                className="input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Blue Denim Jacket"
              />
            </div>

            <div className="field">
              <label className="label">Usage</label>
              <select
                className="input"
                value={usage}
                onChange={e => setUsage(e.target.value)}
              >
                <option value="">Select Usage</option>
                <option value="Casual">Casual</option>
                <option value="Sports">Sports</option>
                <option value="Formal">Formal</option>
                <option value="Ethnic">Ethnic</option>
              </select>
            </div>
          </div>

          <div className="row two-cols">
            <div className="field">
              <label className="label">Gender</label>
              <select
                className="input"
                value={gender}
                onChange={e => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
            </div>

            <div className="field">
              <label className="label">Season</label>
              <select
                className="input"
                value={season}
                onChange={e => setSeason(e.target.value)}
              >
                <option value="">Select Season</option>
                <option value="Summer">Summer</option>
                <option value="Winter">Winter</option>
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label className="label">Color</label>
            <input
              className="input"
              value={color}
              onChange={e => setColor(e.target.value)}
              placeholder="e.g., Blue"
            />
          </div>

          <div className="overlay-actions">
            <button type="submit" className="add-btn">Add to Wardrobe</button>
          </div>
        </form>
      </div>
    </div>
  );
}
