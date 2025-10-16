import React from 'react';
import { logoutUser } from '../services/auth.js';
import { LogOut, User } from 'lucide-react';

const Header = ({ user, onLogout }) => {
  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      onLogout();
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">
            <span className="app-icon">🐦</span>
            简易版 X
          </h1>
        </div>

        {user && (
          <div className="header-right">
            <div className="user-info">
              <User size={20} />
              <span className="username">{user.displayName}</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              <LogOut size={18} />
              退出
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
