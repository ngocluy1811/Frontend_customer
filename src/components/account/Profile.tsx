import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, EditIcon, SaveIcon, XIcon, KeyIcon } from 'lucide-react';
import api from '../../lib/api';

interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<{ name: string; email: string }>({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users/me');
        const data = res.data as unknown;
        setUser(data as UserProfile);
        setForm({ name: (data as any).name, email: (data as any).email });
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Không thể tải thông tin tài khoản');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">{error}</div>;
  }

  return <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-20 h-20 rounded-full border bg-orange-100 flex items-center justify-center">
        <UserIcon className="h-10 w-10 text-orange-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <UserIcon className="h-6 w-6 text-orange-500" />
          {user?.name}
        </h2>
        <div className="text-gray-500">{user?.role === 'customer' ? 'Khách hàng' : user?.role}</div>
        <div className="text-xs text-gray-400">ID: {user?.user_id}</div>
        <div className="text-xs text-gray-400">Tạo lúc: {user?.created_at && new Date(user.created_at).toLocaleString()}</div>
      </div>
    </div>
    <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" disabled={!editMode} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" disabled={!editMode} />
      </div>
      <div className="flex gap-2 mt-6">
        {!editMode ? (
          <button type="button" onClick={() => setEditMode(true)} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2">
            <EditIcon className="h-4 w-4" />
            Chỉnh sửa
          </button>
        ) : (
          <>
            <button type="submit" className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2">
              <SaveIcon className="h-4 w-4" />
              Lưu
            </button>
            <button type="button" onClick={() => { setEditMode(false); setForm({ name: user!.name, email: user!.email }); }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
              <XIcon className="h-4 w-4" />
              Hủy
            </button>
          </>
        )}
        <button type="button" onClick={() => navigate('/account/change-password')} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2">
          <KeyIcon className="h-4 w-4" />
          Đổi mật khẩu
        </button>
      </div>
      {success && <div className="text-green-600 text-center mt-2">{success}</div>}
      {error && <div className="text-red-600 text-center mt-2">{error}</div>}
    </form>
  </div>;
};

export default Profile; 