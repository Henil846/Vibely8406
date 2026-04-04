import { useState } from 'react';
import { REPORT_CATEGORIES } from '../utils/constants';
import { HiOutlineX } from 'react-icons/hi';

const ReportModal = ({ user, onClose, onSubmit }) => {
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) return;
    setSubmitting(true);
    try {
      await onSubmit?.({ userId: user.uid, category, details });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-body" style={{ textAlign: 'center', padding: '48px 32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
            <h3 style={{ marginBottom: '8px' }}>Report Submitted</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Thank you for helping keep MoodLink safe. Our team will review this report.</p>
            <button className="btn btn-primary" onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Report @{user?.username}</h3>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><HiOutlineX /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
              Select a reason for reporting this user. False reports may result in action against your account.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {REPORT_CATEGORIES.map(cat => (
                <label key={cat.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                  borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  background: category === cat.id ? 'rgba(108, 92, 231, 0.1)' : 'var(--bg-input)',
                  border: `2px solid ${category === cat.id ? 'var(--primary)' : 'transparent'}`,
                  transition: 'all 0.2s ease'
                }}>
                  <input type="radio" name="report-category" value={cat.id}
                    checked={category === cat.id} onChange={() => setCategory(cat.id)}
                    style={{ display: 'none' }} />
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    border: `2px solid ${category === cat.id ? 'var(--primary)' : 'var(--text-tertiary)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {category === cat.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }} />}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: category === cat.id ? '600' : '400' }}>{cat.label}</span>
                </label>
              ))}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Additional details (optional)</label>
              <textarea className="form-input form-textarea" placeholder="Provide more information..."
                value={details} onChange={e => setDetails(e.target.value)} rows={3} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-danger" disabled={!category || submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
