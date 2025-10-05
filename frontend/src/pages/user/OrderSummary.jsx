import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMealBuilder } from '../../contexts/MealBuilderContext';
import { QuantitySelector, ProgressSteps, PriceBreakdown, Button } from '../../components/user/UserComponents';
import './BuildDishes.css';
import './OrderSummary.css';

const OrderSummary = () => {
  const navigate = useNavigate();
  const {
    mealType,
    selectedDishes,
    selectedBase,
    extraRotis,
    quantity,
    setQuantity,
    setCurrentStep,
    BASE_PRICE,
    EXTRA_ROTI_PRICE,
    DELIVERY_FEE,
    calculateSubtotal,
    calculateDiscount,
    calculateTax,
    calculateTotal
  } = useMealBuilder();

  useEffect(() => {
    setCurrentStep(3);
    if (selectedDishes.length !== 2) {
      navigate('/build/dishes');
    }
  }, [selectedDishes]);

  const baseLabels = {
    roti: '5 Rotis',
    'roti+rice': '3 Rotis + Rice',
    rice: 'Rice Bowl'
  };

  const priceItems = [
    { label: 'Base Price', value: BASE_PRICE },
    { label: 'Extra Rotis', value: extraRotis * EXTRA_ROTI_PRICE },
    { label: 'Subtotal', value: calculateSubtotal() },
    { type: 'divider' },
  ];

  const discount = calculateDiscount();
  if (discount > 0) {
    priceItems.push({ label: '5% Bulk Discount (3+ thalis)', value: discount.toFixed(0), discount: true });
  }

  priceItems.push(
    { label: 'Tax (5%)', value: calculateTax().toFixed(0) },
    { label: 'Delivery Fee', value: DELIVERY_FEE },
    { type: 'divider' },
    { label: 'Total Amount', value: calculateTotal().toFixed(0), highlight: true }
  );

  const handleProceed = () => {
    navigate('/checkout/address');
  };

  return (
    <div className="user-build-page user-animate-fadeIn">
      <div className="user-build-container">
        <ProgressSteps steps={4} currentStep={2} />

        <div className="user-build-header">
          <h1 className="user-build-title">Review Your Order</h1>
          <p className="user-build-subtitle">
            Adjust quantity and confirm your thali details
          </p>
        </div>

        <div className="user-summary-section">
          <div className="user-summary-card user-animate-slideUp">
            <h3 className="user-summary-card-title">
              <span className="user-summary-icon">🍛</span>
              Your Thali
            </h3>
            <div className="user-summary-items">
              <div className="user-summary-item">
                <span className="user-summary-item-label">Meal Type:</span>
                <span className="user-summary-item-value">{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</span>
              </div>
              <div className="user-summary-item">
                <span className="user-summary-item-label">Dishes:</span>
                <span className="user-summary-item-value">
                  {selectedDishes.map(d => d.name).join(', ')}
                </span>
              </div>
              <div className="user-summary-item">
                <span className="user-summary-item-label">Base:</span>
                <span className="user-summary-item-value">{baseLabels[selectedBase]}</span>
              </div>
              {extraRotis > 0 && (
                <div className="user-summary-item">
                  <span className="user-summary-item-label">Extra Rotis:</span>
                  <span className="user-summary-item-value">{extraRotis}</span>
                </div>
              )}
              <div className="user-summary-item">
                <span className="user-summary-item-label">Includes:</span>
                <span className="user-summary-item-value">Fresh Raita, Garden Salad</span>
              </div>
            </div>
            <button
              className="user-summary-edit-btn"
              onClick={() => navigate('/build/dishes')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Selection
            </button>
          </div>

          <div className="user-summary-card user-animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <h3 className="user-summary-card-title">
              <span className="user-summary-icon">📦</span>
              Quantity
            </h3>
            <div className="user-summary-quantity">
              <div className="user-summary-quantity-info">
                <div className="user-summary-quantity-label">Number of Thalis</div>
                <div className="user-summary-quantity-hint">
                  {quantity >= 3 && '🎉 5% discount applied!'}
                </div>
              </div>
              <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={5} />
            </div>
          </div>

          <PriceBreakdown items={priceItems} className="user-animate-slideUp" style={{ animationDelay: '0.2s' }} />

          <div className="user-summary-delivery user-animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Estimated delivery: 30-40 minutes</span>
          </div>
        </div>
      </div>

      <div className="user-build-footer">
        <div className="user-build-footer-content">
          <div className="user-build-footer-info">
            <div className="user-build-footer-label">Total Amount</div>
            <div className="user-build-footer-selection">₹{calculateTotal().toFixed(0)}</div>
          </div>
          <div className="user-build-footer-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={handleProceed}
            >
              Proceed to Address
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
