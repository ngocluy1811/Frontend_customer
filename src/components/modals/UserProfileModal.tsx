import React, { useState } from 'react';
import { UserIcon, KeyIcon, XIcon } from 'lucide-react';
interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const UserProfileModal = ({
  isOpen,
  onClose
}: UserProfileModalProps) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [userData] = useState({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0912345678',
    address: '219 Trung Kính, Cầu Giấy, Hà Nội'
  });
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-orange-500" />
            Thông tin tài khoản
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <XIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          {!isChangingPassword ? <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ tên
                </label>
                <input type="text" value={userData.name} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input type="email" value={userData.email} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input type="tel" value={userData.phone} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <textarea value={userData.address} rows={2} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" readOnly />
              </div>
              <button onClick={() => setIsChangingPassword(true)} className="mt-4 w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2">
                <KeyIcon className="h-4 w-4" />
                Đổi mật khẩu
              </button>
            </> : <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu hiện tại
                </label>
                <input type="password" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu mới
                </label>
                <input type="password" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <input type="password" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsChangingPassword(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Hủy
                </button>
                <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                  Cập nhật
                </button>
              </div>
            </>}
        </div>
      </div>
    </div>;
};
export default UserProfileModal;