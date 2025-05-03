import React, { useState } from 'react';
import { StarIcon, XIcon, ThumbsUpIcon, SmileIcon, PackageIcon } from 'lucide-react';
interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: any) => void;
  shipperName: string;
  shipperAvatar: string;
}
const RatingModal = ({
  isOpen,
  onClose,
  onSubmit,
  shipperName,
  shipperAvatar
}: RatingModalProps) => {
  const [ratings, setRatings] = useState({
    overall: 0,
    attitude: 0,
    speed: 0,
    care: 0
  });
  const [tempRating, setTempRating] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const availableTags = ['Thái độ tận thiện', 'Giao hàng đúng giờ', 'Cẩn thận với hàng hóa', 'Tận tình hướng dẫn', 'Chuyên nghiệp'];
  if (!isOpen) return null;
  const handleRatingChange = (category: string, value: number) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };
  const handleTagToggle = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };
  const handleSubmit = () => {
    if (ratings.overall === 0) return;
    onSubmit({
      ratings,
      comment,
      tags
    });
    onClose();
  };
  const renderStars = (category: string, value: number) => <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => <button key={star} onMouseEnter={() => setTempRating(`${category}-${star}`)} onMouseLeave={() => setTempRating(null)} onClick={() => handleRatingChange(category, star)} className="p-1">
          <StarIcon className={`h-6 w-6 ${star <= (tempRating === `${category}-${star}` ? star : value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        </button>)}
    </div>;
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          {/* Shipper Info */}
          <h2 className="text-lg font-medium">
            Đánh giá trải nghiệm giao hàng
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <XIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        {/* Shipper Info */}
        <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
          <img src={shipperAvatar} alt={shipperName} className="w-16 h-16 rounded-full" />
          <div>
            <h3 className="font-medium">{shipperName}</h3>
            <p className="text-sm text-gray-600">Tài xế giao hàng</p>
          </div>
        </div>
        {/* Rating Categories */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Đánh giá chung</span>
            {renderStars('overall', ratings.overall)}
          </div>
          <div className="flex justify-between items-center">
            <span>Thái độ phục vụ</span>
            {renderStars('attitude', ratings.attitude)}
          </div>
          <div className="flex justify-between items-center">
            <span>Tốc độ giao hàng</span>
            {renderStars('speed', ratings.speed)}
          </div>
          <div className="flex justify-between items-center">
            <span>Bảo quản hàng hóa</span>
            {renderStars('care', ratings.care)}
          </div>
        </div>
        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đánh giá chi tiết
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => <button key={tag} onClick={() => handleTagToggle(tag)} className={`px-3 py-1 rounded-full text-sm ${tags.includes(tag) ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                {tag}
              </button>)}
          </div>
        </div>
        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nhận xét thêm
          </label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Chia sẻ thêm về trải nghiệm của bạn..." />
        </div>
        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Hủy
          </button>
          <button onClick={handleSubmit} disabled={ratings.overall === 0} className={`px-4 py-2 rounded-lg text-white ${ratings.overall > 0 ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'}`}>
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>;
};
export default RatingModal;