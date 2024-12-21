//=========================================================================================================
// TopBar component
//=========================================================================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TopBar.css';

const TopBar = ({ title, user }) => {
  const navigate = useNavigate();
  const [overlayVisible, setOverlayVisible] = useState(false);

  // Default avatar path
  const defaultAvatar = "/images/default_avatar.png"; 

  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  let avatarSrc = defaultAvatar;
  if (user?.avatarPicture && user.avatarPicture.trim() !== '') {
    // If avatarPicture starts with '/uploads', prepend API_BASE_URL
    if (user.avatarPicture.startsWith('/uploads')) {
      avatarSrc = `${API_BASE_URL}${user.avatarPicture}`;
    } else {
      avatarSrc = user.avatarPicture;
    }
  }

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="top-bar">
      <h2 className="top-bar-title">{title}</h2>
      <img
        src={avatarSrc}
        alt="Avatar"
        className="top-bar-avatar"
        onClick={toggleOverlay}
      />
      {overlayVisible && (
        <div className="top-bar-overlay">
          <button onClick={() => navigate('/profile')}>Profile</button>
          <button onClick={() => navigate('/settings')}>Settings</button>
          <button onClick={() => navigate('/help')}>Help</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
};

export default TopBar;