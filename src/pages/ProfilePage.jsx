import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MOODS, DEFAULT_AVATAR } from '../utils/constants';
import { FiEdit2, FiSettings, FiStar, FiShield } from 'react-icons/fi';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import './Profile.css';

const ProfilePage = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const mood = MOODS.find(m => m.id === userProfile?.mood);

  if (!userProfile) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="profile-page animate-fadeIn">
      <div className="profile-cover" style={{ background: mood ? `linear-gradient(135deg, ${mood.color}60, var(--primary))` : 'var(--gradient-primary)' }}>
        <div className="profile-cover-gradient" />
      </div>

      <div className="profile-main">
        <div className="profile-avatar-section">
          <img className="profile-avatar-large" src={userProfile.photoURL || DEFAULT_AVATAR} alt={userProfile.displayName} />
          <div className="profile-online-indicator" style={{ background: userProfile.isOnline ? 'var(--accent-green)' : 'var(--text-tertiary)', boxShadow: userProfile.isOnline ? '0 0 10px rgba(0,184,148,0.5)' : 'none' }} />
        </div>

        <h1 className="profile-name">
          {userProfile.displayName}
          {userProfile.isPremium && <span className="badge badge-premium"><FiStar /> Premium</span>}
        </h1>
        <p className="profile-username">@{userProfile.username}</p>

        {mood && (
          <div className="profile-mood-badge" style={{ background: `${mood.color}20`, color: mood.color }}>
            {mood.emoji} Feeling {mood.label}
          </div>
        )}

        {userProfile.bio && <p className="profile-bio">{userProfile.bio}</p>}

        <div className="profile-info-grid">
          <div className="profile-info-item">
            <div className="profile-info-value">{userProfile.age}</div>
            <div className="profile-info-label">Age</div>
          </div>
          <div className="profile-info-item">
            <div className="profile-info-value" style={{ textTransform: 'capitalize' }}>{userProfile.gender}</div>
            <div className="profile-info-label">Gender</div>
          </div>
          {userProfile.city && userProfile.privacy?.location !== 'hidden' && (
            <div className="profile-info-item">
              <div className="profile-info-value"><HiOutlineLocationMarker style={{ verticalAlign: 'middle' }} /> {userProfile.city}</div>
              <div className="profile-info-label">Location</div>
            </div>
          )}
          <div className="profile-info-item">
            <div className="profile-info-value" style={{ textTransform: 'capitalize' }}>{userProfile.preferredGender}</div>
            <div className="profile-info-label">Looking for</div>
          </div>
          <div className="profile-info-item">
            <div className="profile-info-value" style={{ color: 'var(--primary)', fontWeight: '700' }}>{userProfile.connectionCount || 0}</div>
            <div className="profile-info-label">Connections</div>
          </div>
          <div className="profile-info-item">
            <div className="profile-info-value" style={{ color: '#e84393', fontWeight: '700' }}>{userProfile.followersCount || 0}</div>
            <div className="profile-info-label">Followers</div>
          </div>
          <div className="profile-info-item">
            <div className="profile-info-value" style={{ color: '#00b894', fontWeight: '700' }}>{userProfile.followingCount || 0}</div>
            <div className="profile-info-label">Following</div>
          </div>
        </div>

        {userProfile.interests && userProfile.interests.length > 0 && (
          <div className="profile-interests">
            {userProfile.interests.map(interest => (
              <span key={interest} className="tag">{interest}</span>
            ))}
          </div>
        )}

        <div className="profile-actions">
          <button className="btn btn-primary" onClick={() => navigate('/edit-profile')}><FiEdit2 /> Edit Profile</button>
          <button className="btn btn-secondary" onClick={() => navigate('/settings')}><FiSettings /> Settings</button>
          {!userProfile.isPremium && (
            <button className="btn btn-outline" onClick={() => navigate('/premium')} style={{ borderColor: 'var(--accent-pink)', color: 'var(--accent-pink)' }}>
              <FiStar /> Go Premium
            </button>
          )}
        </div>
      </div>

      <div className="profile-section">
        <h3><FiShield style={{ verticalAlign: 'middle' }} /> Privacy Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="flex-between">
            <span style={{ fontSize: '0.9rem' }}>Location visibility</span>
            <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{userProfile.privacy?.location || 'city'}</span>
          </div>
          <div className="flex-between">
            <span style={{ fontSize: '0.9rem' }}>Profile visibility</span>
            <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{userProfile.privacy?.profile || 'everyone'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
