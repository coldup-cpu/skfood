import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './PaymentConfirmation.css';

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;
  
  const [otp] = useState(Math.floor(1000 + Math.random() * 9000).toString());
  const [orderId] = useState('SKF' + Date.now().toString().slice(-8));

  // Redirect if no order data
  if (!orderData) {
    navigate('/user');
    return null;
  }

  useEffect(() => {
    // Simulate order placement API call
    const placeOrder = async () => {
      try {
        // This would be an actual API call to place the order
        console.log('Order placed:', {
          ...orderData,
          orderId,
          otp,
          status: 'Confirmed'
        });
      } catch (error) {
        console.error('Error placing order:', error);
      }
    };

    placeOrder();
  }, [orderData, orderId, otp]);

  const getEstimatedDeliveryTime = () => {
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
    return deliveryTime.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatOrderTime = () => {
    return new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="success-animation">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <h1 className="success-title">Order Confirmed!</h1>
        <p className="success-subtitle">
          Your delicious meal is being prepared with love. You'll receive it fresh and hot at your doorstep.
        </p>

        <div className="order-details-card">
          <div className="order-header">
            <div className="order-id">
              <span className="order-label">Order ID</span>
              <span className="order-number">#{orderId}</span>
            </div>
            <div className="order-status">Confirmed</div>
          </div>

          <div className="order-info">
            <div className="info-item">
              <span className="info-label">Meal Type</span>
              <span className="info-value">{orderData.mealType}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Quantity</span>
              <span className="info-value">{orderData.quantity} Thali{orderData.quantity > 1 ? 's' : ''}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Order Time</span>
              <span className="info-value">{formatOrderTime()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Estimated Delivery</span>
              <span className="info-value">{getEstimatedDeliveryTime()}</span>
            </div>
          </div>

          <div className="delivery-address">
            <div className="address-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Delivery Address
            </div>
            <div className="address-text">
              <strong>{orderData.deliveryAddress.label}</strong><br />
              {orderData.deliveryAddress.address}
            </div>
          </div>
        </div>

        <div className="otp-section">
          <h2 className="otp-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <circle cx="12" cy="16" r="1"></circle>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Delivery OTP
          </h2>
          <p className="otp-description">
            Share this OTP with the delivery partner to receive your order
          </p>
          
          <div className="otp-display">
            {otp.split('').map((digit, index) => (
              <div key={index} className="otp-digit">
                {digit}
              </div>
            ))}
          </div>
          
          <p className="otp-note">
            Keep this OTP safe and don't share it with anyone except our delivery partner
          </p>
        </div>

        <div className="delivery-timeline">
          <h3 className="timeline-title">Order Status</h3>
          <div className="timeline-steps">
            <div className="timeline-step">
              <div className="step-icon step-active">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span className="step-label">Order Confirmed</span>
              <div className="step-connector"></div>
            </div>
            
            <div className="timeline-step">
              <div className="step-icon step-pending">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <span className="step-label">Preparing</span>
              <div className="step-connector"></div>
            </div>
            
            <div className="timeline-step">
              <div className="step-icon step-pending">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 17H7A5 5 0 0 1 7 7h2"></path>
                  <path d="M15 7h2a5 5 0 1 1 0 10h-2"></path>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <span className="step-label">On the Way</span>
              <div className="step-connector"></div>
            </div>
            
            <div className="timeline-step">
              <div className="step-icon step-pending">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span className="step-label">Delivered</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/user/orders" className="action-btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            Track Your Order
          </Link>
          
          <Link to="/user" className="action-btn btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;