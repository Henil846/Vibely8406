import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineSparkles, HiOutlineShieldCheck, HiOutlineLockClosed, HiOutlineHeart, HiOutlineChatAlt2, HiOutlineGlobe } from 'react-icons/hi';
import './LandingPage.css';

const features = [
  { icon: '🎭', title: 'Mood-Based Matching', desc: 'Connect with people who share your current vibe. Set your mood and find your tribe.', bg: 'rgba(108, 92, 231, 0.15)' },
  { icon: '🛡️', title: 'Safety First', desc: 'Built-in moderation, reporting, and blocking. Your safety is our top priority.', bg: 'rgba(0, 184, 148, 0.15)' },
  { icon: '🔒', title: 'Privacy Controls', desc: 'You control what others see. No exact locations, no personal data exposure.', bg: 'rgba(253, 203, 110, 0.15)' },
  { icon: '💬', title: 'Multi-Mode Chat', desc: 'Choose text, voice, or video. Connect the way that feels right to you.', bg: 'rgba(232, 67, 147, 0.15)' },
  { icon: '💫', title: 'Smart Discovery', desc: 'Advanced filters by mood, interests, age, and more. Find your people.', bg: 'rgba(162, 155, 254, 0.15)' },
  { icon: '👑', title: 'Premium Experience', desc: 'Unlock unlimited matches, priority search, profile boost, and custom themes.', bg: 'rgba(245, 87, 108, 0.15)' },
];

const floatingEmojis = [
  { emoji: '😊', style: { top: '15%', left: '10%', animationDelay: '0s' } },
  { emoji: '🎮', style: { top: '25%', right: '15%', animationDelay: '1s' } },
  { emoji: '🥰', style: { top: '60%', left: '5%', animationDelay: '2s' } },
  { emoji: '🎉', style: { bottom: '20%', right: '10%', animationDelay: '3s' } },
  { emoji: '💜', style: { top: '40%', left: '20%', animationDelay: '1.5s' } },
  { emoji: '🤩', style: { bottom: '30%', left: '15%', animationDelay: '2.5s' } },
];

const LandingPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-nav-brand">💜 MoodLink</div>
        <div className="landing-nav-actions">
          {currentUser ? (
            <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ color: 'rgba(255,255,255,0.8)' }}>Log In</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up Free</Link>
            </>
          )}
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-floating-emojis">
          {floatingEmojis.map((item, i) => (
            <span key={i} className="landing-floating-emoji" style={item.style}>{item.emoji}</span>
          ))}
        </div>
        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <HiOutlineSparkles /> The future of social connection
          </div>
          <h1>
            Connect by <span className="landing-hero-gradient-text">Mood</span>,
            <br />Not Just Profile
          </h1>
          <p>
            Discover real connections based on how you feel right now. MoodLink matches you with people
            who share your vibe, interests, and energy — safely and privately.
          </p>
          <div className="landing-hero-actions">
            <Link to="/signup" className="btn btn-primary btn-lg" style={{ padding: '16px 40px' }}>
              Get Started — It's Free ✨
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
              Log In
            </Link>
          </div>
          <div className="landing-hero-stats">
            <div className="landing-hero-stat">
              <div className="landing-hero-stat-number">50K+</div>
              <div className="landing-hero-stat-label">Active Users</div>
            </div>
            <div className="landing-hero-stat">
              <div className="landing-hero-stat-number">1M+</div>
              <div className="landing-hero-stat-label">Connections Made</div>
            </div>
            <div className="landing-hero-stat">
              <div className="landing-hero-stat-number">16</div>
              <div className="landing-hero-stat-label">Mood Vibes</div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <div className="landing-section-title">
          <h2>Why MoodLink?</h2>
          <p>We built the social platform Gen Z deserves — safe, fun, and vibes-first.</p>
        </div>
        <div className="landing-features-grid">
          {features.map((feature, i) => (
            <div key={i} className="landing-feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="landing-feature-icon" style={{ background: feature.bg }}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <h2>Ready to Find Your Vibe?</h2>
        <p>Join thousands of people connecting by mood, not just looks.</p>
        <Link to="/signup" className="btn btn-primary btn-lg" style={{ background: 'var(--gradient-premium)', padding: '18px 48px', fontSize: '1.1rem' }}>
          Join MoodLink Today 🚀
        </Link>
      </section>

      <footer className="landing-footer">
        <p>© 2026 MoodLink. All rights reserved. Made with 💜 for real connections.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
