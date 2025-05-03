import React, { useEffect, useState } from 'react';
import { MapPinIcon, PlusIcon, StarIcon, PencilIcon, TrashIcon } from 'lucide-react';
import AddAddressModal from '../modals/AddAddressModal';
import api from '../../lib/api';

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

const AddressManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/addresses');
      const data = res.data as unknown;
      setAddresses(((data as any).addresses || data) as Address[]);
    } catch (err) {
      setError('Không thể tải danh sách địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      try {
        setLoading(true);
        await api.delete(`/addresses/${id}`);
        setSuccess('Xóa địa chỉ thành công!');
        fetchAddresses();
      } catch (err) {
        setError('Xóa địa chỉ thất bại');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setLoading(true);
      await api.patch(`/addresses/${id}/default`);
      setSuccess('Đặt địa chỉ mặc định thành công!');
      fetchAddresses();
    } catch (err) {
      setError('Đặt mặc định thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (address: Address) => {
    try {
      setLoading(true);
      if (editingAddress) {
        await api.put(`/addresses/${editingAddress.id}`, address);
        setSuccess('Cập nhật địa chỉ thành công!');
      } else {
        await api.post('/addresses', address);
        setSuccess('Thêm địa chỉ thành công!');
      }
      fetchAddresses();
    } catch (err) {
      setError('Lưu địa chỉ thất bại');
    } finally {
      setLoading(false);
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setEditingAddress(null);
    }
  };

  return <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý địa chỉ</h1>
        <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Thêm địa chỉ mới
        </button>
      </div>
      {loading ? <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div> : error ? <div className="text-center text-red-600 p-4">{error}</div> : <>
      <div className="grid grid-cols-2 gap-6">
        {addresses.map(address => <div key={address.id} className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-orange-500" />
                <span className="font-medium">{address.label}</span>
                {address.isDefault && <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded text-xs">
                    Mặc định
                  </span>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(address)} className="p-1 hover:bg-gray-100 rounded">
                  <PencilIcon className="h-4 w-4 text-gray-600" />
                </button>
                <button onClick={() => handleDelete(address.id)} className="p-1 hover:bg-gray-100 rounded">
                  <TrashIcon className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-gray-600">
              <div>{address.name}</div>
              <div>{address.phone}</div>
              <div>{address.address}</div>
            </div>
            {!address.isDefault && <button onClick={() => handleSetDefault(address.id)} className="text-orange-500 text-sm flex items-center gap-1 hover:text-orange-600">
                <StarIcon className={`h-4 w-4 ${address.isDefault ? 'fill-orange-500' : 'fill-none'}`} />
                Đặt làm địa chỉ mặc định
              </button>}
          </div>)}
      </div>
      {success && <div className="text-green-600 text-center mt-2">{success}</div>}
      </>}
      <AddAddressModal isOpen={isAddModalOpen || isEditModalOpen} onClose={() => {
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setEditingAddress(null);
    }} onSave={handleSave as any} editingAddress={editingAddress as any} />
    </div>;
};
export default AddressManagement;