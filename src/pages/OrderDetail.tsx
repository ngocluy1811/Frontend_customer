import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Divider, 
  Chip,
  Rating,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  ArrowBack, 
  LocalShipping, 
  AccessTime, 
  CheckCircle, 
  Cancel,
  Star,
  StarBorder,
  RateReview
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import axios from '../api/axios';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Shipper {
  _id: string;
  name: string;
  phone: string;
  avatar?: string;
}

interface DeliveryHistory {
  status: string;
  timestamp: string;
  location?: string;
  note?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    province: string;
  };
  createdAt: string;
  updatedAt: string;
  shipper?: Shipper;
  deliveryHistory?: DeliveryHistory[];
  rating?: number;
  ratingComment?: string;
}

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [ratingComment, setRatingComment] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập để xem chi tiết đơn hàng');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await axios.get<Order>(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
          localStorage.removeItem('token');
          setTimeout(() => navigate('/login'), 2000);
        } else if (err.response?.status === 404) {
          setError('Không tìm thấy đơn hàng');
        } else {
          setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau');
        }
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  const handleRateOrder = async () => {
    if (!order || !rating) return;
    try {
      await axios.post(
        `/orders/${order._id}/rate`,
        { rating, comment: ratingComment }
      );
      // Cập nhật lại thông tin đơn hàng
      const response = await axios.get<Order>(`/orders/${order._id}`);
      setOrder(response.data);
      setRatingDialogOpen(false);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Không thể đánh giá đơn hàng. Vui lòng thử lại sau');
      }
      console.error('Error rating order:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipping':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'shipping':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Không tìm thấy đơn hàng'}
        </Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/orders')}
          sx={{ mt: 2 }}
        >
          Quay lại
        </Button>
        {error?.includes('đăng nhập') && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
            sx={{ mt: 2, ml: 2 }}
          >
            Đăng nhập
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/orders')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4">
          Chi tiết đơn hàng #{order.orderNumber}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Thông tin đơn hàng */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin đơn hàng
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Trạng thái
              </Typography>
              <Chip 
                label={getStatusText(order.status)} 
                color={getStatusColor(order.status) as any}
                sx={{ mt: 1 }}
              />
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Ngày đặt hàng
              </Typography>
              <Typography>
                {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Phương thức thanh toán
              </Typography>
              <Typography>
                {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Trạng thái thanh toán
              </Typography>
              <Typography>
                {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </Typography>
            </Box>
          </Paper>

          {/* Sản phẩm */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sản phẩm
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {order.items.map((item) => (
              <Box key={item.productId} display="flex" mb={2}>
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{ width: 80, height: 80, objectFit: 'cover', mr: 2 }}
                />
                <Box flex={1}>
                  <Typography variant="subtitle1">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.quantity} x {item.price.toLocaleString('vi-VN')}đ
                  </Typography>
                </Box>
                <Typography variant="subtitle1">
                  {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />
            
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Tạm tính</Typography>
              <Typography>{(order.totalAmount - order.shippingFee).toLocaleString('vi-VN')}đ</Typography>
            </Box>
            
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Phí vận chuyển</Typography>
              <Typography>{order.shippingFee.toLocaleString('vi-VN')}đ</Typography>
            </Box>
            
            <Box display="flex" justifyContent="space-between" fontWeight="bold">
              <Typography>Tổng cộng</Typography>
              <Typography>{order.totalAmount.toLocaleString('vi-VN')}đ</Typography>
            </Box>
          </Paper>

          {/* Địa chỉ giao hàng */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Địa chỉ giao hàng
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography>{order.shippingAddress.fullName}</Typography>
            <Typography>{order.shippingAddress.phone}</Typography>
            <Typography>
              {order.shippingAddress.address}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.province}
            </Typography>
          </Paper>
        </Grid>

        {/* Thông tin giao hàng */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin giao hàng
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {order.shipper ? (
              <Box mb={3}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box
                    component="img"
                    src={order.shipper.avatar || '/default-avatar.png'}
                    alt={order.shipper.name}
                    sx={{ width: 50, height: 50, borderRadius: '50%', mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1">{order.shipper.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.shipper.phone}
                    </Typography>
                  </Box>
                </Box>

                {order.status === 'delivered' && !order.rating && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RateReview />}
                    onClick={() => setRatingDialogOpen(true)}
                    fullWidth
                  >
                    Đánh giá đơn hàng
                  </Button>
                )}

                {order.rating && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Đánh giá của bạn
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Rating value={order.rating} readOnly />
                      {order.ratingComment && (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          "{order.ratingComment}"
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              <Box mb={3}>
                <Typography variant="body2" color="text.secondary">
                  Chưa có shipper nhận đơn
                </Typography>
              </Box>
            )}

            {order.deliveryHistory && order.deliveryHistory.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Lịch sử giao hàng
                </Typography>
                {order.deliveryHistory.map((history, index) => (
                  <Box key={index} display="flex" mb={2}>
                    <Box sx={{ mr: 2 }}>
                      {history.status === 'delivered' ? (
                        <CheckCircle color="success" />
                      ) : history.status === 'cancelled' ? (
                        <Cancel color="error" />
                      ) : (
                        <AccessTime color="primary" />
                      )}
                    </Box>
                    <Box flex={1}>
                      <Typography variant="body2">
                        {getStatusText(history.status)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(history.timestamp), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </Typography>
                      {history.location && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          Vị trí: {history.location}
                        </Typography>
                      )}
                      {history.note && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          Ghi chú: {history.note}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog đánh giá */}
      <Dialog open={ratingDialogOpen} onClose={() => setRatingDialogOpen(false)}>
        <DialogTitle>Đánh giá đơn hàng</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Chất lượng dịch vụ</Typography>
            <Rating
              value={rating}
              onChange={(event: React.SyntheticEvent, newValue: number | null) => setRating(newValue)}
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Nhận xét"
            value={ratingComment}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRatingComment(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRatingDialogOpen(false)}>Hủy</Button>
          <Button 
            onClick={handleRateOrder} 
            variant="contained"
            disabled={!rating}
          >
            Gửi đánh giá
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderDetail; 