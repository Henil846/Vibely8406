import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, limit, doc, updateDoc, addDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import UserCard from '../components/UserCard';
import ReportModal from '../components/ReportModal';
import { MOODS, GENDERS, COMMUNICATION_MODES, FREE_LIMITS } from '../utils/constants';
import { HiOutlineSearch, HiOutlineFilter, HiOutlineRefresh } from 'react-icons/hi';
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
      let q = query(collection(db, 'users'), where('__name__', '!=', currentUser.uid), limit(30));
      const snapshot = await getDocs(q);
      let userList = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));

      // Client-side filtering
      const blocked = userProfile?.blockedUsers || [];
      userList = userList.filter(u => !blocked.includes(u.uid));
      if (filters.mood) userList = userList.filter(u => u.mood === filters.mood);
      if (filters.gender) userList = userList.filter(u => u.gender === filters.gender);
      if (filters.mode) userList = userList.filter(u => u.communicationMode === filters.mode);
      if (filters.city) userList = userList.filter(u => u.city?.toLowerCase().includes(filters.city.toLowerCase()));
      if (filters.ageMin) userList = userList.filter(u => u.age >= parseInt(filters.ageMin));
      if (filters.ageMax) userList = userList.filter(u => u.age <= parseInt(filters.ageMax));

      // preference matching
      if (userProfile?.preferredGender && userProfile.preferredGender !== 'everyone') {
        userList = userList.filter(u => u.gender === userProfile.preferredGender);
      }

      setUsers(userList);
    } catch (err) {
      console.error('Error fetching users:', err);
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
    // Create match notification
    try {
      await addDoc(collection(db, 'notifications'), {
        userId: uid, type: 'like', title: 'New Like!',
        message: `${userProfile?.displayName} liked your profile`,
        data: { fromUserId: currentUser.uid }, read: false, createdAt: serverTimestamp(),
      });
    } catch (e) { console.error(e); }
    setUsers(prev => prev.filter(u => u.uid !== uid));
  };

  const handleSkip = (uid) => setUsers(prev => prev.filter(u => u.uid !== uid));

  const handleBlock = async (user) => {
    if (window.confirm(`Block @${user.username}? They won't be able to see your profile or contact you.`)) {
      await updateUserProfile({ blockedUsers: arrayUnion(user.uid) });
      setUsers(prev => prev.filter(u => u.uid !== user.uid));
    }
  };

  const handleReport = async (reportData) => {
    await addDoc(collection(db, 'reports'), {
      ...reportData, reportedBy: currentUser.uid, reportedUser: reportUser.uid,
      status: 'pending', createdAt: serverTimestamp(),
    });
  };

  const handleConnect = async (user) => {
    await addDoc(collection(db, 'notifications'), {
      userId: user.uid, type: 'connect', title: 'Connection Request',
      message: `${userProfile?.displayName} wants to connect with you!`,
      data: { fromUserId: currentUser.uid }, read: false, createdAt: serverTimestamp(),
    });
    alert('Connection request sent! 🎉');
  };

  return (
    <div className="discover-page animate-fadeIn">
      <div className="discover-header">
        <h1>Discover People ✨</h1>
        <p>Find people who match your vibe and interests</p>
      </div>

      <div className="discover-filters">
        <div className="discover-filters-row">
          <div className="discover-filter-group">
            <label>Mood</label>
            <select value={filters.mood} onChange={e => setFilters(prev => ({ ...prev, mood: e.target.value }))}>
              <option value="">All moods</option>
              {MOODS.map(m => <option key={m.id} value={m.id}>{m.emoji} {m.label}</option>)}
            </select>
          </div>
          <div className="discover-filter-group">
            <label>Gender</label>
            <select value={filters.gender} onChange={e => setFilters(prev => ({ ...prev, gender: e.target.value }))}>
              <option value="">All genders</option>
              {GENDERS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
            </select>
          </div>
          <div className="discover-filter-group">
            <label>City</label>
            <input type="text" placeholder="Filter by city" value={filters.city} onChange={e => setFilters(prev => ({ ...prev, city: e.target.value }))} />
          </div>
          <div className="discover-filter-group" style={{ minWidth: '100px' }}>
            <label>Age Min</label>
            <input type="number" placeholder="16" min="16" value={filters.ageMin} onChange={e => setFilters(prev => ({ ...prev, ageMin: e.target.value }))} />
          </div>
          <div className="discover-filter-group" style={{ minWidth: '100px' }}>
            <label>Age Max</label>
            <input type="number" placeholder="99" max="99" value={filters.ageMax} onChange={e => setFilters(prev => ({ ...prev, ageMax: e.target.value }))} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={fetchUsers} style={{ height: '42px' }}>
            <HiOutlineSearch /> Search
          </button>
        </div>
      </div>

      <div className="discover-comm-modes">
        {COMMUNICATION_MODES.map(mode => (
          <button key={mode.id} className={`discover-comm-mode-btn ${commMode === mode.id ? 'active' : ''}`}
            onClick={() => { setCommMode(mode.id); setFilters(prev => ({ ...prev, mode: mode.id })); }}>
            {mode.icon} {mode.label}
          </button>
        ))}
        <button className={`discover-comm-mode-btn ${commMode === '' ? 'active' : ''}`}
          onClick={() => { setCommMode(''); setFilters(prev => ({ ...prev, mode: '' })); }}>
          🌐 All
        </button>
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: '60px 0' }}><div className="spinner" /></div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3 className="empty-state-title">No one found</h3>
          <p className="empty-state-text">Try adjusting your filters or check back later!</p>
          <button className="btn btn-primary" onClick={fetchUsers} style={{ marginTop: '16px' }}><HiOutlineRefresh /> Refresh</button>
        </div>
      ) : (
        <div className="discover-grid">
          {users.map(user => (
            <UserCard key={user.uid} user={user} onLike={handleLike} onSkip={handleSkip}
              onBlock={() => handleBlock(user)} onReport={() => setReportUser(user)} onConnect={handleConnect} />
          ))}
        </div>
      )}

      {reportUser && <ReportModal user={reportUser} onClose={() => setReportUser(null)} onSubmit={handleReport} />}
    </div>
  );
};

export default DiscoverPage;
