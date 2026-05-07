import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { MOODS } from '../utils/constants';
import MoodSelector from './MoodSelector';
import {
  HiOutlineHome, HiOutlineSearch, HiOutlineChatAlt2, HiOutlinePhone,
  HiOutlineUser, HiOutlineCog, HiOutlineStar, HiOutlineBell,
  HiOutlineShieldCheck, HiOutlineHeart, HiOutlineUserGroup
} from 'react-icons/hi';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { userProfile, updateUserProfile } = useAuth();
  const { unreadCount } = useNotifications();
  const [showMoodPicker, setShowMoodPicker] = useState(false);

  const currentMood = MOODS.find(m => m.id === userProfile?.mood);

  const handleMoodChange = async (moodId) => {
    await updateUserProfile({ mood: moodId });
    setShowMoodPicker(false);
  };

  const mainLinks = [
    { to: '/dashboard', icon: <HiOutlineHome />, label: 'Dashboard' },
    { to: '/discover', icon: <HiOutlineSearch />, label: 'Discover' },
    { to: '/friends', icon: <HiOutlineUserGroup />, label: 'Friends' },
    { to: '/matches', icon: <HiOutlineHeart />, label: 'Matches' },
    { to: '/chats', icon: <HiOutlineChatAlt2 />, label: 'Messages' },
    { to: '/calls', icon: <HiOutlinePhone />, label: 'Calls' },
  ];

  const secondaryLinks = [
    { to: '/profile', icon: <HiOutlineUser />, label: 'Profile' },
    { to: '/notifications', icon: <HiOutlineBell />, label: 'Notifications', badge: unreadCount },
    { to: '/premium', icon: <HiOutlineStar />, label: 'Premium' },
    { to: '/settings', icon: <HiOutlineCog />, label: 'Settings' },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {currentMood && (
          <div className="sidebar-mood-indicator">
            <div className="sidebar-mood-emoji">{currentMood.emoji}</div>
            <div className="sidebar-mood-label">Feeling {currentMood.label}</div>
            <button className="sidebar-mood-change" onClick={() => setShowMoodPicker(!showMoodPicker)}>
              {showMoodPicker ? 'Close' : 'Change mood'}
            </button>
          </div>
        )}

        {!currentMood && !showMoodPicker && (
          <div className="sidebar-mood-indicator">
            <div className="sidebar-mood-emoji">🎭</div>
            <div className="sidebar-mood-label">No mood set</div>
            <button className="sidebar-mood-change" onClick={() => setShowMoodPicker(true)}>
              Set mood
            </button>
          </div>
        )}

        {showMoodPicker && (
          <div className="sidebar-mood-picker">
            <MoodSelector selectedMood={userProfile?.mood} onSelect={handleMoodChange} compact />
          </div>
        )}

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Main</div>
          {mainLinks.map(link => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <span className="sidebar-link-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}

          <div className="sidebar-section-title">Account</div>
          {secondaryLinks.map(link => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <span className="sidebar-link-icon">{link.icon}</span>
              {link.label}
              {link.badge > 0 && <span className="sidebar-link-badge">{link.badge}</span>}
            </NavLink>
          ))}

          {userProfile?.isAdmin && (
            <>
              <div className="sidebar-section-title">Admin</div>
              <NavLink to="/admin" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
                <span className="sidebar-link-icon"><HiOutlineShieldCheck /></span>
                Admin Panel
              </NavLink>
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
