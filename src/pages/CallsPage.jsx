import { useNavigate } from 'react-router-dom';
import { HiOutlinePhone, HiOutlineVideoCamera } from 'react-icons/hi';
import './Chat.css';

const CallsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="chat-list-page animate-fadeIn">
      <h1 style={{ fontSize: '1.6rem', marginBottom: 'var(--space-xl)' }}>Calls 📞</h1>

      <div className="empty-state">
        <div className="empty-state-icon">📞</div>
        <h3 className="empty-state-title">No call history</h3>
        <p className="empty-state-text">Your voice and video calls will appear here.</p>
        <button className="btn btn-primary" onClick={() => navigate('/discover')} style={{ marginTop: '16px' }}>
          Find People to Call
        </button>
      </div>
    </div>
  );
};

export default CallsPage;
