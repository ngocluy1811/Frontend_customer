import React, { useEffect, useState } from 'react';
import { UserIcon, KeyIcon, XIcon } from 'lucide-react';
import api from '../../lib/api';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal = ({ isOpen, onClose }: UserProfileModalProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<{ name: string; email: string; phone?: string; address?: string }>({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users/me');
        const data = res.data as unknown;
        setUser(data as UserProfile);
        setForm({
          name: (data as any).name,
          email: (data as any).email,
          phone: (data as any).phone || '',
          address: (data as any).address || ''
        });
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Không thể tải thông tin tài khoản');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.put('/users/me', form);
      setUser(prev => prev ? { ...prev, ...form } : null);
      setEditMode(false);
      setSuccess('Cập nhật thông tin thành công!');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

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
      {loading ? <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div> : error ? <div className="text-center text-red-600 p-4">{error}</div> : <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" disabled={!editMode} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" disabled={!editMode} />
        </div>
        {form.phone !== undefined && <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" disabled={!editMode} />
        </div>}
        {form.address !== undefined && <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
          <textarea name="address" value={form.address} onChange={handleChange} rows={2} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" disabled={!editMode} />
        </div>}
        <div className="flex gap-2 mt-6">
          {!editMode ? (
            <button type="button" onClick={() => setEditMode(true)} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2">
              Chỉnh sửa
            </button>
          ) : (
            <>
              <button type="submit" className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2">
                Lưu
              </button>
              <button type="button" onClick={() => { setEditMode(false); setForm({ name: user!.name, email: user!.email, phone: user?.phone, address: user?.address }); }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                Hủy
              </button>
            </>
          )}
          <button type="button" onClick={() => { onClose(); navigate('/account/change-password'); }} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2">
            <KeyIcon className="h-4 w-4" />
            Đổi mật khẩu
          </button>
        </div>
        {success && <div className="text-green-600 text-center mt-2">{success}</div>}
        {error && <div className="text-red-600 text-center mt-2">{error}</div>}
      </form>}
    </div>
  </div>;
};
export default UserProfileModal;