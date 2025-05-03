import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package2Icon, TruckIcon, MapPinIcon, PhoneIcon, ClockIcon, DollarSignIcon, PrinterIcon, ShareIcon, MessageCircleIcon, AlertTriangleIcon, StarIcon, CheckCircleIcon } from 'lucide-react';
import ShipperLocationMap from './ShipperLocationMap';
import ShipperChat from '../chat/ShipperChat';
import RatingModal from '../modals/RatingModal';
import { orderApi } from '../../lib/api';

interface TimelineItem {
  icon: any;
  label: string;
  time: string;
  active: boolean;
}

interface Shipper {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
}

interface Order {
  id: string;
  status: string;
  isRated: boolean;
  timeline: TimelineItem[];
  shipper?: Shipper;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  package: {
    weight: number;
    dimensions: string;
    description: string;
  };
  payment: {
    method: string;
    amount: number;
    status: string;
  };
}

interface OrderResponse {
  order: Order;
}

interface ShipperLocationResponse {
  location: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
}

interface OrderHistoryResponse {
  history: Array<{
    status: string;
    time: string;
    location: string;
    description?: string;
    active: boolean;
  }>;
}

const ShipperInfo: React.FC<{ shipper: Shipper }> = ({ shipper }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [shipperLocation, setShipperLocation] = useState({
    lat: 0,
    lng: 0
  });
  const [destination, setDestination] = useState({
    lat: 0,
    lng: 0
  });

  useEffect(() => {
    const fetchShipperLocation = async () => {
      try {
        const response = await orderApi.getShipperLocation(shipper.id);
        const data = response.data as ShipperLocationResponse;
        setShipperLocation(data.location);
        setDestination(data.destination);
      } catch (error) {
        console.error('Error fetching shipper location:', error);
      }
    };

    fetchShipperLocation();
  }, [shipper.id]);

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

const DeliveryHistory: React.FC<{ status: string; orderId: string }> = ({ status, orderId }) => {
  const [history, setHistory] = useState<OrderHistoryResponse['history']>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await orderApi.getOrderHistory(orderId);
        const data = response.data as OrderHistoryResponse;
        setHistory(data.history);
      } catch (error) {
        console.error('Error fetching order history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [orderId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>;
  }

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

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getOrderById(id!);
        const data = response.data as OrderResponse;
        setOrder(data.order);
      } catch (err) {
        setError('Không thể tải thông tin đơn hàng');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleRatingSubmit = async (ratingData: any) => {
    try {
      await orderApi.updateOrder(id!, { rating: ratingData });
      setOrder(prev => prev ? { ...prev, isRated: true } : null);
      setIsRatingModalOpen(false);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const renderShipperSection = () => {
    if (!order) return null;

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
            {isChatOpen && order.shipper && <ShipperChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} shipper={order.shipper} />}
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
        return <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="font-medium flex items-center gap-2 mb-4">
                <TruckIcon className="h-5 w-5 text-orange-500" />
                Thông tin shipper
              </h2>
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
              {!order.isRated && <button onClick={() => setIsRatingModalOpen(true)} className="mt-4 w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2">
                  <StarIcon className="h-4 w-4" />
                  Đánh giá shipper
                </button>}
            </div>
            {isRatingModalOpen && order.shipper && <RatingModal 
              isOpen={isRatingModalOpen} 
              onClose={() => setIsRatingModalOpen(false)} 
              onSubmit={handleRatingSubmit}
              shipperName={order.shipper.name}
              shipperAvatar={order.shipper.avatar}
            />}
          </div>;
      default:
        return null;
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

  if (!order) {
    return <div className="text-center text-gray-600 p-4">Không tìm thấy đơn hàng</div>;
  }

  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id}</h1>
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
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {renderShipperSection()}
          <DeliveryHistory status={order.status} orderId={order.id} />
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-medium flex items-center gap-2 mb-4">
              <Package2Icon className="h-5 w-5 text-orange-500" />
              Thông tin đơn hàng
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Khách hàng</div>
                <div className="font-medium">{order.customer.name}</div>
                <div className="text-sm text-gray-500">{order.customer.phone}</div>
                <div className="text-sm text-gray-500">{order.customer.address}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Gói hàng</div>
                <div className="text-sm">Khối lượng: {order.package.weight}kg</div>
                <div className="text-sm">Kích thước: {order.package.dimensions}</div>
                <div className="text-sm">Mô tả: {order.package.description}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Thanh toán</div>
                <div className="text-sm">Phương thức: {order.payment.method}</div>
                <div className="text-sm">Số tiền: {order.payment.amount.toLocaleString()}đ</div>
                <div className="text-sm">Trạng thái: {order.payment.status}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};

export default OrderDetail;