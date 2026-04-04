import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PRIVACY_OPTIONS } from '../utils/constants';
import { HiOutlineMoon, HiOutlineSun, HiOutlineShieldCheck, HiOutlineBell, HiOutlineUser, HiOutlineGlobe, HiOutlineLockClosed, HiOutlineTrash } from 'react-icons/hi';

const SettingsPage = () => {
  const { userProfile, updateUserProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [privacy, setPrivacy] = useState(userProfile?.privacy || { location: 'city', profile: 'everyone' });

  const handlePrivacyChange = async (field, value) => {
    const newPrivacy = { ...privacy, [field]: value };
    setPrivacy(newPrivacy);
    await updateUserProfile({ privacy: newPrivacy });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const Section = ({ title, icon, children }) => (
    <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', border: '1px solid var(--border-light)', marginBottom: 'var(--space-lg)' }}>
      <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>{icon} {title}</h3>
      {children}
    </div>
  );

  const SettingRow = ({ label, description, children }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
      <div><div style={{ fontWeight: '500', fontSize: '0.95rem' }}>{label}</div>
        {description && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{description}</div>}</div>
      {children}
    </div>
  );

  return (
    <div style={{ padding: 'var(--space-xl)', maxWidth: '700px', margin: '0 auto' }} className="animate-fadeIn">
      <h1 style={{ fontSize: '1.6rem', marginBottom: 'var(--space-xl)' }}>Settings ⚙️</h1>

      <Section title="Appearance" icon={<HiOutlineMoon />}>
        <SettingRow label="Theme" description="Switch between dark and light mode">
          <button className="btn btn-sm btn-secondary" onClick={toggleTheme}>
            {theme === 'dark' ? <><HiOutlineSun /> Light</> : <><HiOutlineMoon /> Dark</>}
          </button>
        </SettingRow>
      </Section>

      <Section title="Privacy & Safety" icon={<HiOutlineShieldCheck />}>
        <SettingRow label="Location Visibility" description="Control who can see your location">
          <select className="form-input" style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem' }}
            value={privacy.location} onChange={e => handlePrivacyChange('location', e.target.value)}>
            {PRIVACY_OPTIONS.location.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </SettingRow>
        <SettingRow label="Profile Visibility" description="Control who can see your profile">
          <select className="form-input" style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem' }}
            value={privacy.profile} onChange={e => handlePrivacyChange('profile', e.target.value)}>
            {PRIVACY_OPTIONS.profile.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </SettingRow>
        <SettingRow label="Blocked Users" description="Manage your blocked users list">
          <span className="badge badge-primary">{userProfile?.blockedUsers?.length || 0} blocked</span>
        </SettingRow>
      </Section>

      <Section title="Account" icon={<HiOutlineUser />}>
        <SettingRow label="Edit Profile">
          <button className="btn btn-sm btn-secondary" onClick={() => navigate('/edit-profile')}>Edit</button>
        </SettingRow>
        <SettingRow label="Premium Status">
          <span className={`badge ${userProfile?.isPremium ? 'badge-premium' : 'badge-primary'}`}>
            {userProfile?.isPremium ? '⭐ Premium' : 'Free'}
          </span>
        </SettingRow>
        <SettingRow label="Email">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{userProfile?.email}</span>
        </SettingRow>
      </Section>

      <Section title="Notifications" icon={<HiOutlineBell />}>
        <SettingRow label="Push Notifications" description="Get notified about matches and messages">
          <button className="btn btn-sm btn-primary">Enabled</button>
        </SettingRow>
      </Section>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: 'var(--space-xl)' }}>
        <button className="btn btn-danger" onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
};

export default SettingsPage;
