import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, UserIcon, BellIcon } from 'lucide-react';
import UserProfileModal from './modals/UserProfileModal';
const Header = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const handleNotificationClick = () => {
    navigate('/notifications');
    setUnreadCount(0);
  };
  return <header className="bg-white shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <input type="text" placeholder="Nhập mã đơn vận, tên người nhận, số điện thoại người nhận..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center space-x-4 ml-4">
          <button className="relative" onClick={handleNotificationClick}>
            <BellIcon className="h-6 w-6 text-gray-600" />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>}
          </button>
          <button onClick={() => setIsProfileOpen(true)} className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg">
            <UserIcon className="h-6 w-6 text-gray-600" />
            <span className="text-sm font-medium">Tài khoản</span>
          </button>
        </div>
      </div>
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </header>;
};
export default Header;