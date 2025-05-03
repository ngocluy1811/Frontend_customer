import React, { useState } from 'react';
import { SendIcon, XIcon, ImageIcon, SmileIcon } from 'lucide-react';
interface Message {
  id: number;
  sender: 'user' | 'shipper';
  content: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}
interface ShipperChatProps {
  isOpen: boolean;
  onClose: () => void;
  shipper: {
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'busy';
  };
}
const ShipperChat = ({
  isOpen,
  onClose,
  shipper
}: ShipperChatProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    sender: 'shipper',
    content: 'Chào anh/chị, tôi đang trên đường giao hàng',
    time: '10:30',
    status: 'read'
  }, {
    id: 2,
    sender: 'user',
    content: 'Vâng, anh cho em xin thời gian dự kiến đến nơi',
    time: '10:31',
    status: 'read'
  }, {
    id: 3,
    sender: 'shipper',
    content: 'Dự kiến khoảng 15 phút nữa tôi sẽ đến',
    time: '10:32',
    status: 'read'
  }]);
  if (!isOpen) return null;
  const handleSend = () => {
    if (!message.trim()) return;
    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      content: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'sent'
    };
    setMessages([...messages, newMessage]);
    setMessage('');
    setTimeout(() => {
      const shipperResponse: Message = {
        id: messages.length + 2,
        sender: 'shipper',
        content: 'Vâng, tôi sẽ cố gắng giao hàng sớm nhất có thể',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: 'sent'
      };
      setMessages(prev => [...prev, shipperResponse]);
    }, 2000);
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={shipper.avatar} alt={shipper.name} className="w-10 h-10 rounded-full" />
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${shipper.status === 'online' ? 'bg-green-500' : shipper.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'}`} />
            </div>
            <div>
              <h3 className="font-medium">{shipper.name}</h3>
              <span className="text-sm text-green-500">
                {shipper.status === 'online' ? 'Đang hoạt động' : shipper.status === 'busy' ? 'Đang bận' : 'Không hoạt động'}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <XIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'shipper' && <img src={shipper.avatar} alt="" className="w-8 h-8 rounded-full mr-2" />}
              <div className={`max-w-[70%] rounded-lg p-3 ${msg.sender === 'user' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>
                <p>{msg.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-xs opacity-70">{msg.time}</span>
                  {msg.sender === 'user' && <span className="text-xs opacity-70">
                      {msg.status === 'read' ? '✓✓' : '✓'}
                    </span>}
                </div>
              </div>
            </div>)}
        </div>
        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ImageIcon className="h-5 w-5 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <SmileIcon className="h-5 w-5 text-gray-500" />
            </button>
            <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Nhập tin nhắn..." className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" onKeyPress={e => e.key === 'Enter' && handleSend()} />
            <button onClick={handleSend} className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              <SendIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default ShipperChat;