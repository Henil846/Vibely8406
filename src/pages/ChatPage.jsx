import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_AVATAR } from '../utils/constants';
import { formatMessageTime, generateChatId } from '../utils/helpers';
import { HiOutlineArrowLeft, HiOutlinePhone, HiOutlineVideoCamera } from 'react-icons/hi';
import { FiSend } from 'react-icons/fi';
import './Chat.css';

const ChatPage = () => {
  const { recipientId } = useParams();
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Mock recipient data
    setRecipient({
      uid: recipientId,
      displayName: 'Demo User',
      photoURL: '',
      isOnline: true,
    });
    setLoading(false);
  }, [recipientId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg = {
      id: 'msg_' + Date.now(),
      text: newMessage,
      senderId: currentUser.uid,
      senderName: userProfile?.displayName,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <button className="btn btn-icon btn-ghost" onClick={() => navigate('/chats')}><HiOutlineArrowLeft /></button>
        <div className="avatar-wrapper">
          <img className="avatar avatar-md" src={recipient?.photoURL || DEFAULT_AVATAR} alt="" />
          <div className={recipient?.isOnline ? 'badge-online' : 'badge-offline'} />
        </div>
        <div className="chat-header-info">
          <div className="chat-header-name">{recipient?.displayName || 'Loading...'}</div>
          <div className="chat-header-status">{recipient?.isOnline ? 'Online' : 'Offline'}</div>
        </div>
        <button className="btn btn-icon btn-ghost" onClick={() => navigate(`/voice-call/${recipientId}`)}><HiOutlinePhone /></button>
        <button className="btn btn-icon btn-ghost" onClick={() => navigate(`/video-call/${recipientId}`)}><HiOutlineVideoCamera /></button>
      </div>
      <div className="chat-messages">
        {loading ? (
          <div className="flex-center" style={{ flex: 1 }}><div className="spinner" /></div>
        ) : messages.length === 0 ? (
          <div className="empty-state" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="empty-state-icon">💬</div>
            <h3 className="empty-state-title">Start a conversation</h3>
            <p className="empty-state-text">Say hello to {recipient?.displayName}!</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`chat-message ${msg.senderId === currentUser.uid ? 'sent' : 'received'}`}>
              <div>
                <div className="chat-bubble">{msg.text}</div>
                <div className="chat-time">{msg.createdAt ? formatMessageTime(msg.createdAt) : '...'}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-area" onSubmit={handleSend}>
        <input className="chat-input" placeholder="Type a message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} />
        <button type="submit" className="chat-send-btn" disabled={!newMessage.trim()}><FiSend /></button>
      </form>
    </div>
  );
};

export default ChatPage;
