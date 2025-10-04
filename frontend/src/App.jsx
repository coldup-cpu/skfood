import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Admin pages (existing)
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import PublishMenu from './pages/admin/PublishMenu';

// Customer pages (new)
import Home from './pages/customer/Home';
import MealBuilder from './pages/customer/MealBuilder';
import OrderSummary from './pages/customer/OrderSummary';
import Checkout from './pages/customer/Checkout';
import Payment from './pages/customer/Payment';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import MyOrders from './pages/customer/MyOrders';
import OrderDetails from './pages/customer/OrderDetails';
import Login from './pages/customer/Login';
import Signup from './pages/customer/Signup';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <Router>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="meal-builder" element={<MealBuilder />} />
              <Route path="order-summary" element={<OrderSummary />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="payment" element={<Payment />} />
              <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="my-orders" element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              } />
              <Route path="order/:orderId" element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              } />
            </Route>

            {/* Admin Routes (existing) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="publish-menu" element={<PublishMenu />} />
            </Route>
          </Routes>
        </Router>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;