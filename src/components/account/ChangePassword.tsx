import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyIcon, ArrowLeftIcon } from 'lucide-react';
import api from '../../lib/api';

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }
    try {
      setLoading(true);
      await api.post('/users/change-password', {
        currentPassword,
        newPassword
      });
      setSuccess('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/account/profile'), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
    <button onClick={() => navigate('/account/profile')} className="mb-4 flex items-center gap-2 text-gray-600 hover:text-orange-600">
      <ArrowLeftIcon className="h-5 w-5" />
      Quay lại thông tin cá nhân
    </button>
    <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
      <KeyIcon className="h-6 w-6 text-orange-500" />
      Đổi mật khẩu
    </h2>
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" required />
      </div>
      <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2 disabled:opacity-50">
        {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
      </button>
      {success && <div className="text-green-600 text-center mt-2">{success}</div>}
      {error && <div className="text-red-600 text-center mt-2">{error}</div>}
    </form>
  </div>;
};

export default ChangePassword; 