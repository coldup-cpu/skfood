import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { Button, Card } from '../../components/UI';
import { userAPI } from '../../services/api';
import '../../components/CustomerTheme.css';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getOrderData, calculatePrice, resetOrder } = useOrder();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const orderData = getOrderData();
  const pricing = calculatePrice();

  const paymentMethods = [
    {
      id: 'online',
      name: 'UPI / Cards / Netbanking',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
      ),
      popular: true,
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      popular: false,
    },
  ];

  const handlePayment = async () => {
    if (!orderData.address) {
      navigate('/checkout');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const orderPayload = {
        sabjisSelected: orderData.sabjisSelected,
        base: orderData.base,
        extraRoti: orderData.extraRoti,
        quantity: orderData.quantity,
        isSpecial: orderData.isSpecial,
        totalPrice: orderData.totalPrice,
        deliveryAddress: `${orderData.address.address}, ${orderData.address.landmark ? orderData.address.landmark + ', ' : ''}${orderData.address.city}`,
        contactPhone: orderData.address.phone,
        contactName: orderData.address.name,
        specialInstructions: orderData.specialInstructions,
        paymentMethod: selectedPaymentMethod,
      };

      if (selectedPaymentMethod === 'online') {
        await simulateOnlinePayment();
      }

      const response = await userAPI.createOrder(orderPayload);

      if (response.data && response.data.order) {
        const orderId = response.data.order._id || response.data.order.id;
        resetOrder();
        navigate(`/order-confirmation/${orderId}`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const simulateOnlinePayment = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  return (
    <div className="payment">
      <div className="payment-header">
        <button className="back-btn" onClick={() => navigate('/checkout')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div>
          <h1 className="page-title">Payment</h1>
          <p className="page-subtitle">Choose your payment method</p>
        </div>
      </div>

      <div className="payment-content">
        <Card className="payment-methods-card">
          <h3 className="card-title">Payment Method</h3>

          <div className="payment-methods-list">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`payment-method-item ${selectedPaymentMethod === method.id ? 'selected' : ''}`}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <div className="payment-method-radio">
                  {selectedPaymentMethod === method.id && (
                    <div className="radio-dot"></div>
                  )}
                </div>
                <div className="payment-method-icon">{method.icon}</div>
                <div className="payment-method-info">
                  <span className="payment-method-name">{method.name}</span>
                  {method.popular && (
                    <span className="popular-badge">Most Popular</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedPaymentMethod === 'online' && (
            <div className="payment-info-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <p>You will be redirected to a secure payment gateway</p>
            </div>
          )}

          {selectedPaymentMethod === 'cod' && (
            <div className="payment-info-box cod">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <p>Pay with cash when your order is delivered</p>
            </div>
          )}
        </Card>

        <Card className="order-summary-card">
          <h3 className="card-title">Order Summary</h3>

          <div className="summary-items">
            <div className="summary-row">
              <span className="summary-label">
                {orderData.quantity} × Custom Thali
              </span>
              <span className="summary-value">₹{pricing.subtotal}</span>
            </div>

            {pricing.discount > 0 && (
              <div className="summary-row discount">
                <span className="summary-label">Bulk Discount (5%)</span>
                <span className="summary-value">-₹{Math.round(pricing.discount)}</span>
              </div>
            )}

            <div className="summary-row">
              <span className="summary-label">Tax (5%)</span>
              <span className="summary-value">₹{Math.round(pricing.tax)}</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Delivery Fee</span>
              <span className="summary-value">₹{pricing.deliveryFee}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span className="summary-label">Total Amount</span>
              <span className="summary-value">₹{pricing.total}</span>
            </div>
          </div>
        </Card>

        {orderData.address && (
          <Card className="delivery-address-preview">
            <div className="address-header">
              <h3 className="card-title">Delivery Address</h3>
              <button
                className="edit-link"
                onClick={() => navigate('/checkout')}
              >
                Edit
              </button>
            </div>
            <div className="address-preview">
              <p className="address-name">{orderData.address.name}</p>
              <p className="address-phone">{orderData.address.phone}</p>
              <p className="address-text">
                {orderData.address.address}
                {orderData.address.landmark && `, ${orderData.address.landmark}`}
              </p>
              <p className="address-city">{orderData.address.city}</p>
            </div>
          </Card>
        )}

        {error && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="payment-actions">
          <Button
            variant="secondary"
            onClick={() => navigate('/checkout')}
            disabled={isProcessing}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            }
          >
            Back
          </Button>

          <Button
            className="btn-primary-customer"
            size="lg"
            onClick={handlePayment}
            disabled={isProcessing}
            icon={
              isProcessing ? (
                <div className="spinner"></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )
            }
          >
            {isProcessing ? 'Processing...' : `Pay ₹${pricing.total}`}
          </Button>
        </div>

        <div className="secure-payment-notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default Payment;
