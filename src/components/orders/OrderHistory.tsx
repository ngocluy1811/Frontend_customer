import React, { useState } from 'react';
import { Package2Icon, SearchIcon, CalendarIcon, TruckIcon, CheckCircleIcon, XCircleIcon, ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
const OrderHistory = () => {
  const [sortBy, setSortBy] = useState<'time' | 'status'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [orders, setOrders] = useState([{
    id: 'DH001',
    customer: 'Nguyễn Văn A',
    status: 'Đã giao',
    createDate: '15/12/2023',
    completeDate: '16/12/2023',
    value: '320,000đ',
    timestamp: new Date('2023-12-15')
  }, {
    id: 'DH002',
    customer: 'Trần Thị B',
    status: 'Đã hủy',
    createDate: '14/12/2023',
    completeDate: '15/12/2023',
    value: '450,000đ',
    timestamp: new Date('2023-12-14')
  }, {
    id: 'DH003',
    customer: 'Lê Văn C',
    status: 'Đã giao',
    createDate: '13/12/2023',
    completeDate: '14/12/2023',
    value: '280,000đ',
    timestamp: new Date('2023-12-13')
  }]);
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortBy === 'time') {
      return sortOrder === 'desc' ? b.timestamp.getTime() - a.timestamp.getTime() : a.timestamp.getTime() - b.timestamp.getTime();
    } else {
      return sortOrder === 'desc' ? b.status.localeCompare(a.status) : a.status.localeCompare(b.status);
    }
  });
  const toggleSort = (type: 'time' | 'status') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };
  return <div className="space-y-6">
      {/* Header */}
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
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        {[{
        icon: Package2Icon,
        label: 'Tổng đơn hàng',
        value: '1,234',
        trend: '+12.5%',
        trendUp: true
      }, {
        icon: TruckIcon,
        label: 'Đã giao thành công',
        value: '1,180',
        trend: '+8.2%',
        trendUp: true
      }, {
        icon: XCircleIcon,
        label: 'Đã hủy',
        value: '45',
        trend: '-2.4%',
        trendUp: false
      }, {
        icon: CheckCircleIcon,
        label: 'Tỷ lệ thành công',
        value: '95.6%',
        trend: '+4.8%',
        trendUp: true
      }].map((stat, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <stat.icon className="h-5 w-5" />
              <span>{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">{stat.value}</span>
              <div className={`flex items-center gap-1 text-sm ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trendUp ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                {stat.trend}
              </div>
            </div>
          </div>)}
      </div>
      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex gap-4">
        <div className="flex-1 relative">
          <input type="text" placeholder="Tìm kiếm theo mã đơn, khách hàng..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button onClick={() => toggleSort('status')} className={`px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 ${sortBy === 'status' ? 'bg-orange-50 text-orange-600' : ''}`}>
          Trạng thái
          {sortBy === 'status' && (sortOrder === 'desc' ? <ArrowDownIcon className="h-4 w-4" /> : <ArrowUpIcon className="h-4 w-4" />)}
        </button>
        <button onClick={() => toggleSort('time')} className={`px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 ${sortBy === 'time' ? 'bg-orange-50 text-orange-600' : ''}`}>
          Thời gian
          {sortBy === 'time' && (sortOrder === 'desc' ? <ArrowDownIcon className="h-4 w-4" /> : <ArrowUpIcon className="h-4 w-4" />)}
        </button>
      </div>
      {/* History List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b">
          <h3 className="font-medium">Chi tiết đơn hàng</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Mã đơn
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Ngày hoàn thành
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">
                Giá trị
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sortedOrders.map((order, index) => <tr key={index}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Package2Icon className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">{order.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Đã giao' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{order.createDate}</td>
                <td className="px-6 py-4 text-gray-600">
                  {order.completeDate}
                </td>
                <td className="px-6 py-4 text-right font-medium">
                  {order.value}
                </td>
              </tr>)}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị 1-3 của 24 đơn hàng
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                Trước
              </button>
              <button className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium">
                1
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                2
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                3
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default OrderHistory;