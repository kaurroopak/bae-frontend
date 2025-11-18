import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginScreen.css';
import WelcomeFrame from './WelcomeFrame';
import LoginForm from './components/LoginForm';
import BackgroundLines from './components/BackgroundLines';
import logo from './images/logo.jpg';

export default function LoginScreen() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

  const handleLogin = async (values) => {
    const { email, password } = values;

    if (!email || !password) {
      alert('Please fill in both fields');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      alert(data.message || (data.success ? 'Login successful' : 'Login failed'));

      if (response.ok && data.success) {
        const name = data.full_name || data.user?.username || '';
        const mail = data.email || data.user?.email || '';

        try {
          localStorage.setItem("userName", name);
          localStorage.setItem("userEmail", mail);
          localStorage.setItem("justLoggedIn", "true");
        } catch (e) {
          console.warn("Could not write to localStorage", e);
        }

        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error connecting to backend. Make sure backend is deployed and accessible.");
    }
  };

  return (
    <div className="login-bg">
      <BackgroundLines />
      <div className="login-card" role="main" aria-label="Login">
        <div className="card-inner">
          <img src={logo} alt="BAE logo" className="center-logo" />
          <WelcomeFrame />
          <LoginForm onSubmit={handleLogin} />
        </div>
      </div>
    </div>
  );
}
