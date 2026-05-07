import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { socialAPI } from '../utils/api';
import { MOODS, COMMUNICATION_MODES, DEFAULT_AVATAR } from '../utils/constants';
import { HiOutlineChat, HiOutlineHeart, HiOutlineX, HiOutlineFlag, HiOutlineBan, HiOutlinePhone, HiOutlineVideoCamera } from 'react-icons/hi';
import { FiMessageCircle, FiStar, FiUserPlus, FiUserCheck } from 'react-icons/fi';
import './UserCard.css';

const UserCard = ({ user, onLike, onSkip, onBlock, onReport, onConnect }) => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const mood = MOODS.find(m => m.id === user.mood);
  const commMode = COMMUNICATION_MODES.find(m => m.id === user.communicationMode);

  const [connectState, setConnectState] = useState(
    userProfile?.connections?.includes(user.uid) ? 'connected' : null
  );
  const [followState, setFollowState] = useState(
    userProfile?.following?.includes(user.uid) ? 'following' : null
  );

  const handleConnect = async () => {
    if (connectState) return;
    setConnectState('sending');
    try {
      await socialAPI.sendFriendRequest(user.uid);
      setConnectState('sent');
    } catch (err) {
      alert(err.message || 'Failed to send request');
      setConnectState(null);
    }
  };

  const handleFollow = async () => {
    if (followState === 'following') {
      // Unfollow
      try {
        await socialAPI.unfollowUser(user.uid);
        setFollowState(null);
      } catch (err) {
        alert(err.message || 'Failed to unfollow');
      }
      return;
    }

    if (followState) return;
    setFollowState('sending');
    try {
      const result = await socialAPI.followUser(user.uid);
      if (result.status === 'pending') {
        setFollowState('pending');
      } else {
        setFollowState('following');
      }
    } catch (err) {
      alert(err.message || 'Failed to follow');
      setFollowState(null);
    }
  };

  const getConnectBtn = () => {
    switch (connectState) {
      case 'connected':
        return <button className="user-card-action-btn connect" style={{ background: 'rgba(0,184,148,0.2)', color: '#00b894' }} title="Connected"><FiUserCheck /></button>;
      case 'sending':
        return <button className="user-card-action-btn connect" disabled title="Sending..."><FiUserPlus /></button>;
      case 'sent':
        return <button className="user-card-action-btn connect" style={{ background: 'rgba(253,203,110,0.2)', color: '#e17055' }} title="Request Sent"><FiUserPlus /></button>;
      default:
        return <button className="user-card-action-btn connect" onClick={handleConnect} title="Send Friend Request"><FiUserPlus /></button>;
    }
  };

  const getFollowBtn = () => {
    switch (followState) {
      case 'following':
        return <button className="user-card-action-btn like" onClick={handleFollow} style={{ background: 'rgba(232,67,147,0.2)', color: '#e84393' }} title="Following (click to unfollow)"><HiOutlineHeart /></button>;
      case 'pending':
        return <button className="user-card-action-btn like" style={{ background: 'rgba(253,203,110,0.2)', color: '#e17055' }} title="Follow Pending"><HiOutlineHeart /></button>;
      case 'sending':
        return <button className="user-card-action-btn like" disabled title="Sending..."><HiOutlineHeart /></button>;
      default:
        return <button className="user-card-action-btn like" onClick={handleFollow} title="Follow"><HiOutlineHeart /></button>;
    }
  };

  return (
    <div className="user-card">
      <div className="user-card-header" style={{ background: mood ? `linear-gradient(135deg, ${mood.color}80, ${mood.color}30)` : 'var(--gradient-primary)' }} />

      {user.isPremium && (
        <div className="user-card-premium-badge">
          <span className="badge badge-premium"><FiStar /> Premium</span>
        </div>
      )}

      <div className="user-card-avatar-wrapper">
        <img className="user-card-avatar" src={user.photoURL || DEFAULT_AVATAR} alt={user.displayName} />
        <div className={`user-card-online-dot ${user.isOnline ? 'online' : 'offline'}`} />
      </div>

      <div className="user-card-body">
        <h3 className="user-card-name">
          {user.displayName}
          {user.isPremium && <FiStar style={{ color: '#F5576C', fontSize: '0.9rem' }} />}
        </h3>
        <p className="user-card-username">@{user.username}</p>

        {mood && (
          <div className="user-card-mood" style={{ background: `${mood.color}20`, color: mood.color }}>
            {mood.emoji} {mood.label}
          </div>
        )}

        <div className="user-card-info">
          <span className="user-card-info-item">{user.age} yrs</span>
          <span className="user-card-info-item">•</span>
          <span className="user-card-info-item" style={{ textTransform: 'capitalize' }}>{user.gender}</span>
          {user.city && user.privacy?.location !== 'hidden' && (
            <>
              <span className="user-card-info-item">•</span>
              <span className="user-card-info-item">📍 {user.city}</span>
            </>
          )}
        </div>

        {commMode && (
          <div className="user-card-comm-mode">
            {commMode.icon} {commMode.label}
          </div>
        )}

        {user.interests && user.interests.length > 0 && (
          <div className="user-card-interests">
            {user.interests.slice(0, 4).map(interest => (
              <span key={interest} className="user-card-interest-tag">{interest}</span>
            ))}
            {user.interests.length > 4 && (
              <span className="user-card-interest-tag">+{user.interests.length - 4}</span>
            )}
          </div>
        )}

        <div className="user-card-actions">
          <button className="user-card-action-btn skip" onClick={() => onSkip?.(user.uid)} title="Skip">
            <HiOutlineX />
          </button>
          {getFollowBtn()}
          {getConnectBtn()}
          <button className="user-card-action-btn chat" onClick={() => navigate(`/chat/${user.uid}`)} title="Chat">
            <HiOutlineChat />
          </button>
          <button className="user-card-action-btn danger" onClick={() => onReport?.(user)} title="Report">
            <HiOutlineFlag />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
