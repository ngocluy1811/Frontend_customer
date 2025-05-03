import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package2Icon, TruckIcon, CheckCircleIcon, XCircleIcon, PauseCircleIcon, ClockIcon, CalendarIcon, DownloadIcon, SearchIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import DateRangePickerModal from './modals/DateRangePickerModal';
import { dashboardApi } from '../lib/api';

interface CostData {
  total: string;
  change: string;
  isIncrease: boolean;
}

interface CodStat {
  title: string;
  value: string;
}

interface OrderStat {
  title: string;
  value: string;
}

interface ApiResponse<T> {
  data: T;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [trackingCode, setTrackingCode] = useState('');
  const [dateRange, setDateRange] = useState('month');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    start: null as Date | null,
    end: null as Date | null
  });
  const [costData, setCostData] = useState<Record<string, CostData>>({
    month: { total: '0đ', change: '0%', isIncrease: false },
    year: { total: '0đ', change: '0%', isIncrease: false },
    custom: { total: '0đ', change: '0%', isIncrease: false }
  });
  const [codStats, setCodStats] = useState<CodStat[]>([
    { title: 'Giao thất bại lần đầu', value: '0đ' },
    { title: 'Tạo đơn vận thất bại', value: '0đ' },
    { title: 'Đã thu tiền', value: '0đ' },
    { title: 'Chưa lấy tiền', value: '0đ' }
  ]);
  const [orderStats, setOrderStats] = useState<OrderStat[]>([
    { title: 'Mới tạo và chờ lấy', value: '0' },
    { title: 'Đang giao', value: '0' },
    { title: 'Đơn trả lại', value: '0' },
    { title: 'Đơn thất lạc', value: '0' },
    { title: 'Đơn bị hủy', value: '0' },
    { title: 'Đơn giữ lại', value: '0' }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange, customDateRange]);

  const fetchDashboardData = async () => {
    try {
      // Fetch shipping costs
      const startDate = customDateRange.start?.toISOString();
      const endDate = customDateRange.end?.toISOString();
      const costsResponse = await dashboardApi.getShippingCosts(dateRange as 'month' | 'year' | 'custom', startDate, endDate);
      const costsData = costsResponse.data as CostData;
      setCostData(prev => ({
        ...prev,
        [dateRange]: costsData
      }));

      // Fetch COD stats
      const codResponse = await dashboardApi.getCodStats();
      const codData = codResponse.data as CodStat[];
      setCodStats(codData);

      // Fetch order stats
      const orderResponse = await dashboardApi.getOrderStats();
      const orderData = orderResponse.data as OrderStat[];
      setOrderStats(orderData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleDateRangeApply = (startDate: Date, endDate: Date) => {
    setCustomDateRange({
      start: startDate,
      end: endDate
    });
    setDateRange('custom');
  };

  const getCurrentCostData = () => {
    return dateRange === 'custom' ? costData.custom : costData[dateRange as 'month' | 'year'];
  };

  const handleTrackOrder = () => {
    if (trackingCode) {
      navigate(`/orders/tracking?code=${trackingCode}`);
    }
  };

  const handleExportExcel = async () => {
    try {
      const startDate = customDateRange.start?.toISOString();
      const endDate = customDateRange.end?.toISOString();
      const response = await dashboardApi.exportExcel(dateRange as 'month' | 'year' | 'custom', startDate, endDate);
      
      // Create a download link
      const blob = new Blob([response.data as BlobPart], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dashboard-export-${new Date().toISOString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  return <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button onClick={() => navigate('/orders/new')} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          ĐƠN HÀNG MỚI
        </button>
        <div className="flex-1 relative">
          <input type="text" value={trackingCode} onChange={e => setTrackingCode(e.target.value)} placeholder="Nhập mã vận đơn để theo dõi..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <button onClick={handleTrackOrder} className="absolute right-2 top-2 px-4 py-1 bg-orange-500 text-white rounded hover:bg-orange-600">
            Theo dõi
          </button>
        </div>
        <button onClick={handleExportExcel} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2">
          <DownloadIcon className="h-5 w-5" />
          XUẤT EXCEL
        </button>
      </div>
      {/* Total Cost Analysis */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Tổng chi phí vận chuyển</h2>
          <div className="flex gap-2">
            <button onClick={() => setDateRange('month')} className={`px-4 py-2 rounded-lg text-sm ${dateRange === 'month' ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-50'}`}>
              Tháng này
            </button>
            <button onClick={() => setDateRange('year')} className={`px-4 py-2 rounded-lg text-sm ${dateRange === 'year' ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-50'}`}>
              Năm nay
            </button>
            <button onClick={() => setIsDatePickerOpen(true)} className={`px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 ${dateRange === 'custom' ? 'bg-orange-50 text-orange-600 border-orange-500' : ''}`}>
              <CalendarIcon className="h-4 w-4" />
              {dateRange === 'custom' && customDateRange.start && customDateRange.end ? `${customDateRange.start.toLocaleDateString()} - ${customDateRange.end.toLocaleDateString()}` : 'Tùy chọn'}
            </button>
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold">
            {getCurrentCostData().total}
          </span>
          <div className={`flex items-center gap-1 text-sm ${getCurrentCostData().isIncrease ? 'text-green-600' : 'text-red-600'}`}>
            {getCurrentCostData().isIncrease ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
            {getCurrentCostData().change}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">COD tuần này</h2>
        <div className="grid grid-cols-4 gap-4">
          {codStats.map((item, index) => <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                {index === 0 && <Package2Icon className="h-5 w-5 text-gray-600" />}
                {index === 1 && <TruckIcon className="h-5 w-5 text-gray-600" />}
                {index === 2 && <CheckCircleIcon className="h-5 w-5 text-gray-600" />}
                {index === 3 && <XCircleIcon className="h-5 w-5 text-gray-600" />}
                <span className="text-sm text-gray-600">{item.title}</span>
              </div>
              <p className="text-lg font-semibold">{item.value}</p>
            </div>)}
        </div>
      </div>
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Tổng quan tuần này</h2>
        <div className="grid grid-cols-6 gap-4">
          {orderStats.map((item, index) => <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                {index === 0 && <Package2Icon className="h-5 w-5 text-gray-600" />}
                {index === 1 && <TruckIcon className="h-5 w-5 text-gray-600" />}
                {index === 2 && <CheckCircleIcon className="h-5 w-5 text-gray-600" />}
                {index === 3 && <XCircleIcon className="h-5 w-5 text-gray-600" />}
                {index === 4 && <PauseCircleIcon className="h-5 w-5 text-gray-600" />}
                {index === 5 && <ClockIcon className="h-5 w-5 text-gray-600" />}
                <span className="text-sm text-gray-600">{item.title}</span>
              </div>
              <p className="text-lg font-semibold">{item.value}</p>
            </div>)}
        </div>
      </div>
      <DateRangePickerModal isOpen={isDatePickerOpen} onClose={() => setIsDatePickerOpen(false)} onApply={handleDateRangeApply} />
    </div>;
};

export default Dashboard;