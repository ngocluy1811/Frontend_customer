import React from 'react';
import { TicketIcon, XIcon, ArrowRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface CouponUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: {
    code: string;
    desc: string;
    value: string;
  };
}
const CouponUseModal = ({
  isOpen,
  onClose,
  coupon
}: CouponUseModalProps) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  const handleCreateOrder = () => {
    navigate('/orders/new', {
      state: {
        couponCode: coupon.code
      }
    });
    onClose();
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <TicketIcon className="h-5 w-5 text-orange-500" />
            Sử dụng mã giảm giá
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <XIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-orange-500">
            {coupon.code}
          </div>
          <div className="text-gray-600">{coupon.desc}</div>
          <div className="font-medium">Giảm: {coupon.value}</div>
          <button onClick={handleCreateOrder} className="w-full mt-6 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2">
            Tạo đơn ngay
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>;
};
export default CouponUseModal;