import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Package2Icon, TruckIcon, MapPinIcon, PhoneIcon, ClockIcon, DollarSignIcon, PrinterIcon, ShareIcon, MessageCircleIcon, AlertTriangleIcon, StarIcon, CheckCircleIcon } from 'lucide-react';
import ShipperLocationMap from './ShipperLocationMap';
import ShipperChat from '../chat/ShipperChat';
import RatingModal from '../modals/RatingModal';
const ShipperInfo = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const shipperLocation = {
    lat: 21.028511,
    lng: 105.804817
  };
  const destination = {
    lat: 21.035771,
    lng: 105.813809
  };
  const shipper = {
    name: 'Nguyễn Văn C',
    phone: '0912345678',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  };
  return <div className="bg-white rounded-lg shadow-sm space-y-4">
      <div className="p-6">
        <h2 className="font-medium flex items-center gap-2">
          <TruckIcon className="h-5 w-5 text-orange-500" />
          Thông tin shipper
        </h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <img src={shipper.avatar} alt={shipper.name} className="w-12 h-12 rounded-full" />
            <div>
              <div className="font-medium">{shipper.name}</div>
              <div className="flex items-center gap-2 text-gray-600">
                <PhoneIcon className="h-4 w-4" />
                <span>{shipper.phone}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsChatOpen(true)} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2">
              <MessageCircleIcon className="h-4 w-4" />
              Chat với shipper
            </button>
            <button className="px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 flex items-center gap-2">
              <AlertTriangleIcon className="h-4 w-4" />
              Báo cáo
            </button>
          </div>
        </div>
      </div>
      <div className="p-6 border-t">
        <h3 className="font-medium mb-4">Vị trí shipper</h3>
        <ShipperLocationMap shipperLocation={shipperLocation} destination={destination} />
      </div>
      {isChatOpen && <ShipperChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} shipper={shipper} />}
    </div>;
};
const DeliveryHistory = ({
  status
}: {
  status: string;
}) => {
  const history = [{
    status: 'Đã nhận đơn',
    time: '15/12/2023 14:30',
    location: 'Kho Mỹ Đình, Nam Từ Liêm, Hà Nội',
    description: 'Đơn hàng đã được xác nhận',
    active: true
  }, {
    status: 'Đang xử lý',
    time: '15/12/2023 14:30',
    location: 'Kho Mỹ Đình, Nam Từ Liêm, Hà Nội',
    description: 'Đơn hàng đang được xử lý',
    active: status === 'Chờ xử lý'
  }];
  return <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="font-medium flex items-center gap-2 mb-6">
        <ClockIcon className="h-5 w-5 text-orange-500" />
        Lịch sử vận chuyển
      </h2>
      <div className="relative">
        <div className="absolute left-2 top-0 h-full w-0.5 bg-gray-200" />
        {history.map((item, index) => <div key={index} className="relative flex gap-4 pb-8">
            <div className={`absolute left-2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 
                ${item.active ? 'border-orange-500' : 'border-gray-300'}`} />
            <div className="ml-8">
              <div className={`font-medium ${item.active ? 'text-gray-900' : 'text-gray-400'}`}>
                {item.status}
              </div>
              <div className={`text-sm ${item.active ? 'text-gray-500' : 'text-gray-400'}`}>
                {item.time}
              </div>
              <div className={`text-sm ${item.active ? 'text-gray-500' : 'text-gray-400'}`}>
                {item.location}
              </div>
              {item.description && <div className={`text-sm mt-1 ${item.active ? 'text-gray-600' : 'text-gray-400'}`}>
                  {item.description}
                </div>}
            </div>
          </div>)}
      </div>
    </div>;
};
const OrderDetail = () => {
  const {
    id
  } = useParams();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [order, setOrder] = useState(() => {
    const baseTimeline = [{
      icon: Package2Icon,
      label: 'Đã tiếp nhận',
      time: '15/12/2023 14:30',
      active: true
    }, {
      icon: TruckIcon,
      label: 'Đang xử lý',
      time: '15/12/2023 14:45',
      active: false
    }, {
      icon: MapPinIcon,
      label: 'Đang giao',
      time: '15/12/2023 15:00',
      active: false
    }, {
      icon: CheckCircleIcon,
      label: 'Đã giao',
      time: '15/12/2023 16:00',
      active: false
    }];
    switch (id) {
      case 'DH001':
        return {
          id,
          status: 'Đang giao',
          isRated: false,
          timeline: baseTimeline.map((item, index) => ({
            ...item,
            active: index <= 2
          })),
          shipper: {
            name: 'Nguyễn Văn C',
            phone: '0912345678',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            status: 'online'
          }
        };
      case 'DH002':
        return {
          id,
          status: 'Chờ xử lý',
          isRated: false,
          timeline: baseTimeline.map((item, index) => ({
            ...item,
            active: index === 0
          }))
        };
      case 'DH003':
        return {
          id,
          status: 'Đã giao',
          isRated: false,
          timeline: baseTimeline.map(item => ({
            ...item,
            active: true
          })),
          shipper: {
            name: 'Nguyễn Văn C',
            phone: '0912345678',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            status: 'online'
          }
        };
      default:
        return {
          id,
          status: 'Chờ xử lý',
          isRated: false,
          timeline: baseTimeline.map((item, index) => ({
            ...item,
            active: index === 0
          }))
        };
    }
  });
  const handleRatingSubmit = (ratingData: any) => {
    setOrder(prev => ({
      ...prev,
      isRated: true
    }));
    setIsRatingModalOpen(false);
  };
  const renderShipperSection = () => {
    switch (order.status) {
      case 'Đang giao':
        return <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm space-y-4">
              <div className="p-6">
                <h2 className="font-medium flex items-center gap-2">
                  <TruckIcon className="h-5 w-5 text-orange-500" />
                  Thông tin shipper
                </h2>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <img src={order.shipper?.avatar} alt={order.shipper?.name} className="w-12 h-12 rounded-full" />
                    <div>
                      <div className="font-medium">{order.shipper?.name}</div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{order.shipper?.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setIsChatOpen(true)} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2">
                      <MessageCircleIcon className="h-4 w-4" />
                      Chat với shipper
                    </button>
                    <button className="px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 flex items-center gap-2">
                      <AlertTriangleIcon className="h-4 w-4" />
                      Báo cáo
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t">
                <h3 className="font-medium mb-4">Vị trí shipper</h3>
                <ShipperLocationMap shipperLocation={{
                lat: 21.028511,
                lng: 105.804817
              }} destination={{
                lat: 21.035771,
                lng: 105.813809
              }} />
              </div>
            </div>
            {isChatOpen && <ShipperChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} shipper={order.shipper} />}
          </div>;
      case 'Chờ xử lý':
        return <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-medium flex items-center gap-2 mb-4">
              <TruckIcon className="h-5 w-5 text-orange-500" />
              Thông tin đơn hàng
            </h2>
            <div className="text-center text-gray-500 py-4">
              Đơn hàng đang chờ xác nhận và chưa được phân công cho shipper
            </div>
          </div>;
      case 'Đã giao':
        return <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="font-medium flex items-center gap-2 mb-4">
                <TruckIcon className="h-5 w-5 text-orange-500" />
                Thông tin shipper
              </h2>
              <div className="flex items-center gap-3">
                <img src={order.shipper?.avatar} alt={order.shipper?.name} className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-medium">{order.shipper?.name}</div>
                  <div className="text-sm text-gray-600">
                    {order.shipper?.phone}
                  </div>
                </div>
              </div>
              {!order.isRated && <button onClick={() => setIsRatingModalOpen(true)} className="mt-4 w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2">
                  <StarIcon className="h-5 w-5" />
                  Đánh giá shipper
                </button>}
              {order.isRated && <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-lg text-center">
                  Bạn đã đánh giá shipper này
                </div>}
            </div>
          </div>;
      default:
        return null;
    }
  };
  return <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package2Icon className="h-6 w-6 text-orange-500" />
            Chi tiết đơn hàng #{id}
          </h1>
          <p className="text-gray-500">Cập nhật lần cuối: 15/12/2023 14:30</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <PrinterIcon className="h-5 w-5" />
            In đơn hàng
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <ShareIcon className="h-5 w-5" />
            Chia sẻ
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center">
          {order.timeline.map((step, index) => <div key={index} className={`flex-1 relative ${index !== 0 ? 'pl-6' : ''} text-center`}>
              <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${step.active ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                <step.icon className="h-5 w-5" />
              </div>
              <div className="mt-2">
                <div className={`font-medium ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </div>
                <div className="text-sm text-gray-500">{step.time}</div>
              </div>
              {index < order.timeline.length - 1 && <div className={`absolute top-5 left-[60%] w-[calc(100%-60%)] h-0.5 ${step.active ? 'bg-orange-500' : 'bg-gray-200'}`} />}
            </div>)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
          <h2 className="font-medium flex items-center gap-2">
            <Package2Icon className="h-5 w-5 text-orange-500" />
            Thông tin người gửi
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-medium">Nguyễn Văn A</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <PhoneIcon className="h-4 w-4" />
              <span>0912345678</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPinIcon className="h-4 w-4" />
              <span>219 Trung Kính, Cầu Giấy, Hà Nội</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
          <h2 className="font-medium flex items-center gap-2">
            <TruckIcon className="h-5 w-5 text-orange-500" />
            Thông tin người nhận
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-medium">Trần Thị B</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <PhoneIcon className="h-4 w-4" />
              <span>0987654321</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPinIcon className="h-4 w-4" />
              <span>48 Tố Hữu, Nam Từ Liêm, Hà Nội</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
        <h2 className="font-medium flex items-center gap-2">
          <Package2Icon className="h-5 w-5 text-orange-500" />
          Thông tin hàng hóa
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Loại hàng hóa</div>
            <div>Thực phẩm</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Trọng lượng</div>
            <div>2.5 kg</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Kích thước</div>
            <div>30 x 20 x 15 cm</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Giá trị hàng hóa</div>
            <div>500,000đ</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Dịch vụ vận chuyển</div>
            <div>Giao hàng nhanh</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Thời gian dự kiến</div>
            <div>16/12/2023 17:00</div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
        <h2 className="font-medium flex items-center gap-2">
          <DollarSignIcon className="h-5 w-5 text-orange-500" />
          Thông tin thanh toán
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span>35,000đ</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Phí đóng gói</span>
            <span>10,000đ</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Giảm giá</span>
            <span className="text-green-600">-5,000đ</span>
          </div>
          <div className="flex justify-between py-2 border-t font-medium">
            <span>Tổng thanh toán</span>
            <span className="text-orange-500">40,000đ</span>
          </div>
        </div>
      </div>
      {renderShipperSection()}
      <DeliveryHistory status={order.status} />
      {order.status === 'Đã giao' && !order.isRated && <RatingModal isOpen={isRatingModalOpen} onClose={() => setIsRatingModalOpen(false)} onSubmit={handleRatingSubmit} shipperName={order.shipper?.name || ''} shipperAvatar={order.shipper?.avatar || ''} />}
    </div>;
};
export default OrderDetail;