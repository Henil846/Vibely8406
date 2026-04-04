import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, getDocs, orderBy, doc, updateDoc, where } from 'firebase/firestore';
import { formatTimestamp } from '../utils/helpers';
import { DEFAULT_AVATAR, REPORT_CATEGORIES } from '../utils/constants';
import { HiOutlineShieldCheck, HiOutlineUsers, HiOutlineFlag, HiOutlineBan, HiOutlineCheck, HiOutlineEye, HiOutlineStar, HiOutlineTrendingUp } from 'react-icons/hi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const reportsSnap = await getDocs(query(collection(db, 'reports'), orderBy('createdAt', 'desc')));
      setReports(reportsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const usersSnap = await getDocs(query(collection(db, 'users')));
      setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleReportAction = async (reportId, action) => {
    await updateDoc(doc(db, 'reports', reportId), { status: action, resolvedAt: new Date() });
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: action } : r));
  };

  const handleUserAction = async (userId, action) => {
    const updates = {};
    if (action === 'suspend') updates.isSuspended = true;
    if (action === 'unsuspend') updates.isSuspended = false;
    if (action === 'ban') updates.isBanned = true;
    await updateDoc(doc(db, 'users', userId), updates);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
  };

  const stats = [
    { icon: <HiOutlineUsers />, label: 'Total Users', value: users.length, color: 'var(--primary)' },
    { icon: <HiOutlineStar />, label: 'Premium Users', value: users.filter(u => u.isPremium).length, color: 'var(--accent-pink)' },
    { icon: <HiOutlineFlag />, label: 'Open Reports', value: reports.filter(r => r.status === 'pending').length, color: 'var(--accent-orange)' },
    { icon: <HiOutlineTrendingUp />, label: 'Online Now', value: users.filter(u => u.isOnline).length, color: 'var(--accent-green)' },
  ];

  const tabs = [
    { id: 'reports', label: 'Reports', icon: <HiOutlineFlag /> },
    { id: 'users', label: 'Users', icon: <HiOutlineUsers /> },
  ];

  return (
    <div style={{ padding: 'var(--space-xl)', maxWidth: '1100px', margin: '0 auto' }} className="animate-fadeIn">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-xl)' }}>
        <HiOutlineShieldCheck style={{ fontSize: '1.5rem', color: 'var(--primary)' }} />
        <h1 style={{ fontSize: '1.6rem' }}>Admin Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', color: stat.color, marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-primary)', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-xl)' }}>
        {tabs.map(tab => (
          <button key={tab.id} className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setActiveTab(tab.id)}>{tab.icon} {tab.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: '60px 0' }}><div className="spinner" /></div>
      ) : activeTab === 'reports' ? (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border-light)', fontWeight: '600' }}>
            Reports ({reports.length})
          </div>
          {reports.length === 0 ? (
            <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--text-secondary)' }}>No reports yet</div>
          ) : (
            reports.map(report => (
              <div key={report.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md) var(--space-lg)', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                    {REPORT_CATEGORIES.find(c => c.id === report.category)?.label || report.category}
                  </div>
                  {report.details && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{report.details}</div>}
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{report.createdAt ? formatTimestamp(report.createdAt) : ''}</div>
                </div>
                <span className={`badge ${report.status === 'pending' ? 'badge-warning' : report.status === 'resolved' ? 'badge-success' : 'badge-danger'}`}>
                  {report.status}
                </span>
                {report.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => handleReportAction(report.id, 'resolved')} title="Resolve"><HiOutlineCheck /></button>
                    <button className="btn btn-sm btn-ghost" style={{ color: 'var(--accent-pink)' }} onClick={() => handleReportAction(report.id, 'action-taken')} title="Take Action"><HiOutlineBan /></button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border-light)', fontWeight: '600' }}>
            Users ({users.length})
          </div>
          {users.map(user => (
            <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md) var(--space-lg)', borderBottom: '1px solid var(--border-light)' }}>
              <img src={user.photoURL || DEFAULT_AVATAR} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {user.displayName}
                  {user.isPremium && <span className="badge badge-premium" style={{ fontSize: '0.6rem' }}>Premium</span>}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>@{user.username} · {user.email}</div>
              </div>
              <div className={`badge ${user.isOnline ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.7rem' }}>
                {user.isOnline ? 'Online' : 'Offline'}
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn btn-sm btn-ghost" title="View"><HiOutlineEye /></button>
                {!user.isSuspended ? (
                  <button className="btn btn-sm btn-ghost" style={{ color: 'var(--accent-orange)' }}
                    onClick={() => handleUserAction(user.id, 'suspend')} title="Suspend"><HiOutlineBan /></button>
                ) : (
                  <button className="btn btn-sm btn-ghost" style={{ color: 'var(--accent-green)' }}
                    onClick={() => handleUserAction(user.id, 'unsuspend')} title="Unsuspend"><HiOutlineCheck /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
