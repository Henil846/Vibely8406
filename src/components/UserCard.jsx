import { useNavigate } from 'react-router-dom';
import { MOODS, COMMUNICATION_MODES, DEFAULT_AVATAR } from '../utils/constants';
import { HiOutlineChat, HiOutlineHeart, HiOutlineX, HiOutlineFlag, HiOutlineBan, HiOutlinePhone, HiOutlineVideoCamera } from 'react-icons/hi';
import { FiMessageCircle, FiStar } from 'react-icons/fi';
import './UserCard.css';

const UserCard = ({ user, onLike, onSkip, onBlock, onReport, onConnect }) => {
  const navigate = useNavigate();
  const mood = MOODS.find(m => m.id === user.mood);
  const commMode = COMMUNICATION_MODES.find(m => m.id === user.communicationMode);

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
          <button className="user-card-action-btn like" onClick={() => onLike?.(user.uid)} title="Like">
            <HiOutlineHeart />
          </button>
          <button className="user-card-action-btn connect" onClick={() => onConnect?.(user)} title="Connect">
            <FiMessageCircle />
          </button>
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
