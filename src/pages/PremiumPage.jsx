import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UpgradeModal from '../components/UpgradeModal';
import { PREMIUM_PLANS } from '../utils/constants';
import { HiOutlineCheck, HiOutlineStar, HiOutlineSparkles, HiOutlineLightningBolt, HiOutlineShieldCheck } from 'react-icons/hi';

const allFeatures = [
  { feature: 'Daily matches', free: '10/day', premium: 'Unlimited' },
  { feature: 'Chat requests', free: '5/day', premium: 'Unlimited' },
  { feature: 'Advanced filters', free: '✗', premium: '✓' },
  { feature: 'Priority in search', free: '✗', premium: '✓' },
  { feature: 'Premium badge', free: '✗', premium: '✓' },
  { feature: 'Profile boost', free: '✗', premium: '✓' },
  { feature: 'See who liked you', free: '✗', premium: '✓' },
  { feature: 'Custom themes', free: '✗', premium: '✓' },
  { feature: 'Early access features', free: '✗', premium: '✓' },
];

const PremiumPage = () => {
  const { userProfile } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (userProfile?.isPremium) {
    return (
      <div style={{ padding: 'var(--space-xl)', maxWidth: '700px', margin: '0 auto' }} className="animate-fadeIn">
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl) var(--space-lg)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>👑</div>
          <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-md)', background: 'var(--gradient-premium)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            You're Premium!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: 'var(--space-xl)' }}>
            Enjoy all premium features. Thank you for supporting MoodLink!
          </p>
          <div className="badge badge-premium" style={{ fontSize: '1rem', padding: '8px 24px' }}>
            <HiOutlineStar /> {userProfile.premiumPlan?.charAt(0).toUpperCase() + userProfile.premiumPlan?.slice(1)} Plan
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-xl)', maxWidth: '900px', margin: '0 auto' }} className="animate-fadeIn">
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>✨</div>
        <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>Upgrade to Premium</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Unlock the full MoodLink experience with unlimited matches and exclusive features
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
        {PREMIUM_PLANS.map(plan => (
          <div key={plan.id} className="card" style={{
            padding: 'var(--space-xl)', textAlign: 'center', position: 'relative',
            border: plan.popular ? '2px solid var(--primary)' : undefined,
            transform: plan.popular ? 'scale(1.05)' : undefined,
          }}>
            {plan.popular && (
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--gradient-premium)', color: 'white', fontSize: '0.7rem', fontWeight: '700', padding: '4px 16px', borderRadius: '100px' }}>
                MOST POPULAR
              </div>
            )}
            <h3 style={{ marginBottom: 'var(--space-sm)' }}>{plan.name}</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--font-primary)', marginBottom: '4px' }}>${plan.price}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>/{plan.period}</div>
            {plan.savings && <div className="badge badge-success" style={{ marginBottom: 'var(--space-md)' }}>Save {plan.savings}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: 'var(--space-xl)' }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <HiOutlineCheck style={{ color: 'var(--accent-green)', flexShrink: 0 }} /> {f}
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: '100%', background: plan.popular ? 'var(--gradient-premium)' : undefined }}
              onClick={() => setShowUpgrade(true)}>
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
        <h3 style={{ marginBottom: 'var(--space-lg)', textAlign: 'center' }}>Feature Comparison</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid var(--border-light)', fontSize: '0.85rem' }}>Feature</th>
              <th style={{ textAlign: 'center', padding: '12px', borderBottom: '2px solid var(--border-light)', fontSize: '0.85rem' }}>Free</th>
              <th style={{ textAlign: 'center', padding: '12px', borderBottom: '2px solid var(--border-light)', fontSize: '0.85rem', color: 'var(--primary)' }}>Premium</th>
            </tr>
          </thead>
          <tbody>
            {allFeatures.map(row => (
              <tr key={row.feature}>
                <td style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', fontSize: '0.9rem' }}>{row.feature}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', fontSize: '0.85rem', textAlign: 'center', color: 'var(--text-secondary)' }}>{row.free}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', fontSize: '0.85rem', textAlign: 'center', color: 'var(--accent-green)', fontWeight: '600' }}>{row.premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
};

export default PremiumPage;
