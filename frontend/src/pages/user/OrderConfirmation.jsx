import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMealBuilder } from '../../contexts/MealBuilderContext';
import { OTPDisplay, Button, StatusBadge } from '../../components/user/UserComponents';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mealType, selectedDishes, selectedBase, quantity, calculateTotal, resetBuilder } = useMealBuilder();
  const otp = location.state?.otp || '1234';
  const orderId = 'ORD' + Date.now().toString().slice(-8);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopyOTP = () => {
    navigator.clipboard.writeText(otp.toString());
    alert('OTP copied to clipboard!');
  };

  const handleOrderAgain = () => {
    resetBuilder();
    navigate('/');
  };

  const baseLabels = {
    roti: '5 Rotis',
    'roti+rice': '3 Rotis + Rice',
    rice: 'Rice Bowl'
  };

  return (
    <div className="user-confirmation-page user-animate-fadeIn">
      <div className="user-confirmation-container">
        <div className="user-confirmation-success user-animate-scaleIn">
          <div className="user-confirmation-checkmark">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1 className="user-confirmation-title">Order Confirmed!</h1>
          <p className="user-confirmation-subtitle">
            Your order has been placed successfully
          </p>
        </div>

        <OTPDisplay
          otp={otp}
          onCopy={handleCopyOTP}
          className="user-animate-slideUp"
        />

        <div className="user-confirmation-card user-animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div className="user-confirmation-card-header">
            <div>
              <div className="user-confirmation-order-id">Order #{orderId}</div>
              <div className="user-confirmation-order-time">
                {new Date().toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <StatusBadge status="Confirmed" />
          </div>
        </div>

        <div className="user-confirmation-card user-animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <h3 className="user-confirmation-card-title">Order Details</h3>
          <div className="user-confirmation-details">
            <div className="user-confirmation-detail-row">
              <span className="user-confirmation-detail-label">Meal Type:</span>
              <span className="user-confirmation-detail-value">
                {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
              </span>
            </div>
            <div className="user-confirmation-detail-row">
              <span className="user-confirmation-detail-label">Dishes:</span>
              <span className="user-confirmation-detail-value">
                {selectedDishes.map(d => d.name).join(', ')}
              </span>
            </div>
            <div className="user-confirmation-detail-row">
              <span className="user-confirmation-detail-label">Base:</span>
              <span className="user-confirmation-detail-value">{baseLabels[selectedBase]}</span>
            </div>
            <div className="user-confirmation-detail-row">
              <span className="user-confirmation-detail-label">Quantity:</span>
              <span className="user-confirmation-detail-value">{quantity} Thali{quantity > 1 ? 's' : ''}</span>
            </div>
            <div className="user-confirmation-detail-row highlight">
              <span className="user-confirmation-detail-label">Total Paid:</span>
              <span className="user-confirmation-detail-value">₹{calculateTotal().toFixed(0)}</span>
            </div>
          </div>
        </div>

        <div className="user-confirmation-status user-animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <div className="user-confirmation-status-icon user-animate-pulse">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <div>
            <div className="user-confirmation-status-title">Order Being Prepared</div>
            <div className="user-confirmation-status-text">
              Your delicious thali is being freshly prepared by our chef
            </div>
          </div>
        </div>

        <div className="user-confirmation-delivery user-animate-slideUp" style={{ animationDelay: '0.4s' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <div>
            <div className="user-confirmation-delivery-title">Estimated Delivery</div>
            <div className="user-confirmation-delivery-time">30-40 minutes</div>
          </div>
        </div>

        <div className="user-confirmation-actions user-animate-slideUp" style={{ animationDelay: '0.5s' }}>
          <Button variant="secondary" block onClick={() => navigate('/my-orders')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            View All Orders
          </Button>
          <Button variant="primary" block onClick={handleOrderAgain}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            Order Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
