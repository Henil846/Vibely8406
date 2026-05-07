import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { socialAPI } from '../utils/api';
import { DEFAULT_AVATAR, MOODS } from '../utils/constants';
import {
  HiOutlineSearch, HiOutlineUserAdd, HiOutlineUserGroup,
  HiOutlineUsers, HiOutlineCheck, HiOutlineX, HiOutlineClock,
  HiOutlineHeart
} from 'react-icons/hi';
import { FiStar, FiUserPlus, FiUserCheck, FiUserX } from 'react-icons/fi';
import './FriendsPage.css';

const TABS = [
  { id: 'friends', label: 'Friends', icon: <HiOutlineUserGroup /> },
  { id: 'requests', label: 'Requests', icon: <HiOutlineUserAdd /> },
  { id: 'sent', label: 'Sent', icon: <HiOutlineClock /> },
  { id: 'search', label: 'Search', icon: <HiOutlineSearch /> },
  { id: 'followers', label: 'Followers', icon: <HiOutlineHeart /> },
  { id: 'following', label: 'Following', icon: <HiOutlineUsers /> },
];

const FriendsPage = () => {
  const { userProfile, fetchUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followRequests, setFollowRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  const loadTabData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'friends':
          const friendsData = await socialAPI.getFriends();
          setFriends(friendsData.friends || []);
          break;
        case 'requests':
          const [recvData, followReqData] = await Promise.all([
            socialAPI.getReceivedFriendRequests(),
            socialAPI.getFollowRequests(),
          ]);
          setReceivedRequests(recvData.requests || []);
          setFollowRequests(followReqData.requests || []);
          break;
        case 'sent':
          const sentData = await socialAPI.getSentFriendRequests();
          setSentRequests(sentData.requests || []);
          break;
        case 'followers':
          const followersData = await socialAPI.getFollowers();
          setFollowers(followersData.followers || []);
          break;
        case 'following':
          const followingData = await socialAPI.getFollowing();
          setFollowing(followingData.following || []);
          break;
      }
    } catch (err) {
      console.error('loadTabData error:', err);
    }
    setLoading(false);
  };

  const setActionState = (id, state) => setActionLoading(prev => ({ ...prev, [id]: state }));

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;
    setLoading(true);
    try {
      const data = await socialAPI.searchUsers(searchQuery.trim());
      setSearchResults(data.users || []);
    } catch (err) {
      console.error('Search error:', err);
    }
    setLoading(false);
  };

  const handleSendFriendRequest = async (userId) => {
    setActionState(userId, 'sending');
    try {
      await socialAPI.sendFriendRequest(userId);
      setActionState(userId, 'sent');
    } catch (err) {
      alert(err.message || 'Failed to send request');
      setActionState(userId, null);
    }
  };

  const handleAcceptFriendRequest = async (requestId) => {
    setActionState(requestId, 'accepting');
    try {
      await socialAPI.acceptFriendRequest(requestId);
      setReceivedRequests(prev => prev.filter(r => r._id !== requestId));
      fetchUserProfile();
    } catch (err) {
      alert(err.message || 'Failed to accept');
      setActionState(requestId, null);
    }
  };

  const handleRejectFriendRequest = async (requestId) => {
    setActionState(requestId, 'rejecting');
    try {
      await socialAPI.rejectFriendRequest(requestId);
      setReceivedRequests(prev => prev.filter(r => r._id !== requestId));
    } catch (err) {
      alert(err.message || 'Failed to reject');
      setActionState(requestId, null);
    }
  };

  const handleCancelFriendRequest = async (requestId) => {
    setActionState(requestId, 'cancelling');
    try {
      await socialAPI.cancelFriendRequest(requestId);
      setSentRequests(prev => prev.filter(r => r._id !== requestId));
    } catch (err) {
      alert(err.message || 'Failed to cancel');
      setActionState(requestId, null);
    }
  };

  const handleUnfriend = async (userId) => {
    if (!window.confirm('Remove this friend?')) return;
    setActionState(userId, 'unfriending');
    try {
      await socialAPI.unfriend(userId);
      setFriends(prev => prev.filter(f => f._id !== userId));
      fetchUserProfile();
    } catch (err) {
      alert(err.message || 'Failed to unfriend');
      setActionState(userId, null);
    }
  };

  const handleFollow = async (userId) => {
    setActionState(userId, 'following');
    try {
      const result = await socialAPI.followUser(userId);
      if (result.status === 'pending') {
        setActionState(userId, 'follow_pending');
      } else {
        setActionState(userId, 'followed');
        fetchUserProfile();
      }
    } catch (err) {
      alert(err.message || 'Failed to follow');
      setActionState(userId, null);
    }
  };

  const handleUnfollow = async (userId) => {
    setActionState(userId, 'unfollowing');
    try {
      await socialAPI.unfollowUser(userId);
      setFollowing(prev => prev.filter(f => f._id !== userId));
      fetchUserProfile();
      setActionState(userId, 'unfollowed');
    } catch (err) {
      alert(err.message || 'Failed to unfollow');
      setActionState(userId, null);
    }
  };

  const handleAcceptFollowRequest = async (requestId) => {
    setActionState(requestId, 'accepting');
    try {
      await socialAPI.acceptFollowRequest(requestId);
      setFollowRequests(prev => prev.filter(r => r._id !== requestId));
      fetchUserProfile();
    } catch (err) {
      alert(err.message || 'Failed to accept');
      setActionState(requestId, null);
    }
  };

  const handleRejectFollowRequest = async (requestId) => {
    setActionState(requestId, 'rejecting');
    try {
      await socialAPI.rejectFollowRequest(requestId);
      setFollowRequests(prev => prev.filter(r => r._id !== requestId));
    } catch (err) {
      alert(err.message || 'Failed to reject');
      setActionState(requestId, null);
    }
  };

  const getMoodEmoji = (moodId) => {
    const mood = MOODS.find(m => m.id === moodId);
    return mood ? mood.emoji : '';
  };

  const UserRow = ({ user, actions }) => (
    <div className="friend-card">
      <img className="friend-card-avatar" src={user.profilePhoto || DEFAULT_AVATAR} alt={user.displayName || user.fullname} />
      <div className="friend-card-info">
        <div className="friend-card-name">
          {getMoodEmoji(user.mood)} {user.displayName || user.fullname}
          {user.isPremium && <FiStar style={{ color: '#F5576C', fontSize: '0.85rem' }} />}
          {user.isOnline && <span className="friend-online-dot online" />}
        </div>
        <div className="friend-card-username">@{user.username}</div>
        <div className="friend-card-stats">
          <span className="friend-card-stat"><strong>{user.connectionCount || 0}</strong> connections</span>
          <span className="friend-card-stat"><strong>{user.followersCount || 0}</strong> followers</span>
        </div>
      </div>
      <div className="friend-card-actions">
        {actions}
      </div>
    </div>
  );

  const renderFriends = () => (
    <div className="friends-list">
      {friends.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3 className="empty-state-title">No friends yet</h3>
          <p className="empty-state-text">Search for people and send them a friend request!</p>
          <button className="btn btn-primary" onClick={() => setActiveTab('search')} style={{ marginTop: '12px' }}>
            <HiOutlineSearch /> Find People
          </button>
        </div>
      ) : friends.map(friend => (
        <UserRow
          key={friend._id}
          user={friend}
          actions={
            <>
              <button className="btn-cancel" onClick={() => handleUnfriend(friend._id)}
                disabled={actionLoading[friend._id] === 'unfriending'}>
                {actionLoading[friend._id] === 'unfriending' ? '...' : <><FiUserX /> Remove</>}
              </button>
            </>
          }
        />
      ))}
    </div>
  );

  const renderRequests = () => (
    <div className="friends-list">
      {followRequests.length > 0 && (
        <>
          <h3 style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>
            🔔 Follow Requests ({followRequests.length})
          </h3>
          {followRequests.map(req => (
            <UserRow
              key={req._id}
              user={req.from}
              actions={
                <>
                  <button className="btn-accept" onClick={() => handleAcceptFollowRequest(req._id)}
                    disabled={actionLoading[req._id]}>
                    <HiOutlineCheck /> Accept
                  </button>
                  <button className="btn-reject" onClick={() => handleRejectFollowRequest(req._id)}
                    disabled={actionLoading[req._id]}>
                    <HiOutlineX /> Reject
                  </button>
                </>
              }
            />
          ))}
        </>
      )}

      <h3 style={{ fontSize: '1rem', marginBottom: '8px', marginTop: followRequests.length > 0 ? '20px' : '0', color: 'var(--text-secondary)' }}>
        🤝 Friend Requests ({receivedRequests.length})
      </h3>
      {receivedRequests.length === 0 && followRequests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📬</div>
          <h3 className="empty-state-title">No pending requests</h3>
          <p className="empty-state-text">When someone sends you a friend or follow request, it will show up here.</p>
        </div>
      ) : receivedRequests.map(req => (
        <UserRow
          key={req._id}
          user={req.from}
          actions={
            <>
              <button className="btn-accept" onClick={() => handleAcceptFriendRequest(req._id)}
                disabled={actionLoading[req._id]}>
                <HiOutlineCheck /> Accept
              </button>
              <button className="btn-reject" onClick={() => handleRejectFriendRequest(req._id)}
                disabled={actionLoading[req._id]}>
                <HiOutlineX /> Reject
              </button>
            </>
          }
        />
      ))}
    </div>
  );

  const renderSent = () => (
    <div className="friends-list">
      {sentRequests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📨</div>
          <h3 className="empty-state-title">No sent requests</h3>
          <p className="empty-state-text">Friend requests you send will appear here.</p>
        </div>
      ) : sentRequests.map(req => (
        <UserRow
          key={req._id}
          user={req.to}
          actions={
            <button className="btn-cancel" onClick={() => handleCancelFriendRequest(req._id)}
              disabled={actionLoading[req._id] === 'cancelling'}>
              {actionLoading[req._id] === 'cancelling' ? '...' : 'Cancel'}
            </button>
          }
        />
      ))}
    </div>
  );

  const renderSearch = () => (
    <div>
      <div className="friends-search">
        <div className="friends-search-bar">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} disabled={loading}>
            <HiOutlineSearch /> Search
          </button>
        </div>
      </div>
      <div className="friends-list">
        {searchResults.length === 0 && searchQuery && !loading ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No users found</h3>
            <p className="empty-state-text">Try a different username</p>
          </div>
        ) : searchResults.map(user => {
          const isSelf = user._id === userProfile?.uid;
          const isConnected = userProfile?.connections?.includes(user._id);
          const state = actionLoading[user._id];

          return (
            <UserRow
              key={user._id}
              user={user}
              actions={
                !isSelf && (
                  <>
                    {isConnected ? (
                      <span className="btn-pending" style={{ cursor: 'default' }}>✅ Connected</span>
                    ) : state === 'sent' ? (
                      <span className="btn-pending">⏳ Request Sent</span>
                    ) : (
                      <button className="btn-connect" onClick={() => handleSendFriendRequest(user._id)}
                        disabled={state === 'sending'}>
                        {state === 'sending' ? '...' : <><FiUserPlus /> Connect</>}
                      </button>
                    )}
                    {!userProfile?.following?.includes(user._id) && state !== 'followed' ? (
                      state === 'follow_pending' ? (
                        <span className="btn-pending">⏳ Follow Pending</span>
                      ) : (
                        <button className="btn-follow" onClick={() => handleFollow(user._id)}
                          disabled={state === 'following'}>
                          {state === 'following' ? '...' : <><HiOutlineHeart /> Follow</>}
                        </button>
                      )
                    ) : (
                      <button className="btn-unfollow" onClick={() => handleUnfollow(user._id)}>
                        <FiUserCheck /> Following
                      </button>
                    )}
                  </>
                )
              }
            />
          );
        })}
      </div>
    </div>
  );

  const renderFollowers = () => (
    <div className="friends-list">
      {followers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">❤️</div>
          <h3 className="empty-state-title">No followers yet</h3>
          <p className="empty-state-text">When people follow you, they'll appear here.</p>
        </div>
      ) : followers.map(follower => (
        <UserRow
          key={follower._id}
          user={follower}
          actions={
            !userProfile?.following?.includes(follower._id) ? (
              <button className="btn-follow" onClick={() => handleFollow(follower._id)}
                disabled={actionLoading[follower._id] === 'following'}>
                {actionLoading[follower._id] === 'following' ? '...' : <><HiOutlineHeart /> Follow Back</>}
              </button>
            ) : (
              <button className="btn-unfollow" onClick={() => handleUnfollow(follower._id)}>
                <FiUserCheck /> Following
              </button>
            )
          }
        />
      ))}
    </div>
  );

  const renderFollowing = () => (
    <div className="friends-list">
      {following.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👀</div>
          <h3 className="empty-state-title">Not following anyone</h3>
          <p className="empty-state-text">Follow people to see their updates!</p>
        </div>
      ) : following.map(user => (
        <UserRow
          key={user._id}
          user={user}
          actions={
            <button className="btn-unfollow" onClick={() => handleUnfollow(user._id)}
              disabled={actionLoading[user._id] === 'unfollowing'}>
              {actionLoading[user._id] === 'unfollowing' ? '...' : <><FiUserCheck /> Unfollow</>}
            </button>
          }
        />
      ))}
    </div>
  );

  const renderContent = () => {
    if (loading && activeTab !== 'search') {
      return <div className="flex-center" style={{ padding: '60px 0' }}><div className="spinner" /></div>;
    }
    switch (activeTab) {
      case 'friends': return renderFriends();
      case 'requests': return renderRequests();
      case 'sent': return renderSent();
      case 'search': return renderSearch();
      case 'followers': return renderFollowers();
      case 'following': return renderFollowing();
      default: return null;
    }
  };

  return (
    <div className="friends-page animate-fadeIn">
      <div className="friends-header">
        <h1>Friends & Social 👥</h1>
        <p>Manage your connections, followers, and friend requests</p>
      </div>

      <div className="friends-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`friends-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.id === 'requests' && (receivedRequests.length + followRequests.length) > 0 && (
              <span className="tab-badge">{receivedRequests.length + followRequests.length}</span>
            )}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
};

export default FriendsPage;
