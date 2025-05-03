import React, { useState } from 'react';
import { MapPinIcon, TruckIcon, CheckCircleIcon, Package2Icon, SearchIcon, WarehouseIcon } from 'lucide-react';
const OrderTracking = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [showResult, setShowResult] = useState(false);
  const handleSearch = () => {
    if (trackingCode) {
      setShowResult(true);
    }
  };
  return <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Theo dõi đơn hàng</h2>
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <input type="text" placeholder="Nhập mã đơn hàng của bạn" value={trackingCode} onChange={e => setTrackingCode(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button onClick={handleSearch} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Tra cứu
          </button>
        </div>
        {showResult && <div className="space-y-6">
            {/* Order Summary */}
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Mã đơn hàng</div>
                  <div className="font-medium">{trackingCode}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Trạng thái</div>
                  <div className="font-medium text-green-600">
                    Đang vận chuyển
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Dự kiến giao</div>
                  <div className="font-medium">15/12/2023</div>
                </div>
              </div>
            </div>
            {/* Current Location */}
            <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
              <div className="flex items-center gap-3 text-orange-600">
                <WarehouseIcon className="h-5 w-5" />
                <span className="font-medium">Vị trí hiện tại</span>
              </div>
              <div className="mt-2 pl-8">
                <div className="font-medium">Kho Mỹ Đình</div>
                <div className="text-sm text-gray-600">Nam Từ Liêm, Hà Nội</div>
              </div>
            </div>
            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200" />
              {[{
            icon: CheckCircleIcon,
            title: 'Đã nhận hàng',
            time: '14/12/2023 18:00',
            location: 'Kho Đống Đa',
            address: 'Đống Đa, Hà Nội',
            status: 'Đã tiếp nhận đơn hàng và đang xử lý',
            isWarehouse: true
          }, {
            icon: TruckIcon,
            title: 'Đang vận chuyển',
            time: '15/12/2023 08:15',
            location: 'Kho Mỹ Đình',
            address: 'Nam Từ Liêm, Hà Nội',
            status: 'Đã đến kho trung chuyển',
            isWarehouse: true
          }, {
            icon: MapPinIcon,
            title: 'Dự kiến giao hàng',
            time: '15/12/2023 14:30',
            location: '219 Trung Kính',
            address: 'Cầu Giấy, Hà Nội',
            status: 'Đang chuẩn bị giao cho người nhận',
            isWarehouse: false
          }].map((step, index) => <div key={index} className="relative flex gap-4 pb-8">
                  <div className={`absolute left-8 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 
                    ${index === 0 ? 'border-green-500' : index === 1 ? 'border-orange-500' : 'border-gray-300'}`} />
                  <div className="ml-16">
                    <div className="flex items-center gap-2">
                      {step.isWarehouse && <WarehouseIcon className="h-4 w-4 text-gray-500" />}
                      <div className="font-medium">{step.title}</div>
                    </div>
                    <div className="text-sm text-gray-600">{step.time}</div>
                    <div className="text-sm">
                      <span className="font-medium">{step.location}</span>
                      {step.address && <span className="text-gray-600"> - {step.address}</span>}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {step.status}
                    </div>
                  </div>
                </div>)}
            </div>
          </div>}
      </div>
    </div>;
};
export default OrderTracking;