import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
import { GENDERS, PREFERRED_GENDERS, INTERESTS } from '../utils/constants';
import { validateEmail, validatePassword, validateUsername } from '../utils/helpers';
import { HiOutlineCamera, HiOutlineCheck } from 'react-icons/hi';
import './Auth.css';

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    displayName: '', username: '', email: '', password: '', confirmPassword: '',
    age: '', gender: '', preferredGender: '', bio: '', city: '', region: '',
    interests: [],
  });

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : prev.interests.length < (formData.isPremium ? 15 : 5)
          ? [...prev.interests, interest]
          : prev.interests
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const validateStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.displayName || !formData.username || !formData.email || !formData.password) {
        setError('Please fill in all required fields');
        return false;
      }
      if (!validateUsername(formData.username)) {
        setError('Username must be 3-20 characters, letters, numbers, and underscores only');
        return false;
      }
      if (!validateEmail(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
      if (!validatePassword(formData.password)) {
        setError('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.age || !formData.gender || !formData.preferredGender) {
        setError('Please fill in all required fields');
        return false;
      }
      if (parseInt(formData.age) < 16 || parseInt(formData.age) > 100) {
        setError('You must be at least 16 years old');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => { if (validateStep()) setStep(prev => prev + 1); };
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    setError('');
    try {
      let photoURL = '';
      if (photoFile) {
        const storageRef = ref(storage, `profilePhotos/${formData.username}_${Date.now()}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }
      await signup(formData.email, formData.password, { ...formData, photoURL });
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      const code = err.code || err.message || '';
      if (code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in instead.');
      } else if (code.includes('CONFIGURATION_NOT_FOUND') || code === 'auth/configuration-not-found') {
        setError('Firebase Auth not enabled. Go to Firebase Console → Authentication → Sign-in method → Enable Email/Password.');
      } else if (code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else if (code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else if (code === 'auth/invalid-email') {
        setError('Invalid email address format.');
      } else {
        setError(`Failed to create account: ${code || 'Unknown error'}. Check browser console for details.`);
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <span className="auth-left-emoji">✨</span>
          <h1>Join MoodLink</h1>
          <p>Create your vibe profile and start connecting with people who match your energy.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card" style={{ maxWidth: '480px' }}>
          <div className="auth-card-header">
            <h2>Create Account</h2>
            <p>Step {step} of 3</p>
          </div>

          <div className="signup-steps">
            {[1, 2, 3].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className={`signup-step ${s < step ? 'completed' : s === step ? 'active' : 'inactive'}`}>
                  {s < step ? <HiOutlineCheck /> : s}
                </div>
                {s < 3 && <div className={`signup-step-line ${s < step ? 'active' : ''}`} />}
              </div>
            ))}
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" className="form-input" placeholder="Your full name" value={formData.displayName} onChange={e => updateField('displayName', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Username *</label>
                  <input type="text" className="form-input" placeholder="your_username" value={formData.username} onChange={e => updateField('username', e.target.value.toLowerCase())} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" className="form-input" placeholder="you@example.com" value={formData.email} onChange={e => updateField('email', e.target.value)} />
                </div>
                <div className="auth-form-row">
                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input type="password" className="form-input" placeholder="Min 6 chars" value={formData.password} onChange={e => updateField('password', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm *</label>
                    <input type="password" className="form-input" placeholder="Re-enter" value={formData.confirmPassword} onChange={e => updateField('confirmPassword', e.target.value)} />
                  </div>
                </div>
                <button type="button" className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={nextStep}>Continue</button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="auth-form-row">
                  <div className="form-group">
                    <label className="form-label">Age *</label>
                    <input type="number" className="form-input" placeholder="Your age" min="16" max="100" value={formData.age} onChange={e => updateField('age', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender *</label>
                    <select className="form-input form-select" value={formData.gender} onChange={e => updateField('gender', e.target.value)}>
                      <option value="">Select</option>
                      {GENDERS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Who do you want to talk with? *</label>
                  <select className="form-input form-select" value={formData.preferredGender} onChange={e => updateField('preferredGender', e.target.value)}>
                    <option value="">Select preference</option>
                    {PREFERRED_GENDERS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                  </select>
                </div>
                <div className="auth-form-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input type="text" className="form-input" placeholder="Your city" value={formData.city} onChange={e => updateField('city', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Region/State</label>
                    <input type="text" className="form-input" placeholder="Your region" value={formData.region} onChange={e => updateField('region', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Short Bio</label>
                  <textarea className="form-input form-textarea" placeholder="Tell people about yourself..." value={formData.bio} onChange={e => updateField('bio', e.target.value)} rows={3} maxLength={200} />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={prevStep}>Back</button>
                  <button type="button" className="btn btn-primary" style={{ flex: 2 }} onClick={nextStep}>Continue</button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div className="photo-upload-area" onClick={() => fileInputRef.current?.click()}>
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" />
                    ) : (
                      <>
                        <HiOutlineCamera className="upload-icon" />
                        <span className="upload-text">Add Photo</span>
                      </>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                </div>

                <div className="form-group">
                  <label className="form-label">Select Interests (up to 5)</label>
                  <div className="interests-grid">
                    {INTERESTS.map(interest => (
                      <button key={interest} type="button"
                        className={`interest-chip ${formData.interests.includes(interest) ? 'selected' : ''}`}
                        onClick={() => toggleInterest(interest)}>
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={prevStep}>Back</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account 🎉'}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="auth-link">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
