import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import PublishMenu from './pages/admin/PublishMenu';
import Home from './pages/user/Home';
import MealBuilder from './pages/user/MealBuilder';
import OrderSummary from './pages/user/OrderSummary';
import Checkout from './pages/user/Checkout';
import PaymentConfirmation from './pages/user/PaymentConfirmation';
import MyOrders from './pages/user/MyOrders';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="meal-builder" element={<MealBuilder />} />
          <Route path="order-summary" element={<OrderSummary />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment-confirmation" element={<PaymentConfirmation />} />
          <Route path="orders" element={<MyOrders />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="publish-menu" element={<PublishMenu />} />
        </Route>
        <Route path="/" element={<Navigate to="/user" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
