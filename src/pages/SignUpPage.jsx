import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
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

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);

  const [formData, setFormData] = useState({
    displayName: '', username: '', email: '', phone: '', password: '', confirmPassword: '',
    age: '', gender: '', preferredGender: '', bio: '', city: '', region: '',
    interests: [],
  });

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : prev.interests.length < 5
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

  // Start resend timer
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Send OTP
  const handleSendOTP = async () => {
    setError('');
    setOtpMessage('');

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setOtpLoading(true);
    try {
      await authAPI.sendOTP(formData.email);
      setOtpSent(true);
      setOtpMessage('OTP sent to your email! Check your inbox.');
      startResendTimer();
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in instead.');
      } else {
        setError(err.message || 'Failed to send OTP. Please try again.');
      }
    }
    setOtpLoading(false);
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otpCode];
    newOtp[index] = value.slice(-1); // Only take the last digit
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otpCode];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtpCode(newOtp);
    if (pastedData.length > 0) {
      const focusIndex = Math.min(pastedData.length, 5);
      otpRefs.current[focusIndex]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    const code = otpCode.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setError('');
    setOtpLoading(true);
    try {
      await authAPI.verifyOTP(formData.email, code);
      setOtpVerified(true);
      setOtpMessage('Email verified successfully! ✅');
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    }
    setOtpLoading(false);
  };

  const validateStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.displayName || !formData.username || !formData.email || !formData.phone || !formData.password) {
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
      if (!/^[+]?[\d\s()-]{7,15}$/.test(formData.phone)) {
        setError('Please enter a valid phone number (7-15 digits)');
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
      if (!otpVerified) {
        setError('Please verify your email address first');
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
      const photoURL = photoPreview || '';
      await signup(formData.email, formData.password, { ...formData, photoURL });
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      const code = err.code || err.message || '';
      if (code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in instead.');
      } else if (code === 'auth/phone-already-in-use') {
        setError('This phone number is already registered.');
      } else if (code === 'auth/username-taken') {
        setError('This username is already taken.');
      } else if (code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else {
        setError(`Failed to create account: ${err.message || 'Unknown error'}.`);
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
                  <label className="form-label">Phone Number *</label>
                  <input type="tel" className="form-input" placeholder="+91 9876543210" value={formData.phone} onChange={e => updateField('phone', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={e => {
                        updateField('email', e.target.value);
                        // Reset OTP state when email changes
                        if (otpSent) {
                          setOtpSent(false);
                          setOtpVerified(false);
                          setOtpCode(['', '', '', '', '', '']);
                          setOtpMessage('');
                        }
                      }}
                      disabled={otpVerified}
                      style={{ flex: 1 }}
                    />
                    {!otpVerified && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleSendOTP}
                        disabled={otpLoading || !formData.email || resendTimer > 0}
                        style={{ whiteSpace: 'nowrap', height: '46px', padding: '0 16px', fontSize: '0.85rem' }}
                      >
                        {otpLoading ? '...' : otpSent ? (resendTimer > 0 ? `${resendTimer}s` : 'Resend') : 'Send OTP'}
                      </button>
                    )}
                    {otpVerified && (
                      <div style={{
                        height: '46px', display: 'flex', alignItems: 'center',
                        color: 'var(--accent-green)', fontSize: '1.2rem', padding: '0 8px'
                      }}>
                        ✅
                      </div>
                    )}
                  </div>
                </div>

                {/* OTP Input */}
                {otpSent && !otpVerified && (
                  <div className="form-group">
                    <label className="form-label">Enter 6-Digit OTP</label>
                    {otpMessage && (
                      <div style={{
                        fontSize: '0.8rem',
                        color: 'var(--accent-green)',
                        marginBottom: '10px',
                        background: 'rgba(0,184,148,0.1)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                      }}>
                        {otpMessage}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
                      {otpCode.map((digit, index) => (
                        <input
                          key={index}
                          ref={el => otpRefs.current[index] = el}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(index, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(index, e)}
                          onPaste={index === 0 ? handleOtpPaste : undefined}
                          className="form-input"
                          style={{
                            width: '48px',
                            height: '52px',
                            textAlign: 'center',
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            padding: '0',
                            letterSpacing: '0',
                            caretColor: 'var(--primary)',
                          }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleVerifyOTP}
                      disabled={otpLoading || otpCode.join('').length !== 6}
                      style={{ width: '100%' }}
                    >
                      {otpLoading ? 'Verifying...' : 'Verify Email'}
                    </button>
                  </div>
                )}

                {otpVerified && (
                  <div style={{
                    background: 'rgba(0,184,148,0.1)',
                    border: '1px solid rgba(0,184,148,0.3)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    marginBottom: '16px',
                    fontSize: '0.85rem',
                    color: 'var(--accent-green)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <HiOutlineCheck /> Email verified successfully!
                  </div>
                )}

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
