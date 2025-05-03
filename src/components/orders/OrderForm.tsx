import React from 'react';
import { Package2Icon, TruckIcon, MapPinIcon } from 'lucide-react';
const OrderForm = () => {
  return <div className="bg-white rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold">Tạo đơn hàng mới</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Package2Icon className="h-5 w-5" />
            Thông tin người gửi
          </h3>
          <div className="space-y-3">
            <input type="text" placeholder="Tên người gửi" className="w-full p-2 border rounded" />
            <input type="text" placeholder="Số điện thoại" className="w-full p-2 border rounded" />
            <textarea placeholder="Địa chỉ lấy hàng" className="w-full p-2 border rounded" rows={3} />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <TruckIcon className="h-5 w-5" />
            Thông tin người nhận
          </h3>
          <div className="space-y-3">
            <input type="text" placeholder="Tên người nhận" className="w-full p-2 border rounded" />
            <input type="text" placeholder="Số điện thoại" className="w-full p-2 border rounded" />
            <textarea placeholder="Địa chỉ giao hàng" className="w-full p-2 border rounded" rows={3} />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <MapPinIcon className="h-5 w-5" />
          Thông tin hàng hóa
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Loại hàng hóa" className="p-2 border rounded" />
          <input type="number" placeholder="Trọng lượng (kg)" className="p-2 border rounded" />
          <input type="text" placeholder="Kích thước" className="p-2 border rounded" />
          <input type="text" placeholder="Giá trị hàng" className="p-2 border rounded" />
        </div>
        <div className="flex gap-4">
          <select className="flex-1 p-2 border rounded">
            <option>Chọn dịch vụ vận chuyển</option>
            <option>Giao hàng nhanh</option>
            <option>Giao hàng tiết kiệm</option>
          </select>
          <input type="text" placeholder="Mã giảm giá" className="flex-1 p-2 border rounded" />
        </div>
      </div>
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
          Tạo đơn hàng
        </button>
      </div>
    </div>;
};
export default OrderForm;