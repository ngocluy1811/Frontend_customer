import React from 'react';
import { PackageIcon, TruckIcon } from 'lucide-react';
const WarehouseManagement = () => {
  return <div className="space-y-6">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Quản lý kho</h2>
        <div className="grid grid-cols-3 gap-6">
          {[{
          name: 'Kho Mỹ Đình',
          location: 'Nam Từ Liêm, Hà Nội',
          capacity: '5000',
          current: '3240',
          icon: PackageIcon
        }, {
          name: 'Kho Cầu Giấy',
          location: 'Cầu Giấy, Hà Nội',
          capacity: '3000',
          current: '1890',
          icon: PackageIcon
        }, {
          name: 'Kho Đống Đa',
          location: 'Đống Đa, Hà Nội',
          capacity: '4000',
          current: '2150',
          icon: PackageIcon
        }].map((warehouse, index) => <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <warehouse.icon className="h-5 w-5 text-orange-500" />
                <h3 className="font-medium">{warehouse.name}</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Địa chỉ: {warehouse.location}</div>
                <div>Sức chứa: {warehouse.capacity} đơn</div>
                <div>Hiện tại: {warehouse.current} đơn</div>
                <div className="mt-3">
                  <div className="h-2 bg-gray-200 rounded">
                    <div className="h-full bg-orange-500 rounded" style={{
                  width: `${parseInt(warehouse.current) / parseInt(warehouse.capacity) * 100}%`
                }} />
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      </div>
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Phương tiện vận chuyển</h2>
        <div className="grid grid-cols-4 gap-4">
          {[{
          type: 'Xe tải',
          plate: '29C-12345',
          driver: 'Nguyễn Văn A',
          status: 'Đang giao'
        }, {
          type: 'Xe tải',
          plate: '29C-67890',
          driver: 'Trần Văn B',
          status: 'Sẵn sàng'
        }, {
          type: 'Xe máy',
          plate: '29M1-2468',
          driver: 'Lê Văn C',
          status: 'Đang giao'
        }, {
          type: 'Xe máy',
          plate: '29M1-1357',
          driver: 'Phạm Văn D',
          status: 'Bảo dưỡng'
        }].map((vehicle, index) => <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TruckIcon className="h-5 w-5 text-orange-500" />
                <span className="font-medium">{vehicle.type}</span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Biển số: {vehicle.plate}</div>
                <div>Tài xế: {vehicle.driver}</div>
                <div>
                  Trạng thái:
                  <span className={`ml-1 ${vehicle.status === 'Đang giao' ? 'text-green-500' : vehicle.status === 'Sẵn sàng' ? 'text-blue-500' : 'text-red-500'}`}>
                    {vehicle.status}
                  </span>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default WarehouseManagement;