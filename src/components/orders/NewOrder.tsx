import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package2Icon, TruckIcon, MapPinIcon, ScaleIcon, CreditCardIcon, ClockIcon, XIcon } from 'lucide-react';
import { provinces } from '../../data/locationData';
const calculateShippingFee = (serviceType: string, weight: number, dimensions: {
  length: number;
  width: number;
  height: number;
}, senderProvince: string, receiverProvince: string) => {
  const volumetricWeight = dimensions.length * dimensions.width * dimensions.height / 6000;
  const chargeableWeight = Math.max(weight, volumetricWeight);
  const baseRates = {
    fast: 35000,
    standard: 25000,
    save: 20000
  };
  const weightFee = Math.ceil(chargeableWeight / 0.5) * 5000;
  let distanceFee = 0;
  if (senderProvince !== receiverProvince) {
    distanceFee = 20000;
  }
  const totalFee = baseRates[serviceType] + weightFee + distanceFee;
  return totalFee;
};
const NewOrder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sender: {
      name: '',
      phone: '',
      address: ''
    },
    receiver: {
      name: '',
      phone: '',
      address: ''
    },
    package: {
      type: '',
      value: '',
      description: '',
      dimensions: {
        length: '',
        width: '',
        height: ''
      },
      weight: ''
    },
    service: {
      type: '',
      estimatedTime: '',
      paymentMethod: ''
    }
  });
  const [pricing, setPricing] = useState({
    shippingFee: 35000,
    packageFee: 10000,
    discount: 0,
    total: 45000
  });
  const [coupon, setCoupon] = useState({
    code: '',
    applied: false,
    type: '',
    value: 0
  });
  const [senderLocation, setSenderLocation] = useState({
    province: '',
    district: '',
    ward: ''
  });
  const [receiverLocation, setReceiverLocation] = useState({
    province: '',
    district: '',
    ward: ''
  });
  const [dimensions, setDimensions] = useState({
    length: 0,
    width: 0,
    height: 0
  });
  const [weight, setWeight] = useState(0);
  const [serviceType, setServiceType] = useState('standard');
  const selectedSenderProvince = provinces.find(p => p.id === senderLocation.province);
  const selectedSenderDistrict = selectedSenderProvince?.districts.find(d => d.id === senderLocation.district);
  const selectedReceiverProvince = provinces.find(p => p.id === receiverLocation.province);
  const selectedReceiverDistrict = selectedReceiverProvince?.districts.find(d => d.id === receiverLocation.district);
  const availableCoupons = [{
    code: 'FREESHIP',
    desc: 'Miễn phí vận chuyển',
    value: 35000,
    type: 'fixed',
    minOrder: 200000
  }, {
    code: 'SALE50K',
    desc: 'Giảm 50,000đ',
    value: 50000,
    type: 'fixed',
    minOrder: 300000
  }, {
    code: 'NEWYEAR',
    desc: 'Giảm 10% tổng đơn',
    value: 10,
    type: 'percentage',
    minOrder: 500000
  }];
  const calculateDiscount = (couponType: string, couponValue: number) => {
    const subtotal = pricing.shippingFee + pricing.packageFee;
    if (couponType === 'fixed') {
      return couponValue;
    } else if (couponType === 'percentage') {
      return Math.round(subtotal * couponValue / 100);
    }
    return 0;
  };
  const handleApplyCoupon = () => {
    const selectedCoupon = availableCoupons.find(c => c.code === coupon.code);
    if (selectedCoupon) {
      const discountAmount = calculateDiscount(selectedCoupon.type, selectedCoupon.value);
      setPricing(prev => ({
        ...prev,
        discount: discountAmount,
        total: prev.shippingFee + prev.packageFee - discountAmount
      }));
      setCoupon(prev => ({
        ...prev,
        applied: true,
        type: selectedCoupon.type,
        value: selectedCoupon.value
      }));
    }
  };
  const handleRemoveCoupon = () => {
    setPricing(prev => ({
      ...prev,
      discount: 0,
      total: prev.shippingFee + prev.packageFee
    }));
    setCoupon({
      code: '',
      applied: false,
      type: '',
      value: 0
    });
  };
  const handleCreateOrder = () => {
    navigate('/orders', {
      state: {
        newOrder: true,
        orderId: `DH${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
      }
    });
  };
  useEffect(() => {
    const shippingFee = calculateShippingFee(serviceType, weight, dimensions, senderLocation.province, receiverLocation.province);
    setPricing(prev => ({
      ...prev,
      shippingFee,
      total: shippingFee + prev.packageFee - prev.discount
    }));
  }, [weight, dimensions, serviceType, senderLocation.province, receiverLocation.province]);
  return <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tạo đơn hàng mới</h1>
        <p className="text-gray-500">Điền thông tin chi tiết để tạo đơn hàng</p>
      </div>
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-lg">
                <Package2Icon className="h-5 w-5 text-orange-500" />
                Thông tin người gửi
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ tên người gửi
                  </label>
                  <input type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Nhập họ tên người gửi" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input type="tel" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Nhập số điện thoại" />
                </div>
                <div className="space-y-3">
                  <select value={senderLocation.province} onChange={e => setSenderLocation(prev => ({
                  ...prev,
                  province: e.target.value,
                  district: '',
                  ward: ''
                }))} className="w-full p-2 border rounded-lg">
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map(province => <option key={province.id} value={province.id}>
                        {province.name}
                      </option>)}
                  </select>
                  <select value={senderLocation.district} onChange={e => setSenderLocation(prev => ({
                  ...prev,
                  district: e.target.value,
                  ward: ''
                }))} className="w-full p-2 border rounded-lg" disabled={!senderLocation.province}>
                    <option value="">Chọn quận/huyện</option>
                    {selectedSenderProvince?.districts.map(district => <option key={district.id} value={district.id}>
                        {district.name}
                      </option>)}
                  </select>
                  <select value={senderLocation.ward} onChange={e => setSenderLocation(prev => ({
                  ...prev,
                  ward: e.target.value
                }))} className="w-full p-2 border rounded-lg" disabled={!senderLocation.district}>
                    <option value="">Chọn phường/xã</option>
                    {selectedSenderDistrict?.wards.map(ward => <option key={ward.id} value={ward.id}>
                        {ward.name}
                      </option>)}
                  </select>
                  <textarea placeholder="Số nhà, tên đường..." rows={2} className="w-full p-2 border rounded-lg" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-lg">
                <TruckIcon className="h-5 w-5 text-orange-500" />
                Thông tin người nhận
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ tên người nhận
                  </label>
                  <input type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Nhập họ tên người nhận" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input type="tel" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Nhập số điện thoại" />
                </div>
                <div className="space-y-3">
                  <select value={receiverLocation.province} onChange={e => setReceiverLocation(prev => ({
                  ...prev,
                  province: e.target.value,
                  district: '',
                  ward: ''
                }))} className="w-full p-2 border rounded-lg">
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map(province => <option key={province.id} value={province.id}>
                        {province.name}
                      </option>)}
                  </select>
                  <select value={receiverLocation.district} onChange={e => setReceiverLocation(prev => ({
                  ...prev,
                  district: e.target.value,
                  ward: ''
                }))} className="w-full p-2 border rounded-lg" disabled={!receiverLocation.province}>
                    <option value="">Chọn quận/huyện</option>
                    {selectedReceiverProvince?.districts.map(district => <option key={district.id} value={district.id}>
                        {district.name}
                      </option>)}
                  </select>
                  <select value={receiverLocation.ward} onChange={e => setReceiverLocation(prev => ({
                  ...prev,
                  ward: e.target.value
                }))} className="w-full p-2 border rounded-lg" disabled={!receiverLocation.district}>
                    <option value="">Chọn phường/xã</option>
                    {selectedReceiverDistrict?.wards.map(ward => <option key={ward.id} value={ward.id}>
                        {ward.name}
                      </option>)}
                  </select>
                  <textarea placeholder="Số nhà, tên đường..." rows={2} className="w-full p-2 border rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-medium flex items-center gap-2 text-lg mb-4">
            <MapPinIcon className="h-5 w-5 text-orange-500" />
            Thông tin hàng hóa
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại hàng hóa
                </label>
                <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option>Chọn loại hàng hóa</option>
                  <option>Thực phẩm</option>
                  <option>Quần áo</option>
                  <option>Điện tử</option>
                  <option>Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá trị hàng hóa
                </label>
                <input type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Nhập giá trị hàng hóa" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả hàng hóa
                </label>
                <textarea className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" rows={2} placeholder="Mô tả chi tiết hàng hóa" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kích thước (DxRxC cm)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" value={dimensions.length} onChange={e => setDimensions(prev => ({
                  ...prev,
                  length: parseFloat(e.target.value)
                }))} placeholder="Dài" className="p-2 border rounded" />
                  <input type="number" value={dimensions.width} onChange={e => setDimensions(prev => ({
                  ...prev,
                  width: parseFloat(e.target.value)
                }))} placeholder="Rộng" className="p-2 border rounded" />
                  <input type="number" value={dimensions.height} onChange={e => setDimensions(prev => ({
                  ...prev,
                  height: parseFloat(e.target.value)
                }))} placeholder="Cao" className="p-2 border rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trọng lượng (kg)
                </label>
                <input type="number" value={weight} onChange={e => setWeight(parseFloat(e.target.value))} className="p-2 border rounded w-full" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-medium flex items-center gap-2 text-lg mb-4">
            <CreditCardIcon className="h-5 w-5 text-orange-500" />
            Dịch vụ & Thanh toán
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dịch vụ vận chuyển
                </label>
                <select value={serviceType} onChange={e => setServiceType(e.target.value)} className="w-full p-2 border rounded-lg">
                  <option value="fast">Giao hàng hỏa tốc (2-3h)</option>
                  <option value="standard">Giao hàng tiêu chuẩn (24h)</option>
                  <option value="save">Giao hàng tiết kiệm (48h)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian giao hàng dự kiến
                </label>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <input type="datetime-local" className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phương thức thanh toán
                </label>
                <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option>Chọn phương thức</option>
                  <option>COD - Thu hộ</option>
                  <option>Chuyển khoản</option>
                  <option>Ví điện tử</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã giảm giá
                </label>
                <div className="flex gap-2">
                  <select value={coupon.code} onChange={e => setCoupon({
                  code: e.target.value,
                  applied: false,
                  type: '',
                  value: 0
                })} disabled={coupon.applied} className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                    <option value="">Chọn mã giảm giá</option>
                    {availableCoupons.map(c => <option key={c.code} value={c.code}>
                        {c.code} - {c.desc}
                      </option>)}
                  </select>
                  {coupon.applied ? <button onClick={handleRemoveCoupon} className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 flex items-center gap-2">
                      <XIcon className="h-4 w-4" />
                      Hủy
                    </button> : <button onClick={handleApplyCoupon} disabled={!coupon.code} className={`px-4 py-2 rounded-lg text-white ${coupon.code ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'}`}>
                      Áp dụng
                    </button>}
                </div>
                {coupon.applied && <div className="mt-1 text-sm text-green-600">
                    {coupon.type === 'percentage' ? `Giảm ${coupon.value}% tổng đơn` : `Giảm ${coupon.value.toLocaleString()}đ`}
                  </div>}
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Cước phí giao hàng:</span>
                <span>{pricing.shippingFee.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Phí đóng gói:</span>
                <span>{pricing.packageFee.toLocaleString()}đ</span>
              </div>
              {coupon.applied && <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Giảm giá:</span>
                  <span className="text-green-600">
                    -{pricing.discount.toLocaleString()}đ
                  </span>
                </div>}
              <div className="flex justify-between items-center font-medium text-lg pt-2 border-t mt-2">
                <span>Tổng thanh toán:</span>
                <span className="text-orange-500">
                  {pricing.total.toLocaleString()}đ
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button className="px-6 py-2 border rounded-lg hover:bg-gray-50">
            Hủy
          </button>
          <button onClick={handleCreateOrder} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Tạo đơn hàng
          </button>
        </div>
      </div>
    </div>;
};
export default NewOrder;