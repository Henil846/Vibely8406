import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
import { GENDERS, PREFERRED_GENDERS, INTERESTS, MOODS, COMMUNICATION_MODES, PRIVACY_OPTIONS, DEFAULT_AVATAR } from '../utils/constants';
import MoodSelector from '../components/MoodSelector';
import { HiOutlineCamera, HiOutlineCheck } from 'react-icons/hi';
import './Profile.css';

const EditProfilePage = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    username: userProfile?.username || '',
    age: userProfile?.age || '',
    gender: userProfile?.gender || '',
    preferredGender: userProfile?.preferredGender || '',
    bio: userProfile?.bio || '',
    city: userProfile?.city || '',
    region: userProfile?.region || '',
    mood: userProfile?.mood || '',
    communicationMode: userProfile?.communicationMode || 'text',
    interests: userProfile?.interests || [],
    privacy: userProfile?.privacy || { location: 'city', profile: 'everyone' },
  });

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) { setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let photoURL = userProfile?.photoURL || '';
      if (photoFile) {
        const storageRef = ref(storage, `profilePhotos/${userProfile.uid}_${Date.now()}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }
      await updateUserProfile({ ...formData, photoURL });
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <div className="profile-page animate-fadeIn">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: '1.6rem' }}>Edit Profile</h1>
        <button className="btn btn-ghost" onClick={() => navigate('/profile')}>Cancel</button>
      </div>

      {success && (
        <div style={{ background: 'rgba(0,184,148,0.1)', border: '1px solid rgba(0,184,148,0.2)', borderRadius: 'var(--radius-md)', padding: '14px 20px', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-green)' }}>
          <HiOutlineCheck /> Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="profile-section">
          <h3>Profile Photo</h3>
          <div style={{ textAlign: 'center' }}>
            <div className="photo-upload-area" onClick={() => fileInputRef.current?.click()} style={{ width: '100px', height: '100px', margin: '0 auto 16px' }}>
              <img src={photoPreview || userProfile?.photoURL || DEFAULT_AVATAR} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => fileInputRef.current?.click()}><HiOutlineCamera /> Change Photo</button>
          </div>
        </div>

        <div className="profile-section">
          <h3>Basic Info</h3>
          <div className="edit-form-row">
            <div className="form-group"><label className="form-label">Display Name</label>
              <input type="text" className="form-input" value={formData.displayName} onChange={e => updateField('displayName', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Username</label>
              <input type="text" className="form-input" value={formData.username} onChange={e => updateField('username', e.target.value)} /></div>
          </div>
          <div className="edit-form-row">
            <div className="form-group"><label className="form-label">Age</label>
              <input type="number" className="form-input" min="16" max="100" value={formData.age} onChange={e => updateField('age', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Gender</label>
              <select className="form-input form-select" value={formData.gender} onChange={e => updateField('gender', e.target.value)}>
                {GENDERS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
              </select></div>
          </div>
          <div className="form-group"><label className="form-label">Preferred Gender</label>
            <select className="form-input form-select" value={formData.preferredGender} onChange={e => updateField('preferredGender', e.target.value)}>
              {PREFERRED_GENDERS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
            </select></div>
          <div className="form-group"><label className="form-label">Bio</label>
            <textarea className="form-input form-textarea" value={formData.bio} onChange={e => updateField('bio', e.target.value)} maxLength={200} rows={3} /></div>
          <div className="edit-form-row">
            <div className="form-group"><label className="form-label">City</label>
              <input type="text" className="form-input" value={formData.city} onChange={e => updateField('city', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Region/State</label>
              <input type="text" className="form-input" value={formData.region} onChange={e => updateField('region', e.target.value)} /></div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Communication Mode</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {COMMUNICATION_MODES.map(mode => (
              <button key={mode.id} type="button" className={`discover-comm-mode-btn ${formData.communicationMode === mode.id ? 'active' : ''}`}
                onClick={() => updateField('communicationMode', mode.id)}>
                {mode.icon} {mode.label}
              </button>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h3>Current Mood</h3>
          <MoodSelector selectedMood={formData.mood} onSelect={(m) => updateField('mood', m)} compact />
        </div>

        <div className="profile-section">
          <h3>Interests</h3>
          <div className="interests-grid">
            {INTERESTS.map(interest => (
              <button key={interest} type="button" className={`interest-chip ${formData.interests.includes(interest) ? 'selected' : ''}`}
                onClick={() => toggleInterest(interest)}>{interest}</button>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h3>Privacy Settings</h3>
          <div className="form-group"><label className="form-label">Location Visibility</label>
            <select className="form-input form-select" value={formData.privacy.location}
              onChange={e => updateField('privacy', { ...formData.privacy, location: e.target.value })}>
              {PRIVACY_OPTIONS.location.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select></div>
          <div className="form-group"><label className="form-label">Profile Visibility</label>
            <select className="form-input form-select" value={formData.privacy.profile}
              onChange={e => updateField('privacy', { ...formData.privacy, profile: e.target.value })}>
              {PRIVACY_OPTIONS.profile.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select></div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/profile')}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes ✓'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
