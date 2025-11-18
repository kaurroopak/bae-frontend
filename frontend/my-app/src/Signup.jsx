import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import logo from './images/logo.jpg';

const BACKEND_BASE = "https://bae-bringing-aesthetics-to-emotions.onrender.com";

export default function SignupScreen() {
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      const response = await fetch(`${BACKEND_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        navigate('/');
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Error connecting to backend. Make sure the backend is running.");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card centered">
        <div className="card-inner">
          <img src={logo} alt="BAE logo" className="center-logo" />
          <h1 className="title">Create Account</h1>
          <p className="subtitle">
            Join BAE and experience emotion-driven design 💜
          </p>

          <form className="form" onSubmit={handleSignup}>
            <div className="field">
              <label className="label-text">Name</label>
              <input
                type="text"
                className="input"
                placeholder="Your Name"
                required
              />
            </div>

            <div className="field">
              <label className="label-text">Email</label>
              <input
                type="email"
                className="input"
                placeholder="Your Email"
                required
              />
            </div>

            <div className="field">
              <label className="label-text">Password</label>
              <input
                type="password"
                className="input"
                placeholder="Password"
                required
              />
            </div>

            <button type="submit" className="btn">
              Sign Up
            </button>

            <div className="signup">
              Already have an account?
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
                className="link"
              >
                &nbsp;Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
