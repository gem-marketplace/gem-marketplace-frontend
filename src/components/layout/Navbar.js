import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate('/dashboard')}>
          <span className="logo-icon">💎</span>
          <span className="logo-text">Gemstone Exchange</span>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <button onClick={() => navigate('/dashboard')} className="nav-link">
            Dashboard
          </button>
          
          {user?.role === 'seller' || user?.role === 'collector' ? (
            <>
              <button onClick={() => navigate('/my-gems')} className="nav-link">
                My Gems
              </button>
              <button onClick={() => navigate('/add-gem')} className="nav-link">
                Add Gem
              </button>
            </>
          ) : null}
          
          {user?.role === 'buyer' ? (
            <>
              <button onClick={() => navigate('/marketplace')} className="nav-link">
                Marketplace
              </button>
              <button onClick={() => navigate('/watchlist')} className="nav-link">
                Watchlist
              </button>
            </>
          ) : null}
          
          {user?.role === 'admin' ? (
            <>
              <button onClick={() => navigate('/pending-gems')} className="nav-link">
                Pending Gems
              </button>
              <button onClick={() => navigate('/all-users')} className="nav-link">
                Users
              </button>
            </>
          ) : null}
        </div>

        {/* User Menu */}
        <div className="navbar-user">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;