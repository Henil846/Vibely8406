import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { DEFAULT_AVATAR } from '../utils/constants';
import { HiOutlinePhone, HiOutlineMicrophone, HiOutlineVolumeUp } from 'react-icons/hi';
import { FiPhoneOff, FiMicOff } from 'react-icons/fi';
import './Chat.css';

const VoiceCallPage = () => {
  const { recipientId } = useParams();
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState(null);
  const [callStatus, setCallStatus] = useState('connecting');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, 'users', recipientId));
      if (snap.exists()) setRecipient(snap.data());
    };
    fetch();
    const timer = setTimeout(() => setCallStatus('ringing'), 1500);
    return () => clearTimeout(timer);
  }, [recipientId]);

  useEffect(() => {
    if (callStatus !== 'connected') return;
    const interval = setInterval(() => setDuration(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="call-screen">
      <img className="call-avatar" src={recipient?.photoURL || DEFAULT_AVATAR} alt="" />
      <h2 className="call-name">{recipient?.displayName || 'Loading...'}</h2>
      <p className="call-status">
        {callStatus === 'connecting' && '🔄 Connecting...'}
        {callStatus === 'ringing' && '📞 Ringing...'}
        {callStatus === 'connected' && `🔊 ${formatDuration(duration)}`}
      </p>

      <div className="call-actions">
        <button className="call-action-btn mute" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <FiMicOff /> : <HiOutlineMicrophone />}
        </button>
        {callStatus === 'ringing' && (
          <button className="call-action-btn accept-call" onClick={() => setCallStatus('connected')}>
            <HiOutlinePhone />
          </button>
        )}
        <button className="call-action-btn end-call" onClick={() => navigate('/chats')}>
          <FiPhoneOff />
        </button>
        <button className="call-action-btn mute">
          <HiOutlineVolumeUp />
        </button>
      </div>

      <p style={{ marginTop: '48px', opacity: 0.5, fontSize: '0.85rem' }}>
        Voice calling powered by MoodLink
      </p>
    </div>
  );
};

export default VoiceCallPage;
