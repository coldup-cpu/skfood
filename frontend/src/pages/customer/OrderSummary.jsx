import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { Button, Card, Badge, Input } from '../../components/UI';
import '../../components/CustomerTheme.css';
import './OrderSummary.css';

const OrderSummary = () => {
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const {
    selectedSabjis,
    selectedBase,
    extraRoti,
    quantity,
    updateQuantity,
    updateSpecialInstructions,
    calculatePrice
  } = useOrder();
  
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if no items selected
    if (selectedSabjis.length === 0) {
      navigate('/meal-builder');
      return;
    }
    
    // Update special instructions in context
    updateSpecialInstructions(specialInstructions);
  }, [selectedSabjis.length, specialInstructions, navigate, updateSpecialInstructions]);

  const pricing = calculatePrice();

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, Math.min(5, quantity + change));
    updateQuantity(newQuantity);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const getBaseDisplayName = () => {
    switch (selectedBase) {
      case 'roti': return '5 Roti';
      case 'roti+rice': return '3 Roti + Rice';
      case 'rice': return 'Rice Only';
      default: return selectedBase;
    }
  };

  return (
    <div className="order-summary">
      <div className="order-summary-header">
        <h1 className="page-title">Order Summary</h1>
        <p className="page-subtitle">Review your delicious thali before checkout</p>
      </div>

      <div className="order-summary-content">
        {/* Thali Preview */}
        <Card className="thali-summary-card">
          <div className="thali-visual">
            <div className="thali-plate">
              <div className="plate-center">
                <span className="thali-emoji">🍽️</span>
              </div>
              <div className="plate-items">
                {selectedSabjis.map((sabji, index) => (
                  <div key={index} className={`plate-item item-${index + 1}`}>
                    <span className="item-emoji">🥘</span>
                  </div>
                ))}
                <div className="plate-item item-base">
                  <span className="item-emoji">
                    {selectedBase.includes('rice') ? '🍚' : '🫓'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="thali-details">
            <h3 className="thali-title">Your Custom Thali</h3>
            
            <div className="items-breakdown">
              <div className="item-section">
                <h4 className="section-title">Selected Sabjis</h4>
                <div className="items-list">
                  {selectedSabjis.map((sabji, index) => (
                    <div key={index} className="item-row">
                      <span className="item-name">{sabji.name}</span>
                      <div className="item-badges">
                        {sabji.isSpecial && (
                          <Badge size="sm" variant="warning">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            Special
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="item-section">
                <h4 className="section-title">Base & Extras</h4>
                <div className="items-list">
                  <div className="item-row">
                    <span className="item-name">{getBaseDisplayName()}</span>
                  </div>
                  {extraRoti > 0 && (
                    <div className="item-row">
                      <span className="item-name">Extra Roti ({extraRoti})</span>
                      <span className="item-price">+₹{extraRoti * 5}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="item-section">
                <h4 className="section-title">Complimentary</h4>
                <div className="items-list">
                  <div className="item-row">
                    <span className="item-name">Fresh Raita</span>
                    <Badge size="sm" variant="success">Free</Badge>
                  </div>
                  <div className="item-row">
                    <span className="item-name">Garden Salad</span>
                    <Badge size="sm" variant="success">Free</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quantity Selector */}
        <Card className="quantity-card">
          <h3 className="card-title">Quantity</h3>
          <p className="card-description">How many thalis would you like?</p>
          
          <div className="quantity-selector-large">
            <button 
              className="quantity-btn"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity === 1}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <div className="quantity-display-large">
              <span className="quantity-number">{quantity}</span>
              <span className="quantity-label">Thali{quantity > 1 ? 's' : ''}</span>
            </div>
            <button 
              className="quantity-btn"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity === 5}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>

          {quantity >= 3 && (
            <div className="bulk-discount-notice">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              <span>Great! You're getting 5% bulk discount</span>
            </div>
          )}
        </Card>

        {/* Special Instructions */}
        <Card className="instructions-card">
          <h3 className="card-title">Special Instructions</h3>
          <p className="card-description">Any specific requests for your order? (Optional)</p>
          
          <Input
            as="textarea"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="e.g., Less spicy, extra raita, no onions..."
            rows={3}
            maxLength={200}
          />
          <div className="char-count">
            {specialInstructions.length}/200 characters
          </div>
        </Card>

        {/* Price Breakdown */}
        <Card className="price-breakdown-card">
          <h3 className="card-title">Price Breakdown</h3>
          
          <div className="price-details">
            <div className="price-row">
              <span className="price-label">Per Thali</span>
              <span className="price-value">₹{pricing.perThaliPrice}</span>
            </div>
            
            <div className="price-row">
              <span className="price-label">Quantity ({quantity})</span>
              <span className="price-value">₹{pricing.subtotal}</span>
            </div>

            {pricing.discount > 0 && (
              <div className="price-row discount">
                <span className="price-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  Bulk Discount (5%)
                </span>
                <span className="price-value">-₹{Math.round(pricing.discount)}</span>
              </div>
            )}

            <div className="price-row">
              <span className="price-label">Tax (5%)</span>
              <span className="price-value">₹{Math.round(pricing.tax)}</span>
            </div>

            <div className="price-row">
              <span className="price-label">Delivery Fee</span>
              <span className="price-value">₹{pricing.deliveryFee}</span>
            </div>

            <div className="price-divider"></div>

            <div className="price-row total">
              <span className="price-label">Total Amount</span>
              <span className="price-value">₹{pricing.total}</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="order-actions">
          <Button
            variant="secondary"
            onClick={() => navigate('/meal-builder')}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            }
          >
            Modify Order
          </Button>

          <Button
            className="btn-primary-customer"
            size="lg"
            onClick={handleProceedToCheckout}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            }
          >
            Proceed to Checkout • ₹{pricing.total}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;