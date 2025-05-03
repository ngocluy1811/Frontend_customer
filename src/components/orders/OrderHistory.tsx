import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package2Icon, SearchIcon, CalendarIcon, TruckIcon, CheckCircleIcon, XCircleIcon, ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { orderApi } from '../../lib/api';

interface Order {
  id: string;
  customer: string;
  status: string;
  createDate: string;
  completeDate?: string;
  value: string;
}

interface OrdersResponse {
  orders: Order[];
  total: number;
}

const OrderHistory = () => {
  const [sortBy, setSortBy] = useState<'createDate' | 'status'>('createDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [sortBy, sortOrder, search, statusFilter, page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getOrders({
        page,
        limit,
        status: statusFilter === 'Tất cả' ? undefined : statusFilter
      });
      const data = response.data as OrdersResponse;
      let filtered = data.orders;
      if (search) {
        filtered = filtered.filter(order =>
          order.id.toLowerCase().includes(search.toLowerCase()) ||
          order.customer.toLowerCase().includes(search.toLowerCase())
        );
      }
      filtered = filtered.sort((a, b) => {
        if (sortBy === 'createDate') {
          return sortOrder === 'desc'
            ? new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
            : new Date(a.createDate).getTime() - new Date(b.createDate).getTime();
        } else {
          return sortOrder === 'desc'
            ? b.status.localeCompare(a.status)
            : a.status.localeCompare(b.status);
        }
      });
      setOrders(filtered);
      setTotal(data.total);
    } catch (err) {
      setError('Không thể tải lịch sử đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const toggleSort = (type: 'createDate' | 'status') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lịch sử đơn hàng</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Tháng này
            <ArrowDownIcon className="h-4 w-4" />
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Xuất báo cáo
          </button>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm flex gap-4">
        <div className="flex-1 relative">
          <input type="text" placeholder="Tìm kiếm theo mã đơn, khách hàng..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-4 py-2 border rounded-lg">
          {['Tất cả', 'Chờ xử lý', 'Đang giao', 'Đã giao', 'Đã hủy'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => toggleSort('status')} className={`px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 ${sortBy === 'status' ? 'bg-orange-50 text-orange-600' : ''}`}>Trạng thái{sortBy === 'status' && (sortOrder === 'desc' ? <ArrowDownIcon className="h-4 w-4" /> : <ArrowUpIcon className="h-4 w-4" />)}</button>
        <button onClick={() => toggleSort('createDate')} className={`px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 ${sortBy === 'createDate' ? 'bg-orange-50 text-orange-600' : ''}`}>Thời gian{sortBy === 'createDate' && (sortOrder === 'desc' ? <ArrowDownIcon className="h-4 w-4" /> : <ArrowUpIcon className="h-4 w-4" />)}</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b">
          <h3 className="font-medium">Chi tiết đơn hàng</h3>
        </div>
        {loading ? <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
        </div> : error ? <div className="text-center text-red-600 p-4">{error}</div> : <>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Mã đơn</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Khách hàng</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Trạng thái</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Ngày tạo</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Ngày hoàn thành</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">Giá trị</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order, index) => <tr key={index} className="hover:bg-orange-50 cursor-pointer" onClick={() => navigate(`/orders/${order.id}`)}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Package2Icon className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">{order.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Đã giao' ? 'bg-green-100 text-green-600' : order.status === 'Đã hủy' ? 'bg-red-100 text-red-600' : order.status === 'Đang giao' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>{order.status}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{order.createDate}</td>
                <td className="px-6 py-4 text-gray-600">{order.completeDate || '-'}</td>
                <td className="px-6 py-4 text-right font-medium">{order.value}</td>
              </tr>)}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị {(page - 1) * limit + 1}-{Math.min(page * limit, total)} của {total} đơn hàng
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Trước</button>
              {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1)
                .slice(Math.max(0, page - 2), Math.min(Math.ceil(total / limit), page + 1))
                .map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`px-4 py-2 rounded-lg text-sm font-medium ${p === page ? 'bg-orange-50 text-orange-600' : 'border hover:bg-gray-50'}`}>{p}</button>
                ))}
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm" disabled={page * limit >= total} onClick={() => setPage(page + 1)}>Sau</button>
            </div>
          </div>
        </div>
        </>}
      </div>
    </div>;
};
export default OrderHistory;