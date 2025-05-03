import React, { useState } from 'react';
import { BellIcon, Package2Icon, AlertCircleIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';
interface Notification {
  id: number;
  icon: any;
  title: string;
  desc?: string;
  time: string;
  read: boolean;
}
const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([{
    id: 1,
    icon: Package2Icon,
    title: 'Đơn hàng #DH001 đã được giao thành công',
    time: '5 phút trước',
    read: false
  }, {
    icon: AlertCircleIcon,
    title: 'Đơn hàng #DH002 gặp sự cố khi giao',
    desc: 'Người nhận không có ở nhà, đơn hàng sẽ được giao lại vào ngày mai',
    time: '30 phút trước',
    read: false
  }, {
    icon: CheckCircleIcon,
    title: 'Thanh toán thành công',
    desc: 'Thanh toán đơn hàng #DH003 đã được xác nhận',
    time: '2 giờ trước',
    read: true
  }, {
    icon: ClockIcon,
    title: 'Nhắc nhở lịch giao hàng',
    desc: 'Bạn có 3 đơn hàng cần giao trong hôm nay',
    time: '1 ngày trước',
    read: true
  }]);
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({
      ...notif,
      read: true
    })));
  };
  const handleToggleRead = (id: number) => {
    setNotifications(notifications.map(notif => notif.id === id ? {
      ...notif,
      read: !notif.read
    } : notif));
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
        {notifications.map(notification => <div key={notification.id} className={`p-4 flex gap-4 ${notification.read ? 'bg-white' : 'bg-orange-50'} cursor-pointer hover:bg-gray-50`} onClick={() => handleToggleRead(notification.id)}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.read ? 'bg-gray-100' : 'bg-orange-100'}`}>
              <notification.icon className={`h-5 w-5 ${notification.read ? 'text-gray-600' : 'text-orange-500'}`} />
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