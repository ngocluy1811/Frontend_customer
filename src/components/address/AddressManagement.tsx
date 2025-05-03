import React, { useState } from 'react';
import { MapPinIcon, PlusIcon, StarIcon, PencilIcon, TrashIcon } from 'lucide-react';
import AddAddressModal from '../modals/AddAddressModal';
interface Address {
  id: number;
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
  const [addresses, setAddresses] = useState<Address[]>([{
    id: 1,
    label: 'Nhà riêng',
    name: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '219 Trung Kính, Cầu Giấy, Hà Nội',
    isDefault: true
  }, {
    id: 2,
    label: 'Văn phòng',
    name: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '48 Tố Hữu, Nam Từ Liêm, Hà Nội',
    isDefault: false
  }, {
    id: 3,
    label: 'Nhà người thân',
    name: 'Trần Thị B',
    phone: '0987654321',
    address: '36 Hoàng Cầu, Đống Đa, Hà Nội',
    isDefault: false
  }]);
  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsEditModalOpen(true);
  };
  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };
  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };
  const handleSave = (address: Address) => {
    if (editingAddress) {
      if (address.isDefault) {
        setAddresses(addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === editingAddress.id ? true : false
        })));
      } else {
        if (editingAddress.isDefault) {
          setAddresses(addresses.map(addr => addr.id === editingAddress.id ? {
            ...address,
            id: addr.id,
            isDefault: true
          } : addr));
        } else {
          setAddresses(addresses.map(addr => addr.id === editingAddress.id ? {
            ...address,
            id: addr.id
          } : addr));
        }
      }
    } else {
      if (address.isDefault) {
        setAddresses([...addresses.map(addr => ({
          ...addr,
          isDefault: false
        })), {
          ...address,
          id: addresses.length + 1
        }]);
      } else {
        setAddresses([...addresses, {
          ...address,
          id: addresses.length + 1
        }]);
      }
    }
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingAddress(null);
  };
  return <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý địa chỉ</h1>
        <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Thêm địa chỉ mới
        </button>
      </div>
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
      <AddAddressModal isOpen={isAddModalOpen || isEditModalOpen} onClose={() => {
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setEditingAddress(null);
    }} onSave={handleSave} editingAddress={editingAddress} />
    </div>;
};
export default AddressManagement;