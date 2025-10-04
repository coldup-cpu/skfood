import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './OrderSummary.css';

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;
  
  const [quantity, setQuantity] = useState(1);

  // Redirect if no order data
  if (!orderData) {
    return (
      <div className="order-summary-page">
        <div className="summary-header">
          <h1 className="summary-title">Order Not Found</h1>
          <p className="summary-subtitle">
            Please start by building your meal first.
          </p>
          <Link to="/user" className="checkout-btn btn-primary">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const calculateTotalPrice = () => {
    return orderData.totalPrice * quantity;
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 5) {
      setQuantity(newQuantity);
    }
  };

  const handleProceedToCheckout = () => {
    const finalOrderData = {
      ...orderData,
      quantity,
      finalTotalPrice: calculateTotalPrice()
    };
    
    navigate('/user/checkout', { state: finalOrderData });
  };

  const getMealTimeRange = () => {
    return orderData.mealType === 'lunch' ? '12:00 PM - 3:00 PM' : '7:00 PM - 10:00 PM';
  };

  return (
    <div className="order-summary-page">
      <div className="summary-header">
        <h1 className="summary-title">Order Summary</h1>
        <p className="summary-subtitle">
          Review your meal details and quantity before checkout
        </p>
      </div>

      <div className="summary-content">
        <div className="order-details">
          <div className="detail-section">
            <h2 className="detail-title">
              <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Meal Information
            </h2>
            <div className="meal-info">
              <div className="meal-type-badge">
                {orderData.mealType}
              </div>
              <div className="meal-time">
                Available: {getMealTimeRange()}
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h2 className="detail-title">
              <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Selected Sabjis
            </h2>
            <div className="items-grid">
              {orderData.selectedSabjis.map((sabji, index) => (
                <span key={index} className={`item-tag ${orderData.isSpecial ? 'special' : ''}`}>
                  {sabji} {orderData.isSpecial && '⭐'}
                </span>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h2 className="detail-title">
              <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Base & Extras
            </h2>
            <div className="items-grid">
              <span className="item-tag">
                {orderData.base === 'roti' ? '5 Rotis' : '3 Rotis + Rice'}
              </span>
              {orderData.extraRoti > 0 && (
                <span className="item-tag">
                  +{orderData.extraRoti} Extra Roti{orderData.extraRoti > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h2 className="detail-title">
              <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.51 0 2.93.37 4.18 1.03"></path>
              </svg>
              Included Items
            </h2>
            <div className="items-grid">
              <span className="item-tag included">Fresh Raita</span>
              <span className="item-tag included">Mixed Salad</span>
              <span className="item-tag included">Pickle</span>
            </div>
            <p className="included-note">
              These items are included with every meal at no extra cost
            </p>
          </div>
        </div>

        <div className="order-sidebar">
          <div className="quantity-card">
            <h3 className="quantity-title">Select Quantity</h3>
            <div className="quantity-selector">
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <div className="quantity-display">
                <span className="quantity-value">{quantity}</span>
                <span className="quantity-label">Thali{quantity > 1 ? 's' : ''}</span>
              </div>
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 5}
              >
                +
              </button>
            </div>
            <p className="quantity-note">
              You can order up to 5 thalis at once. For larger orders, please contact us directly.
            </p>
          </div>

          <div className="price-card">
            <div className="price-breakdown">
              <div className="price-row">
                <span className="price-label">Price per thali</span>
                <span className="price-value">₹{orderData.totalPrice}</span>
              </div>
              <div className="price-row subtotal">
                <span className="price-label">Quantity</span>
                <span className="price-value">× {quantity}</span>
              </div>
              <div className="price-row total">
                <span className="price-label">Total Amount</span>
                <span className="price-value">₹{calculateTotalPrice()}</span>
              </div>
            </div>
            
            {quantity > 1 && (
              <div className="savings-note">
                💰 Great choice! Ordering multiple thalis together.
              </div>
            )}
          </div>

          <div className="checkout-actions">
            <button
              className="checkout-btn btn-primary"
              onClick={handleProceedToCheckout}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Proceed to Checkout
            </button>
            
            <Link to="/user/meal-builder" className="checkout-btn btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Modify Order
            </Link>
          </div>

          <div className="trust-indicators">
            <div className="trust-item">
              <svg className="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Secure Payment
            </div>
            <div className="trust-item">
              <svg className="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Fast Delivery
            </div>
            <div className="trust-item">
              <svg className="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.51 0 2.93.37 4.18 1.03"></path>
              </svg>
              Quality Assured
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;