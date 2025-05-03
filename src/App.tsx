import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import NewOrder from './components/orders/NewOrder';
import OrderList from './components/orders/OrderList';
import OrderHistory from './components/orders/OrderHistory';
import OrderTracking from './components/orders/OrderTracking';
import OrderDetail from './components/orders/OrderDetail';
import AddressManagement from './components/address/AddressManagement';
import Support from './components/support/Support';
import CouponManagement from './components/coupon/CouponManagement';
import NotificationCenter from './components/notification/NotificationCenter';
import Profile from './components/account/Profile';
import ChangePassword from './components/account/ChangePassword';
export function App() {
  return <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders/new" element={<NewOrder />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/history" element={<OrderHistory />} />
          <Route path="/orders/tracking" element={<OrderTracking />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/address" element={<AddressManagement />} />
          <Route path="/support" element={<Support />} />
          <Route path="/coupons" element={<CouponManagement />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/account/profile" element={<Profile />} />
          <Route path="/account/change-password" element={<ChangePassword />} />
        </Routes>
      </Layout>
    </BrowserRouter>;
}