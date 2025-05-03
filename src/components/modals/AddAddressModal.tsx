import React, { useEffect, useState } from 'react';
import { MapPinIcon, XIcon } from 'lucide-react';
interface Address {
  id?: number;
  label: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}
interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
  editingAddress?: Address | null;
}
const AddAddressModal = ({
  isOpen,
  onClose,
  onSave,
  editingAddress
}: AddAddressModalProps) => {
  const [formData, setFormData] = useState<Address>({
    label: '',
    name: '',
    phone: '',
    address: '',
    isDefault: false
  });
  useEffect(() => {
    if (editingAddress) {
      setFormData(editingAddress);
    } else {
      setFormData({
        label: '',
        name: '',
        phone: '',
        address: '',
        isDefault: false
      });
    }
  }, [editingAddress]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-orange-500" />
            {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <XIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhãn địa chỉ
            </label>
            <input type="text" value={formData.label} onChange={e => setFormData({
            ...formData,
            label: e.target.value
          })} placeholder="VD: Nhà riêng, Công ty..." className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ tên người nhận
            </label>
            <input type="text" value={formData.name} onChange={e => setFormData({
            ...formData,
            name: e.target.value
          })} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input type="tel" value={formData.phone} onChange={e => setFormData({
            ...formData,
            phone: e.target.value
          })} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ chi tiết
            </label>
            <textarea value={formData.address} onChange={e => setFormData({
            ...formData,
            address: e.target.value
          })} rows={3} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Số nhà, tên đường..." />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="default" checked={formData.isDefault} onChange={e => setFormData({
            ...formData,
            isDefault: e.target.checked
          })} className="rounded" />
            <label htmlFor="default" className="text-sm">
              Đặt làm địa chỉ mặc định
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Hủy
            </button>
            <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              {editingAddress ? 'Cập nhật' : 'Lưu địa chỉ'}
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default AddAddressModal;