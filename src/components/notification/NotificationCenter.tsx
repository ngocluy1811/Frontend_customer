import React, { useEffect, useState } from 'react';
import { BellIcon } from 'lucide-react';
import api from '../../lib/api';

interface Notification {
  id: string;
  title: string;
  desc?: string;
  time: string;
  read: boolean;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      const data = res.data as unknown;
      setNotifications(((data as any).notifications || data) as Notification[]);
    } catch (err) {
      setError('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await api.post('/notifications/mark-all-read');
      fetchNotifications();
    } catch {}
  };

  const handleToggleRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/toggle-read`);
      fetchNotifications();
    } catch {}
  };

  return <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BellIcon className="h-6 w-6 text-orange-500" />
          Thông báo
        </h1>
        <button onClick={handleMarkAllAsRead} className="text-orange-500 text-sm hover:text-orange-600">
          Đánh dấu tất cả đã đọc
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm divide-y">
        {loading ? <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
        </div> : error ? <div className="text-center text-red-600 p-4">{error}</div> :
        notifications.length === 0 ? <div className="p-6 text-center text-gray-500">Không có thông báo nào</div> :
        notifications.map(notification => <div key={notification.id} className={`p-4 flex gap-4 ${notification.read ? 'bg-white' : 'bg-orange-50'} cursor-pointer hover:bg-gray-50`} onClick={() => handleToggleRead(notification.id)}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.read ? 'bg-gray-100' : 'bg-orange-100'}`}>
              <BellIcon className={`h-5 w-5 ${notification.read ? 'text-gray-600' : 'text-orange-500'}`} />
            </div>
            <div className="flex-1">
              <div className="font-medium">{notification.title}</div>
              {notification.desc && <div className="text-sm text-gray-600 mt-1">
                  {notification.desc}
                </div>}
              <div className="text-sm text-gray-500 mt-1">
                {notification.time}
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};
export default NotificationCenter;