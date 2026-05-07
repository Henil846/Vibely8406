import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../utils/api';
import UserCard from '../components/UserCard';
import ReportModal from '../components/ReportModal';
import { MOODS, GENDERS, COMMUNICATION_MODES, FREE_LIMITS } from '../utils/constants';
import { HiOutlineSearch, HiOutlineRefresh } from 'react-icons/hi';
import './Discover.css';

const DiscoverPage = () => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ mood: '', gender: '', mode: '', ageMin: '', ageMax: '', city: '' });
  const [reportUser, setReportUser] = useState(null);
  const [commMode, setCommMode] = useState('text');

  const fetchUsers = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await userAPI.discover({
        mood: filters.mood,
        gender: filters.gender,
        mode: filters.mode,
        ageMin: filters.ageMin,
        ageMax: filters.ageMax,
        city: filters.city,
      });

      // Map backend users to frontend format
      const mapped = (data.users || []).map(u => ({
        uid: u._id,
        displayName: u.displayName || u.fullname || '',
        username: u.username || '',
        age: u.age,
        gender: u.gender,
        preferredGender: u.talk_with || 'everyone',
        mood: u.mood || 'happy',
        communicationMode: u.communicationMode || 'text',
        isOnline: u.isOnline || false,
        isPremium: u.isPremium || false,
        bio: u.bio || '',
        city: u.city || '',
        interests: u.interests || [],
        photoURL: u.profilePhoto || '',
        privacy: u.privacy || { location: 'city', profile: 'everyone' },
        blockedUsers: u.blockedUsers || [],
      }));

      setUsers(mapped);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [currentUser]);

  const handleLike = async (uid) => {
    if (!userProfile?.isPremium) {
      const matchCount = userProfile?.dailyMatchCount || 0;
      if (matchCount >= FREE_LIMITS.dailyMatches) { alert('Daily match limit reached! Upgrade to Premium.'); return; }
      await updateUserProfile({ dailyMatchCount: matchCount + 1 });
    }
    setUsers(prev => prev.filter(u => u.uid !== uid));
  };

  const handleSkip = (uid) => setUsers(prev => prev.filter(u => u.uid !== uid));

  const handleBlock = async (user) => {
    if (window.confirm(`Block @${user.username}?`)) {
      try {
        await userAPI.blockUser(user.uid);
        setUsers(prev => prev.filter(u => u.uid !== user.uid));
      } catch (err) {
        console.error('Block failed:', err);
      }
    }
  };

  const handleReport = async (reportData) => {
    try {
      await userAPI.reportUser(reportData);
      console.log('Report submitted:', reportData);
    } catch (err) {
      console.error('Report failed:', err);
    }
  };

  const handleConnect = async (user) => {
    // Handled internally by UserCard via socialAPI
  };

  return (
    <div className="discover-page animate-fadeIn">
      <div className="discover-header"><h1>Discover People ✨</h1><p>Find people who match your vibe and interests</p></div>
      <div className="discover-filters">
        <div className="discover-filters-row">
          <div className="discover-filter-group"><label>Mood</label>
            <select value={filters.mood} onChange={e => setFilters(prev => ({ ...prev, mood: e.target.value }))}><option value="">All moods</option>{MOODS.map(m => <option key={m.id} value={m.id}>{m.emoji} {m.label}</option>)}</select></div>
          <div className="discover-filter-group"><label>Gender</label>
            <select value={filters.gender} onChange={e => setFilters(prev => ({ ...prev, gender: e.target.value }))}><option value="">All genders</option>{GENDERS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}</select></div>
          <div className="discover-filter-group"><label>City</label>
            <input type="text" placeholder="Filter by city" value={filters.city} onChange={e => setFilters(prev => ({ ...prev, city: e.target.value }))} /></div>
          <div className="discover-filter-group" style={{ minWidth: '100px' }}><label>Age Min</label>
            <input type="number" placeholder="16" min="16" value={filters.ageMin} onChange={e => setFilters(prev => ({ ...prev, ageMin: e.target.value }))} /></div>
          <div className="discover-filter-group" style={{ minWidth: '100px' }}><label>Age Max</label>
            <input type="number" placeholder="99" max="99" value={filters.ageMax} onChange={e => setFilters(prev => ({ ...prev, ageMax: e.target.value }))} /></div>
          <button className="btn btn-primary btn-sm" onClick={fetchUsers} style={{ height: '42px' }}><HiOutlineSearch /> Search</button>
        </div>
      </div>
      <div className="discover-comm-modes">
        {COMMUNICATION_MODES.map(mode => (<button key={mode.id} className={`discover-comm-mode-btn ${commMode === mode.id ? 'active' : ''}`} onClick={() => { setCommMode(mode.id); setFilters(prev => ({ ...prev, mode: mode.id })); }}>{mode.icon} {mode.label}</button>))}
        <button className={`discover-comm-mode-btn ${commMode === '' ? 'active' : ''}`} onClick={() => { setCommMode(''); setFilters(prev => ({ ...prev, mode: '' })); }}>🌐 All</button>
      </div>
      {loading ? (<div className="flex-center" style={{ padding: '60px 0' }}><div className="spinner" /></div>
      ) : users.length === 0 ? (<div className="empty-state"><div className="empty-state-icon">🔍</div><h3 className="empty-state-title">No one found</h3><p className="empty-state-text">Try adjusting your filters or check back later!</p><button className="btn btn-primary" onClick={fetchUsers} style={{ marginTop: '16px' }}><HiOutlineRefresh /> Refresh</button></div>
      ) : (<div className="discover-grid">{users.map(user => (<UserCard key={user.uid} user={user} onLike={handleLike} onSkip={handleSkip} onBlock={() => handleBlock(user)} onReport={() => setReportUser(user)} onConnect={handleConnect} />))}</div>)}
      {reportUser && <ReportModal user={reportUser} onClose={() => setReportUser(null)} onSubmit={handleReport} />}
    </div>
  );
};

export default DiscoverPage;
