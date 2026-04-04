import { useNotifications } from '../context/NotificationContext';
import { formatTimestamp } from '../utils/helpers';
import { HiOutlineBell, HiOutlineHeart, HiOutlineChatAlt2, HiOutlineStar, HiOutlineShieldCheck, HiOutlineUserAdd, HiOutlineCheck } from 'react-icons/hi';

const iconMap = {
  like: <HiOutlineHeart style={{ color: 'var(--accent-pink)' }} />,
  message: <HiOutlineChatAlt2 style={{ color: 'var(--accent-green)' }} />,
  connect: <HiOutlineUserAdd style={{ color: 'var(--primary)' }} />,
  premium: <HiOutlineStar style={{ color: 'var(--accent-yellow)' }} />,
  report: <HiOutlineShieldCheck style={{ color: 'var(--accent-orange)' }} />,
  default: <HiOutlineBell style={{ color: 'var(--primary)' }} />,
};

const NotificationsPage = () => {
  const { notifications, markAsRead, markAllRead, unreadCount } = useNotifications();

  return (
    <div className="chat-list-page animate-fadeIn">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: '1.6rem' }}>Notifications 🔔</h1>
        {unreadCount > 0 && (
          <button className="btn btn-sm btn-ghost" onClick={markAllRead}>
            <HiOutlineCheck /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔔</div>
          <h3 className="empty-state-title">No notifications</h3>
          <p className="empty-state-text">You're all caught up! Start connecting to receive notifications.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {notifications.map(notif => (
            <div key={notif.id}
              onClick={() => !notif.read && markAsRead(notif.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                padding: '16px 20px', borderRadius: 'var(--radius-md)',
                background: notif.read ? 'transparent' : 'var(--bg-hover)',
                cursor: 'pointer', transition: 'all 0.2s ease',
                borderLeft: notif.read ? '3px solid transparent' : '3px solid var(--primary)',
              }}>
              <div style={{ fontSize: '1.3rem', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {iconMap[notif.type] || iconMap.default}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: notif.read ? '400' : '600', fontSize: '0.9rem' }}>{notif.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{notif.message}</div>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                {notif.createdAt ? formatTimestamp(notif.createdAt) : 'now'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
