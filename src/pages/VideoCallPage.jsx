import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DEFAULT_AVATAR } from '../utils/constants';
import { HiOutlineVideoCamera, HiOutlineMicrophone } from 'react-icons/hi';
import { FiPhoneOff, FiMicOff, FiVideoOff } from 'react-icons/fi';
import './Chat.css';

const VideoCallPage = () => {
  const { recipientId } = useParams();
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState(null);
  const [callStatus, setCallStatus] = useState('connecting');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    setRecipient({ displayName: 'Demo User', photoURL: '', isOnline: true });
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
    <div className="call-screen" style={{ background: 'linear-gradient(135deg, #0F0C29, #1A1735, #302B63)' }}>
      {callStatus === 'connected' ? (
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px', aspectRatio: '16/9', background: '#000', borderRadius: 'var(--radius-xl)', marginBottom: 'var(--space-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <img src={recipient?.photoURL || DEFAULT_AVATAR} alt="" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px' }} />
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>{recipient?.displayName}'s camera</p>
          </div>
          <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '120px', height: '90px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Your camera</div>
        </div>
      ) : (
        <>
          <img className="call-avatar" src={recipient?.photoURL || DEFAULT_AVATAR} alt="" />
          <h2 className="call-name">{recipient?.displayName || 'Loading...'}</h2>
        </>
      )}
      <p className="call-status">
        {callStatus === 'connecting' && '🔄 Connecting video...'}
        {callStatus === 'ringing' && '📹 Ringing...'}
        {callStatus === 'connected' && `🎥 ${formatDuration(duration)}`}
      </p>
      <div className="call-actions">
        <button className="call-action-btn mute" onClick={() => setIsMuted(!isMuted)}>{isMuted ? <FiMicOff /> : <HiOutlineMicrophone />}</button>
        <button className="call-action-btn mute" onClick={() => setIsVideoOff(!isVideoOff)}>{isVideoOff ? <FiVideoOff /> : <HiOutlineVideoCamera />}</button>
        {callStatus === 'ringing' && (<button className="call-action-btn accept-call" onClick={() => setCallStatus('connected')}><HiOutlineVideoCamera /></button>)}
        <button className="call-action-btn end-call" onClick={() => navigate('/chats')}><FiPhoneOff /></button>
      </div>
      <p style={{ marginTop: '48px', opacity: 0.5, fontSize: '0.85rem' }}>Video calling powered by MoodLink</p>
    </div>
  );
};

export default VideoCallPage;
