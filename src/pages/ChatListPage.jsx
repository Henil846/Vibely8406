import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { DEFAULT_AVATAR } from '../utils/constants';
import { formatTimestamp } from '../utils/helpers';
import { HiOutlineChatAlt2, HiOutlineSearch } from 'react-icons/hi';
import './Chat.css';

const ChatListPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // For demo, show empty state. In production, query the chats collection.
    setLoading(false);
  }, [currentUser]);

  const filteredChats = chats.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="chat-list-page animate-fadeIn">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: '1.6rem' }}>Messages 💬</h1>
      </div>

      <div style={{ marginBottom: 'var(--space-lg)', position: 'relative' }}>
        <HiOutlineSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
        <input className="form-input" style={{ paddingLeft: '44px' }} placeholder="Search conversations..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: '60px 0' }}><div className="spinner" /></div>
      ) : filteredChats.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💬</div>
          <h3 className="empty-state-title">No conversations yet</h3>
          <p className="empty-state-text">Start connecting with people on the Discover page!</p>
          <button className="btn btn-primary" onClick={() => navigate('/discover')} style={{ marginTop: '16px' }}>
            Find People
          </button>
        </div>
      ) : (
        <div>
          {filteredChats.map(chat => (
            <div key={chat.id} className="chat-list-item" onClick={() => navigate(`/chat/${chat.recipientId}`)}>
              <div className="avatar-wrapper">
                <img className="avatar avatar-md" src={chat.photoURL || DEFAULT_AVATAR} alt="" />
                {chat.isOnline && <div className="badge-online" />}
              </div>
              <div className="chat-list-item-info">
                <div className="chat-list-item-name">{chat.name}</div>
                <div className="chat-list-item-preview">{chat.lastMessage}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <span className="chat-list-item-time">{formatTimestamp(chat.lastMessageTime)}</span>
                {chat.unread > 0 && <span className="chat-list-item-unread">{chat.unread}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatListPage;
