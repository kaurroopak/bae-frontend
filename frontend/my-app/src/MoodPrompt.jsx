import React, { useRef, useState, useEffect } from 'react';
import './MoodPrompt.css';
import { setMood } from "./moodTheme.js";

export default function MoodPrompt({ onAutoDetect, onManual, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  async function startCamera() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.muted = true;
        await videoRef.current.play().catch(() => {});
      }

      setStream(s);
      setCameraActive(true);
      setErrorMsg('');
    } catch (err) {
      console.error('Camera Error:', err);
      setErrorMsg('Camera Blocked or Unavailable');
      alert('Please allow webcam access in your browser settings.');
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    setStream(null);
    setCameraActive(false);
  }

  function fallbackMood() {
    return 'neutral';
  }

  async function captureAndSend() {
    if (!videoRef.current || !canvasRef.current) return;

    setProcessing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 224, 224);

    const base64 = canvas.toDataURL('image/jpeg', 0.9);

    try {
      const res = await fetch(
        'https://bae-bringing-aesthetics-to-emotions.onrender.com/predict',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        }
      );

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      console.log('Server Response:', data);

      const mood = data?.mood || fallbackMood();
      setMood(mood);
      onAutoDetect?.(mood);
    } catch (err) {
      console.error('Error connecting to backend:', err);
      const mood = fallbackMood();
      setMood(mood);
      onAutoDetect?.(mood);
    } finally {
      stopCamera();
      setProcessing(false);
      onClose?.();
    }
  }

  function handleManualMoodSelection(mood) {
    setMood(mood);
    onAutoDetect?.(mood);
    onClose?.();
  }

  return (
    <div className="mood-backdrop">
      <div className="mood-panel">
        <h3>Detect Your Mood</h3>

        <video ref={videoRef} className="mood-video" autoPlay playsInline muted />

        <div className="camera-actions">
          <button className="btn" onClick={captureAndSend} disabled={processing}>
            {processing ? 'Analyzing...' : 'Capture & Detect'}
          </button>
          <button className="btn" onClick={stopCamera}>Cancel</button>
        </div>

        <div className="manual-selection" style={{ marginTop: '16px' }}>
          <p>Or choose your mood manually:</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '8px' }}>
            <button className="btn manual" onClick={() => handleManualMoodSelection('happy')}>Happy</button>
            <button className="btn manual" onClick={() => handleManualMoodSelection('neutral')}>Neutral</button>
            <button className="btn manual" onClick={() => handleManualMoodSelection('sad')}>Sad</button>
          </div>
        </div>

        <button className="close-x" onClick={onClose}>✖</button>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {errorMsg && <p className="error-text">{errorMsg}</p>}
      </div>
    </div>
  );
}
