import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PREMIUM_PLANS } from '../utils/constants';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { HiOutlineX, HiOutlineCheck, HiOutlineStar } from 'react-icons/hi';

const UpgradeModal = ({ onClose }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('quarterly');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpgrade = async () => {
    setProcessing(true);
    try {
      const plan = PREMIUM_PLANS.find(p => p.id === selectedPlan);
      await updateUserProfile({
        isPremium: true,
        premiumPlan: plan.id,
        premiumExpiry: new Date(Date.now() + (plan.id === 'monthly' ? 30 : plan.id === 'quarterly' ? 90 : 365) * 86400000),
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
    }
    setProcessing(false);
  };

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-body" style={{ textAlign: 'center', padding: '48px 32px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px', animation: 'scaleIn 0.5s ease' }}>🎉</div>
            <h2 style={{ marginBottom: '8px', background: 'var(--gradient-premium)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Welcome to Premium!
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>You now have access to all premium features.</p>
            <button className="btn btn-primary btn-lg" onClick={onClose}>Let's Go! 🚀</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HiOutlineStar style={{ color: 'var(--accent-yellow)' }} /> Upgrade to Premium
          </h3>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><HiOutlineX /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            {PREMIUM_PLANS.map(plan => (
              <button key={plan.id} onClick={() => setSelectedPlan(plan.id)} style={{
                flex: 1, padding: '20px 16px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                background: selectedPlan === plan.id ? 'var(--gradient-primary)' : 'var(--bg-input)',
                color: selectedPlan === plan.id ? 'white' : 'var(--text-primary)',
                border: `2px solid ${selectedPlan === plan.id ? 'transparent' : 'var(--border-color)'}`,
                transition: 'all 0.3s ease', position: 'relative', textAlign: 'center'
              }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--accent-pink)', color: 'white', fontSize: '0.65rem', fontWeight: '700',
                    padding: '2px 10px', borderRadius: '100px'
                  }}>POPULAR</div>
                )}
                <div style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>{plan.name}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800' }}>${plan.price}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>/{plan.period}</div>
                {plan.savings && <div style={{ fontSize: '0.7rem', marginTop: '4px', color: selectedPlan === plan.id ? '#55EFC4' : 'var(--accent-green)', fontWeight: '600' }}>Save {plan.savings}</div>}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {PREMIUM_PLANS.find(p => p.id === selectedPlan)?.features.map(feature => (
              <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <HiOutlineCheck style={{ color: 'var(--accent-green)', fontSize: '1.2rem', flexShrink: 0 }} />
                {feature}
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Maybe Later</button>
          <button className="btn btn-primary btn-lg" onClick={handleUpgrade} disabled={processing}
            style={{ background: 'var(--gradient-premium)' }}>
            {processing ? 'Processing...' : `Upgrade Now — $${PREMIUM_PLANS.find(p => p.id === selectedPlan)?.price}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
