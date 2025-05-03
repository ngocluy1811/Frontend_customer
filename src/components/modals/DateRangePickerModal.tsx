import React, { useState } from 'react';
import { CalendarIcon, XIcon } from 'lucide-react';
interface DateRangePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (startDate: Date, endDate: Date) => void;
}
const DateRangePickerModal = ({
  isOpen,
  onClose,
  onApply
}: DateRangePickerModalProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  if (!isOpen) return null;
  const handleApply = () => {
    if (startDate && endDate) {
      onApply(new Date(startDate), new Date(endDate));
      onClose();
    }
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-orange-500" />
            Chọn khoảng thời gian
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <XIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Từ ngày
            </label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đến ngày
            </label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
          </div>
          <div className="flex gap-2 pt-4">
            <button onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
              Hủy
            </button>
            <button onClick={handleApply} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default DateRangePickerModal;