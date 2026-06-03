import { useApp } from '../context/AppContext';

export default function Notification() {
  const { state } = useApp();
  const { notification } = state;

  if (!notification) return null;

  const bgColor = notification.type === 'error' ? 'bg-red-600' : 'bg-green-600';

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}>
        <span className="text-lg">
          {notification.type === 'error' ? '✕' : '✓'}
        </span>
        <span>{notification.message}</span>
      </div>
    </div>
  );
}
