import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PackageIcon, ClipboardListIcon, MapPinIcon, HelpCircleIcon, BellIcon, FileTextIcon, TicketIcon } from 'lucide-react';
const Sidebar = () => {
  const location = useLocation();
  const menuItems = [{
    icon: ClipboardListIcon,
    text: 'ĐƠN HÀNG',
    path: '/orders'
  }, {
    icon: FileTextIcon,
    text: 'LỊCH SỬ ĐƠN HÀNG',
    path: '/orders/history'
  }, {
    icon: MapPinIcon,
    text: 'QUẢN LÝ ĐỊA CHỈ',
    path: '/address'
  }, {
    icon: HelpCircleIcon,
    text: 'HỖ TRỢ',
    path: '/support'
  }, {
    icon: TicketIcon,
    text: 'QUẢN LÝ COUPON',
    path: '/coupons'
  }, {
    icon: BellIcon,
    text: 'THÔNG BÁO',
    path: '/notifications'
  }];
  return <div className="w-64 bg-[#D97706] text-white min-h-screen">
      <Link to="/" className="block p-4">
        <img src="https://ship.com.vn/images/logo.png" alt="Logo" className="h-12" />
      </Link>
      <nav className="mt-6">
        <Link to="/orders/new" className="block px-4 py-2 bg-orange-600 hover:bg-orange-700">
          <div className="w-full text-left flex items-center space-x-3 text-sm font-medium">
            <PackageIcon className="h-5 w-5" />
            <span>TẠO ĐƠN VẬN</span>
          </div>
        </Link>
        <div className="mt-4 px-4 space-y-2">
          {menuItems.map((item, index) => <Link key={index} to={item.path} className={`block w-full text-left flex items-center space-x-3 p-2 rounded ${location.pathname === item.path ? 'bg-orange-600' : 'hover:bg-orange-600'} text-sm`}>
              <item.icon className="h-5 w-5" />
              <span>{item.text}</span>
            </Link>)}
        </div>
      </nav>
    </div>;
};
export default Sidebar;