import React, { useEffect, useState, useRef } from 'react';
import { SendIcon, BotIcon, UserIcon, XIcon, LoaderIcon } from 'lucide-react';
interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}
interface AIChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
}
const AIChatBox = ({
  isOpen,
  onClose
}: AIChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([{
    type: 'ai',
    content: 'Xin chào! Tôi có thể giúp gì cho bạn?',
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const generateGeminiResponse = async (prompt: string) => {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': 'YOUR_API_KEY'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful logistics assistant. Answer in Vietnamese. Question: ${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error:', error);
      return 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.';
    }
  };
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = {
      type: 'user' as const,
      content: input.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    try {
      const aiResponse = await generateGeminiResponse(input);
      setMessages(prev => [...prev, {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  if (!isOpen) return null;
  return <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg z-50">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <BotIcon className="h-6 w-6 text-orange-500" />
          <h3 className="font-medium">Trợ lý AI</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
          <XIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => <div key={index} className={`flex gap-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-orange-100' : 'bg-gray-100'}`}>
              {message.type === 'user' ? <UserIcon className="h-5 w-5 text-orange-500" /> : <BotIcon className="h-5 w-5 text-gray-600" />}
            </div>
            <div className={`max-w-[75%] p-3 rounded-lg ${message.type === 'user' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>
              {message.content}
            </div>
          </div>)}
        {isLoading && <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
              <BotIcon className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex items-center gap-2 max-w-[75%] p-3 rounded-lg bg-gray-100">
              <LoaderIcon className="h-4 w-4 animate-spin text-gray-500" />
              <span className="text-sm text-gray-500">Đang nhập...</span>
            </div>
          </div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Nhập tin nhắn..." className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" onKeyPress={e => e.key === 'Enter' && handleSend()} disabled={isLoading} />
          <button onClick={handleSend} disabled={isLoading} className={`p-2 rounded-lg text-white ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}>
            <SendIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>;
};
export default AIChatBox;