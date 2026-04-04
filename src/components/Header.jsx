import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { HiOutlineBell, HiOutlineSun, HiOutlineMoon, HiOutlineMenu } from 'react-icons/hi';
import { FiUser, FiSettings, FiLogOut, FiShield, FiStar } from 'react-icons/fi';
import { DEFAULT_AVATAR } from '../utils/constants';
import './Header.css';

const Header = ({ onToggleSidebar }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (!currentUser) return null;

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="mobile-menu-btn" onClick={onToggleSidebar}>
          <HiOutlineMenu />
        </button>
        <Link to="/dashboard" className="header-brand">
          <span className="header-brand-icon">💜</span>
          MoodLink
        </Link>
      </div>

      <div className="header-actions">
        <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <HiOutlineSun /> : <HiOutlineMoon />}
        </button>

        <button className="header-notification-btn" onClick={() => navigate('/notifications')} title="Notifications">
          <HiOutlineBell />
          {unreadCount > 0 && (
            <span className="notification-badge-count">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </button>

        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button className="header-profile-btn" onClick={() => setShowDropdown(!showDropdown)}>
            <img src={userProfile?.photoURL || DEFAULT_AVATAR} alt="Profile" />
            <span className="header-profile-name">{userProfile?.displayName || 'User'}</span>
          </button>

          {showDropdown && (
            <div className="header-dropdown">
              <button className="header-dropdown-item" onClick={() => { navigate('/profile'); setShowDropdown(false); }}>
                <FiUser /> My Profile
              </button>
              <button className="header-dropdown-item" onClick={() => { navigate('/settings'); setShowDropdown(false); }}>
                <FiSettings /> Settings
              </button>
              <button className="header-dropdown-item" onClick={() => { navigate('/premium'); setShowDropdown(false); }}>
                <FiStar /> Premium
              </button>
              {userProfile?.isAdmin && (
                <button className="header-dropdown-item" onClick={() => { navigate('/admin'); setShowDropdown(false); }}>
                  <FiShield /> Admin Panel
                </button>
              )}
              <div className="header-dropdown-divider" />
              <button className="header-dropdown-item danger" onClick={handleLogout}>
                <FiLogOut /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
