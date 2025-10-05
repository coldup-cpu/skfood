import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MealBuilderProvider } from './contexts/MealBuilderContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import PublishMenu from './pages/admin/PublishMenu';
import Home from './pages/user/Home';
import BuildDishes from './pages/user/BuildDishes';
import BuildBase from './pages/user/BuildBase';
import OrderSummary from './pages/user/OrderSummary';
import DeliveryAddress from './pages/user/DeliveryAddress';
import Payment from './pages/user/Payment';
import OrderConfirmation from './pages/user/OrderConfirmation';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <MealBuilderProvider>
        <Router>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="publish-menu" element={<PublishMenu />} />
            </Route>

            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="build/dishes" element={<BuildDishes />} />
              <Route path="build/base" element={<BuildBase />} />
              <Route path="build/review" element={<OrderSummary />} />
              <Route path="checkout/address" element={<DeliveryAddress />} />
              <Route path="checkout/payment" element={<Payment />} />
              <Route path="order-confirmation" element={<OrderConfirmation />} />
            </Route>
          </Routes>
        </Router>
      </MealBuilderProvider>
    </AuthProvider>
  );
}

export default App;
