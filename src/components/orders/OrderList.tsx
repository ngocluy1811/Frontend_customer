import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Package2Icon, SearchIcon, FilterIcon, EyeIcon, PrinterIcon, MoreHorizontalIcon, MapPinIcon, XCircleIcon, MessageCircleIcon, AlertTriangleIcon, StarIcon } from 'lucide-react';
import { orderApi } from '../../lib/api';

interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  status: string;
  time: string;
}

interface OrderActionMenuProps {
  order: Order;
  onClose: () => void;
  onAction: (action: string, order: Order) => void;
  position: { x: number; y: number };
}

interface OrdersResponse {
  orders: Order[];
  total: number;
}

const OrderActionMenu: React.FC<OrderActionMenuProps> = ({
  order,
  onClose,
  onAction,
  position
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  return <div ref={menuRef} className="absolute bg-white rounded-md shadow-lg z-10" style={{
    top: `${position.y}px`,
    right: `${position.x}px`
  }}>
      <div className="py-1" role="menu">
        {order.status === 'Chờ xử lý' && <>
            <button onClick={() => onAction('cancel', order)} className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full">
              <XCircleIcon className="mr-3 h-5 w-5" />
              Hủy đơn hàng
            </button>
            <button onClick={() => onAction('changeAddress', order)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
              <MapPinIcon className="mr-3 h-5 w-5" />
              Đổi địa điểm giao
            </button>
          </>}
        {order.status === 'Đang giao' && <>
            <button onClick={() => onAction('chat', order)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
              <MessageCircleIcon className="mr-3 h-5 w-5" />
              Chat với shipper
            </button>
            <button onClick={() => onAction('report', order)} className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full">
              <AlertTriangleIcon className="mr-3 h-5 w-5" />
              Báo cáo shipper
            </button>
          </>}
        {order.status === 'Đã giao' && <button onClick={() => onAction('rate', order)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
            <StarIcon className="mr-3 h-5 w-5" />
            Đánh giá shipper
          </button>}
      </div>
    </div>;
};

const OrderList: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [showFilters, setShowFilters] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({
    x: 0,
    y: 0
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  useEffect(() => {
    if (location.state?.newOrder) {
      console.log(`Đơn hàng ${location.state.orderId} đã được tạo và đang chờ xử lý`);
    }
    fetchOrders();
  }, [location, selectedStatus, pagination.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getOrders({
        page: pagination.page,
        limit: pagination.limit,
        status: selectedStatus === 'Tất cả' ? undefined : selectedStatus
      });
      const data = response.data as OrdersResponse;
      setOrders(data.orders);
      setPagination(prev => ({
        ...prev,
        total: data.total
      }));
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Chờ xử lý':
        return 'bg-yellow-100 text-yellow-600';
      case 'Đang giao':
        return 'bg-blue-100 text-blue-600';
      case 'Đã giao':
        return 'bg-green-100 text-green-600';
      case 'Đã hủy':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    order.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
    order.phone.includes(searchQuery)
  );

  const handleActionClick = async (action: string, order: Order) => {
    try {
      switch (action) {
        case 'cancel':
          if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
            await orderApi.cancelOrder(order.id);
            fetchOrders();
          }
          break;
        case 'changeAddress':
          navigate(`/orders/${order.id}/change-address`);
          break;
        case 'chat':
          navigate(`/chat/${order.id}`);
          break;
        case 'report':
          navigate(`/orders/${order.id}/report`);
          break;
        case 'rate':
          navigate(`/orders/${order.id}/rate`);
          break;
      }
    } catch (err) {
      console.error('Error handling action:', err);
    }
    setActiveMenu(null);
  };

  const handleMoreClick = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: rect.width + 10,
      y: rect.top + window.scrollY
    });
    setActiveMenu(activeMenu === orderId ? null : orderId);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">{error}</div>;
  }

  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
        <button onClick={() => navigate('/orders/new')} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2">
          <Package2Icon className="h-5 w-5" />
          Tạo đơn hàng mới
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input type="text" placeholder="Tìm kiếm đơn hàng..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 ${showFilters ? 'bg-orange-50 text-orange-600' : ''}`}>
            <FilterIcon className="h-5 w-5" />
            Bộ lọc
          </button>
        </div>
        <div className="flex gap-2">
          {['Tất cả', 'Chờ xử lý', 'Đang giao', 'Đã giao', 'Đã hủy'].map(status => <button key={status} onClick={() => setSelectedStatus(status)} className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedStatus === status ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                {status}
              </button>)}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Mã đơn
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Khách hàng
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Địa chỉ giao
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Thời gian
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredOrders.map((order, index) => <tr key={index}>
                <td className="px-6 py-4 relative">
                  <div className="flex justify-end items-center gap-2">
                    <button onClick={() => navigate(`/orders/${order.id}`)} className="p-1 hover:bg-gray-100 rounded">
                      <EyeIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <PrinterIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <div className="relative">
                      <button onClick={e => handleMoreClick(e, order.id)} className="p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontalIcon className="h-5 w-5 text-gray-600" />
                      </button>
                      {activeMenu === order.id && <OrderActionMenu order={order} onClose={() => setActiveMenu(null)} onAction={handleActionClick} position={menuPosition} />}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="font-medium">{order.customer}</div>
                    <div className="text-sm text-gray-500">{order.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{order.address}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${renderStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{order.time}</div>
                </td>
              </tr>)}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị {pagination.page * pagination.limit - pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} của {pagination.total} đơn hàng
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)} 
                disabled={pagination.page === 1}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50"
              >
                Trước
              </button>
              {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => i + 1)
                .slice(Math.max(0, pagination.page - 2), Math.min(Math.ceil(pagination.total / pagination.limit), pagination.page + 1))
                .map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      page === pagination.page ? 'bg-orange-50 text-orange-600' : 'border hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              <button 
                onClick={() => handlePageChange(pagination.page + 1)} 
                disabled={pagination.page * pagination.limit >= pagination.total}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};

export default OrderList;