import React, { useState } from 'react';
import { TicketIcon, SearchIcon } from 'lucide-react';
import CouponUseModal from '../modals/CouponUseModal';
const CouponManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState<null | {
    code: string;
    desc: string;
    value: string;
  }>(null);
  const coupons = [{
    code: 'FREESHIP',
    desc: 'Miễn phí vận chuyển',
    value: '30,000đ',
    minOrder: '200,000đ',
    validTo: '31/12/2023',
    status: 'Có thể sử dụng'
  }, {
    code: 'SALE50K',
    desc: 'Giảm 50K cho đơn hàng',
    value: '50,000đ',
    minOrder: '300,000đ',
    validTo: '20/12/2023',
    status: 'Có thể sử dụng'
  }, {
    code: 'NEWYEAR',
    desc: 'Giảm 10% tổng đơn',
    value: '10%',
    minOrder: '500,000đ',
    validTo: '05/01/2024',
    status: 'Sắp có hiệu lực'
  }];
  const filteredCoupons = coupons.filter(coupon => coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) || coupon.desc.toLowerCase().includes(searchQuery.toLowerCase()));
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mã giảm giá của tôi</h1>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm flex gap-4">
        <div className="flex-1 relative">
          <input type="text" placeholder="Tìm kiếm mã giảm giá..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {filteredCoupons.map((coupon, index) => <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <TicketIcon className="h-5 w-5 text-orange-500" />
              <span className="font-medium">{coupon.code}</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div>{coupon.desc}</div>
              <div>Giảm: {coupon.value}</div>
              <div>Đơn tối thiểu: {coupon.minOrder}</div>
              <div>Hết hạn: {coupon.validTo}</div>
            </div>
            <div className="mt-4">
              <span className={`px-2 py-1 rounded text-xs ${coupon.status === 'Có thể sử dụng' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                {coupon.status}
              </span>
            </div>
            <button onClick={() => setSelectedCoupon({
          code: coupon.code,
          desc: coupon.desc,
          value: coupon.value
        })} className="mt-4 w-full px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-50">
              Sử dụng ngay
            </button>
          </div>)}
      </div>
      {selectedCoupon && <CouponUseModal isOpen={!!selectedCoupon} onClose={() => setSelectedCoupon(null)} coupon={selectedCoupon} />}
    </div>;
};
export default CouponManagement;