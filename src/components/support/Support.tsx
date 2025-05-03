import React, { useState } from 'react';
import { MessageCircleIcon, PhoneIcon, MailIcon, BookOpenIcon, HelpCircleIcon } from 'lucide-react';
import AIChatBox from '../chat/AIChatBox';
const Support = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Hỗ trợ</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-medium flex items-center gap-2 mb-4">
            <MessageCircleIcon className="h-5 w-5 text-orange-500" />
            Liên hệ hỗ trợ
          </h2>
          <div className="space-y-4">
            <button onClick={() => setIsChatOpen(true)} className="w-full p-4 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 flex items-center justify-center gap-2">
              <MessageCircleIcon className="h-5 w-5" />
              Chat với trợ lý AI
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <PhoneIcon className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <div className="font-medium">Hotline</div>
                <div className="text-orange-500">1900 xxxx</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <MailIcon className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <div className="font-medium">Email</div>
                <div className="text-orange-500">support@ship.com.vn</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-medium flex items-center gap-2 mb-4">
            <BookOpenIcon className="h-5 w-5 text-orange-500" />
            Hướng dẫn sử dụng
          </h2>
          <div className="space-y-3">
            {['Hướng dẫn tạo đơn hàng', 'Cách tính phí vận chuyển', 'Chính sách đổi trả', 'Quy định về hàng hóa cấm gửi'].map((item, index) => <button key={index} className="w-full text-left px-4 py-2 rounded hover:bg-gray-50 flex items-center gap-2">
                <HelpCircleIcon className="h-4 w-4 text-gray-400" />
                <span>{item}</span>
              </button>)}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="font-medium mb-4">Câu hỏi thường gặp</h2>
        <div className="space-y-4">
          {[{
          q: 'Làm thế nào để theo dõi đơn hàng?',
          a: 'Bạn có thể theo dõi đơn hàng bằng cách nhập mã đơn hàng vào mục Theo dõi đơn hàng trên trang chủ hoặc trong mục Đơn hàng.'
        }, {
          q: 'Thời gian giao hàng mất bao lâu?',
          a: 'Thời gian giao hàng phụ thuộc vào khoảng cách và dịch vụ vận chuyển bạn chọn. Thông thường từ 1-3 ngày đối với nội thành và 3-5 ngày đối với các tỉnh.'
        }, {
          q: 'Làm sao để hủy đơn hàng?',
          a: 'Bạn có thể hủy đơn hàng trong vòng 2 giờ sau khi tạo đơn nếu đơn hàng chưa được xử lý. Vui lòng liên hệ hotline nếu cần hỗ trợ.'
        }].map((item, index) => <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 font-medium mb-2">
                <HelpCircleIcon className="h-5 w-5 text-orange-500" />
                {item.q}
              </div>
              <div className="text-gray-600 pl-7">{item.a}</div>
            </div>)}
        </div>
      </div>
      <AIChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>;
};
export default Support;