import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import MoodSelector from '../components/MoodSelector';
import { MOODS, FREE_LIMITS } from '../utils/constants';
import { HiOutlineSearch, HiOutlineChatAlt2, HiOutlineStar, HiOutlineHeart, HiOutlinePhone, HiOutlineUserGroup } from 'react-icons/hi';
import './Dashboard.css';

const DashboardPage = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [showMoodSelector, setShowMoodSelector] = useState(false);

  const currentMood = MOODS.find(m => m.id === userProfile?.mood);

  const handleMoodChange = async (moodId) => {
    await updateUserProfile({ mood: moodId });
    setShowMoodSelector(false);
  };

  const stats = [
    { icon: '🔥', value: userProfile?.isPremium ? '∞' : `${FREE_LIMITS.dailyMatches - (userProfile?.dailyMatchCount || 0)}`, label: 'Matches Left' },
    { icon: '💬', value: '0', label: 'Active Chats' },
    { icon: '❤️', value: '0', label: 'Likes Received' },
    { icon: '🔔', value: unreadCount || '0', label: 'Notifications' },
  ];

  const quickActions = [
    { icon: <HiOutlineSearch />, bg: 'rgba(108, 92, 231, 0.15)', title: 'Find People', desc: 'Discover new connections', to: '/discover' },
    { icon: <HiOutlineChatAlt2 />, bg: 'rgba(0, 184, 148, 0.15)', title: 'Messages', desc: 'View your conversations', to: '/chats' },
    { icon: <HiOutlineStar />, bg: 'rgba(245, 87, 108, 0.15)', title: 'Go Premium', desc: 'Unlock all features', to: '/premium' },
  ];

  return (
    <div className="dashboard-page animate-fadeIn">
      <div className="dashboard-welcome">
        <h1>Hey, {userProfile?.displayName?.split(' ')[0] || 'there'}! 👋</h1>
        <p>
          {currentMood ? (
            <>You're feeling {currentMood.emoji} {currentMood.label} today. <button onClick={() => setShowMoodSelector(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.9)', textDecoration: 'underline', cursor: 'pointer', fontSize: '1rem' }}>Change mood?</button></>
          ) : (
            <>Set your mood to find people on the same vibe!</>
          )}
        </p>
      </div>

      <div className="dashboard-stats">
        {stats.map((stat, i) => (
          <div key={i} className="dashboard-stat-card">
            <div className="dashboard-stat-icon">{stat.icon}</div>
            <div className="dashboard-stat-value">{stat.value}</div>
            <div className="dashboard-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {showMoodSelector && (
        <div className="dashboard-section">
          <div className="dashboard-mood-section">
            <MoodSelector selectedMood={userProfile?.mood} onSelect={handleMoodChange} />
          </div>
        </div>
      )}

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="dashboard-quick-actions">
          {quickActions.map((action, i) => (
            <button key={i} className="dashboard-quick-action" onClick={() => navigate(action.to)}>
              <div className="dashboard-quick-action-icon" style={{ background: action.bg, color: 'var(--primary)' }}>
                {action.icon}
              </div>
              <h3>{action.title}</h3>
              <p>{action.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {!userProfile?.mood && (
        <div className="dashboard-section">
          <div className="dashboard-mood-section">
            <h2 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Set Your Mood 🎭</h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
              Tell us how you're feeling so we can match you with the right people
            </p>
            <MoodSelector selectedMood={userProfile?.mood} onSelect={handleMoodChange} />
          </div>
        </div>
      )}

      {!userProfile?.isPremium && (
        <div className="dashboard-section">
          <div style={{
            background: 'var(--gradient-premium)', borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-xl)', color: 'white', textAlign: 'center', cursor: 'pointer'
          }} onClick={() => navigate('/premium')}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>⚡ Upgrade to Premium</h3>
            <p style={{ opacity: 0.9 }}>Get unlimited matches, priority search, and exclusive features</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
