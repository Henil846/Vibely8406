import { useNavigate } from 'react-router-dom';
import { HiOutlineHeart } from 'react-icons/hi';

const MatchesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="chat-list-page animate-fadeIn">
      <h1 style={{ fontSize: '1.6rem', marginBottom: 'var(--space-xl)' }}>Matches ❤️</h1>

      <div className="empty-state">
        <div className="empty-state-icon">💜</div>
        <h3 className="empty-state-title">No matches yet</h3>
        <p className="empty-state-text">Start discovering people and liking profiles to get matches!</p>
        <button className="btn btn-primary" onClick={() => navigate('/discover')} style={{ marginTop: '16px' }}>
          <HiOutlineHeart /> Find Matches
        </button>
      </div>
    </div>
  );
};

export default MatchesPage;
