import React from "react";
import "./BAELanding.css";
import { Link } from "react-router-dom";
import logo from './images/logo.jpg'; // ✅ make sure this path exists

const introParagraph = `Your wardrobe deserves more than storage, it deserves personality.
BAE brings your style, mood, and outfits together in one seamless, uplifting experience.
Curate looks you love with effortless swipes and a touch of elegance.`;

const BAELanding = () => (
  <div className="bae-landing-bg">
    <div className="bae-landing-container">

      {/* Left Side */}
      <div className="bae-landing-left">
        <img src={logo} alt="BAE Logo" className="bae-logo-mark" />
        <h1 className="bae-title">BAE</h1>
        <h2 className="bae-tagline">Bringing Aesthetics to Emotions</h2>
      </div>

      {/* Right Side */}
      <div className="bae-landing-right">
        <div className="bae-intro-inner">
          <p className="bae-paragraph">{introParagraph}</p>

          {/* ✅ Link to Login page */}
          <Link to="/login" className="bae-primary-btn">
            Get Started <span className="bae-arrow">→</span>
          </Link>

        </div>
      </div>
    </div>
  </div>
);

export default BAELanding;
