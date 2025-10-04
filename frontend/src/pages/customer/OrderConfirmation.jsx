import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card } from '../../components/UI';
import { userAPI } from '../../services/api';
import '../../components/CustomerTheme.css';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otp] = useState(Math.floor(1000 + Math.random() * 9000));

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await userAPI.getOrderById(orderId);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="order-confirmation loading">
        <div className="loading-spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-confirmation error">
        <Card className="error-card">
          <div className="error-icon">❌</div>
          <h2>Order Not Found</h2>
          <p>We couldn't find the order you're looking for.</p>
          <Button
            className="btn-primary-customer"
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <div className="success-animation">
        <div className="success-circle">
          <div className="checkmark-container">
            <svg className="checkmark" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
        </div>
      </div>

      <div className="confirmation-header">
        <h1 className="confirmation-title">Order Confirmed!</h1>
        <p className="confirmation-subtitle">
          Your delicious meal is being prepared
        </p>
      </div>

      <div className="confirmation-content">
        <Card className="otp-card">
          <div className="otp-header">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <h3>Your Delivery OTP</h3>
          </div>
          <p className="otp-description">
            Share this 4-digit code with the delivery person
          </p>
          <div className="otp-display">
            {otp.toString().split('').map((digit, index) => (
              <div key={index} className="otp-digit">
                {digit}
              </div>
            ))}
          </div>
          <div className="otp-notice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>Do not share this OTP with anyone else</span>
          </div>
        </Card>

        <Card className="order-info-card">
          <div className="order-info-header">
            <h3>Order Details</h3>
            <span className="order-id">#{order._id?.slice(-8) || orderId.slice(-8)}</span>
          </div>

          <div className="order-info-section">
            <div className="info-row">
              <span className="info-label">Order Status</span>
              <span className="status-badge preparing">
                <span className="status-dot"></span>
                Preparing
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Estimated Delivery</span>
              <span className="info-value">30-45 minutes</span>
            </div>

            <div className="info-row">
              <span className="info-label">Quantity</span>
              <span className="info-value">{order.quantity} Thali(s)</span>
            </div>

            <div className="info-row">
              <span className="info-label">Total Amount</span>
              <span className="info-value amount">₹{order.totalPrice}</span>
            </div>
          </div>
        </Card>

        <Card className="delivery-info-card">
          <h3 className="card-title">Delivery Information</h3>

          <div className="delivery-details">
            <div className="delivery-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <div>
                <p className="delivery-label">Contact Name</p>
                <p className="delivery-value">{order.contactName}</p>
              </div>
            </div>

            <div className="delivery-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <div>
                <p className="delivery-label">Phone Number</p>
                <p className="delivery-value">{order.contactPhone}</p>
              </div>
            </div>

            <div className="delivery-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div>
                <p className="delivery-label">Delivery Address</p>
                <p className="delivery-value">{order.deliveryAddress}</p>
              </div>
            </div>

            {order.specialInstructions && (
              <div className="delivery-row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <div>
                  <p className="delivery-label">Special Instructions</p>
                  <p className="delivery-value">{order.specialInstructions}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="meal-details-card">
          <h3 className="card-title">Your Meal</h3>

          <div className="meal-items">
            <div className="meal-item">
              <span className="meal-emoji">🥘</span>
              <span className="meal-text">{order.sabjisSelected.join(', ')}</span>
            </div>
            <div className="meal-item">
              <span className="meal-emoji">
                {order.base === 'rice' ? '🍚' : '🫓'}
              </span>
              <span className="meal-text">{order.base}</span>
            </div>
            {order.extraRoti > 0 && (
              <div className="meal-item">
                <span className="meal-emoji">➕</span>
                <span className="meal-text">{order.extraRoti} Extra Roti</span>
              </div>
            )}
            <div className="meal-item complimentary">
              <span className="meal-emoji">🥗</span>
              <span className="meal-text">Raita & Salad (Free)</span>
            </div>
          </div>
        </Card>

        <div className="action-buttons">
          <Button
            className="btn-primary-customer"
            onClick={() => navigate('/my-orders')}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            }
          >
            View My Orders
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate('/')}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            }
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
