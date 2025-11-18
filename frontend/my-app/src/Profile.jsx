import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const BACKEND_BASE = "http://127.0.0.1:5000"; // Replace with VITE_API_URL in production

const Profile = () => {
  const navigate = useNavigate();
  const [isEditable, setIsEditable] = useState(false);
  const [fullName, setFullName] = useState("Guest User");
  const [email, setEmail] = useState("guest@stylehub.com");
  const [saveFlash, setSaveFlash] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    if (storedName) setFullName(storedName);
    if (storedEmail) setEmail(storedEmail);

    if (storedEmail) {
      fetch(`${BACKEND_BASE}/get_profile?email=${encodeURIComponent(storedEmail)}`)
        .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
          if (ok && data.user) {
            setFullName(data.user.username || fullName);
            setEmail(data.user.email || storedEmail);
            try {
              localStorage.setItem("userName", data.user.username || fullName);
              localStorage.setItem("userEmail", data.user.email || storedEmail);
            } catch (e) {}
          }
        })
        .catch((err) => console.warn("Could not fetch fresh profile:", err));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleEditClick = async () => {
    if (isEditable) {
      try {
        const response = await fetch(`${BACKEND_BASE}/update_profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username: fullName }),
        });
        const data = await response.json();
        alert(data.message || (data.success ? "Profile updated" : "Update failed"));

        if (response.ok && data.success) {
          try { localStorage.setItem("userName", fullName); } catch (e) {}
          setSaveFlash(true);
          setTimeout(() => setSaveFlash(false), 500);
        }
      } catch (err) {
        console.error("Update profile error:", err);
        alert("Could not update profile. Try again later.");
      }
    }
    setIsEditable(!isEditable);
  };

  const handleBackClick = () => navigate("/dashboard");

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("Please fill all password fields");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_BASE}/update_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, current_password: currentPassword, new_password: newPassword }),
      });
      const data = await response.json();
      alert(data.message || (data.success ? "Password changed" : "Change failed"));

      if (response.ok && data.success) {
        setCurrentPassword(""); setNewPassword(""); setConfirmNewPassword("");
      }
    } catch (err) {
      console.error("Change password error:", err);
      alert("Could not change password. Try again later.");
    }
  };

  const handleDeleteProfile = async () => {
    const confirmed = window.confirm("Are you sure you want to permanently delete your profile? This cannot be undone.");
    if (!confirmed) return;

    const pw = prompt("Please enter your password to confirm deletion:");
    if (!pw) { alert("Deletion cancelled"); return; }

    try {
      const response = await fetch(`${BACKEND_BASE}/delete_profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw }),
      });
      const data = await response.json();
      alert(data.message || (data.success ? "Deleted" : "Delete failed"));

      if (response.ok && data.success) {
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        navigate("/");
      }
    } catch (err) {
      console.error("Delete profile error:", err);
      alert("Could not delete profile. Try again later.");
    }
  };

  return (
    <div className="profile-bg">
      <button className="back-dashboard-btn" onClick={handleBackClick}>← Dashboard</button>

      <div className="profile-center-wrapper">
        <div className={`profile-container ${saveFlash ? "save-flash" : ""}`}>
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                <svg height="48" width="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="#FFFFFF" opacity="0.2" />
                  <path d="M24 30c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4zM24 27c3 0 5.5-2.5 5.5-5.5S27 16 24 16s-5.5 2.5-5.5 5.5S21 27 24 27z" fill="#fff" opacity="0.7"/>
                </svg>
              </div>
              <div className="profile-text">
                <div className="profile-username">{fullName}</div>
                <div className="profile-role">Fashion Enthusiast</div>
              </div>
            </div>

            <button className="profile-edit-btn" onClick={handleEditClick}>{isEditable ? "Save" : "Edit Profile"}</button>
          </div>

          <div className="profile-fields">
            <div className="profile-row">
              <div className="profile-label">FULL NAME</div>
              <input className="profile-input" type="text" value={fullName} readOnly={!isEditable} onChange={(e) => setFullName(e.target.value)} />
            </div>

            <div className="profile-row">
              <div className="profile-label">EMAIL ADDRESS</div>
              <input className="profile-input" type="email" value={email} readOnly />
            </div>
          </div>
        </div>

        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                <svg width="28" height="28" fill="none">
                  <circle cx="14" cy="14" r="14" fill="#fff" opacity="0.12" />
                  <path d="M14 9a4 4 0 110 8 4 4 0 010-8zm0 12c-3.314 0-6-2.686-6-6h2a4 4 0 008 0h2c0 3.314-2.686 6-6 6z" fill="#fff" opacity="0.36"/>
                </svg>
              </div>
              <div className="profile-text">
                <div className="profile-username">Account Settings</div>
                <div className="profile-role">Manage your account</div>
              </div>
            </div>
          </div>

          <div className="profile-fields">
            <div className="profile-row">
              <div className="profile-label">Current Password</div>
              <input className="profile-input" type="password" placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>

            <div className="profile-row">
              <div className="profile-label">New Password</div>
              <input className="profile-input" type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>

            <div className="profile-row">
              <div className="profile-label">Confirm New Password</div>
              <input className="profile-input" type="password" placeholder="Confirm new password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
            </div>

            <div className="profile-row">
              <button className="btn" onClick={handleChangePassword}>Change Password</button>
            </div>

            <div className="profile-row">
              <button className="delete-profile-btn" onClick={handleDeleteProfile}>Delete Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
