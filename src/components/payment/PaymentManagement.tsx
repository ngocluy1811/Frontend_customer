import React from 'react';
import { CreditCardIcon, ReceiptIcon } from 'lucide-react';
const PaymentManagement = () => {
  return <div className="space-y-6">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Quản lý thanh toán</h2>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Mã đơn
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Phương thức
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Số tiền
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Thời gian
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[{
            id: 'DH001',
            method: 'COD',
            amount: '320,000đ',
            status: 'Đã thanh toán',
            time: '15/12/2023 12:30'
          }, {
            id: 'DH002',
            method: 'Chuyển khoản',
            amount: '450,000đ',
            status: 'Chờ thanh toán',
            time: '15/12/2023 10:15'
          }].map((payment, index) => <tr key={index}>
                <td className="px-4 py-3 text-sm">{payment.id}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CreditCardIcon className="h-4 w-4 text-gray-500" />
                    {payment.method}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-medium">
                  {payment.amount}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${payment.status === 'Đã thanh toán' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {payment.time}
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Mã giảm giá</h2>
        <div className="grid grid-cols-3 gap-4">
          {[{
          code: 'FREESHIP',
          discount: 'Miễn phí vận chuyển',
          minOrder: '200,000đ',
          validTo: '31/12/2023'
        }, {
          code: 'SALE50K',
          discount: 'Giảm 50,000đ',
          minOrder: '300,000đ',
          validTo: '20/12/2023'
        }, {
          code: 'NEWYEAR',
          discount: 'Giảm 10%',
          minOrder: '500,000đ',
          validTo: '05/01/2024'
        }].map((coupon, index) => <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <ReceiptIcon className="h-5 w-5 text-orange-500" />
                <span className="font-medium">{coupon.code}</span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Ưu đãi: {coupon.discount}</div>
                <div>Đơn tối thiểu: {coupon.minOrder}</div>
                <div>Hiệu lực đến: {coupon.validTo}</div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default PaymentManagement;