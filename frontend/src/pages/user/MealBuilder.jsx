import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { userAPI } from '../../services/api';
import { LoadingSpinner } from '../../components/UI';
import './MealBuilder.css';

const MealBuilder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mealType = searchParams.get('type') || 'lunch';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Order state
  const [selectedSabjis, setSelectedSabjis] = useState([]);
  const [selectedBase, setSelectedBase] = useState('roti');
  const [extraRoti, setExtraRoti] = useState(0);

  useEffect(() => {
    fetchMenu();
  }, [mealType]);

  const fetchMenu = async () => {
    try {
      const response = mealType === 'lunch' 
        ? await userAPI.getLunchMenu()
        : await userAPI.getDinnerMenu();
      
      setMenu(response.data[0] || null);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSabjiSelect = (sabji) => {
    if (selectedSabjis.find(s => s.name === sabji.name)) {
      setSelectedSabjis(selectedSabjis.filter(s => s.name !== sabji.name));
    } else if (selectedSabjis.length < 2) {
      setSelectedSabjis([...selectedSabjis, sabji]);
    }
  };

  const removeSabji = (sabjiName) => {
    setSelectedSabjis(selectedSabjis.filter(s => s.name !== sabjiName));
  };

  const calculatePrice = () => {
    const basePrice = menu?.basePrice || 120;
    const specialPrice = selectedSabjis.some(s => s.isSpecial) ? 20 : 0;
    const rotiPrice = extraRoti * 10;
    return basePrice + specialPrice + rotiPrice;
  };

  const canProceedToNext = () => {
    if (currentStep === 1) return selectedSabjis.length >= 1;
    if (currentStep === 2) return selectedBase;
    return true;
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to order summary with order data
      const orderData = {
        mealType,
        selectedSabjis: selectedSabjis.map(s => s.name),
        base: selectedBase,
        extraRoti,
        totalPrice: calculatePrice(),
        isSpecial: selectedSabjis.some(s => s.isSpecial)
      };
      
      navigate('/user/order-summary', { state: orderData });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/user');
    }
  };

  if (loading) {
    return (
      <div className="meal-builder">
        <div className="loading-container">
          <LoadingSpinner size="lg" />
          <p className="loading-text">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="meal-builder">
        <div className="builder-header">
          <h1 className="builder-title">Menu Not Available</h1>
          <p className="builder-subtitle">
            The {mealType} menu is not available right now. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  const renderProgressBar = () => (
    <div className="progress-bar">
      <div className={`progress-step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'inactive'}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        Choose Sabjis
      </div>
      <div className={`progress-connector ${currentStep > 1 ? 'completed' : ''}`}></div>
      <div className={`progress-step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : 'inactive'}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        Select Base
      </div>
      <div className={`progress-connector ${currentStep > 2 ? 'completed' : ''}`}></div>
      <div className={`progress-step ${currentStep === 3 ? 'active' : 'inactive'}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4"></path>
          <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.51 0 2.93.37 4.18 1.03"></path>
        </svg>
        Review Order
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="step-content">
      <h2 className="step-title">Choose Your Sabjis</h2>
      <p className="step-description">
        Select 1-2 sabjis for your {mealType}. Special sabjis have an additional charge of ₹20.
      </p>

      {selectedSabjis.length > 0 && (
        <div className="selection-summary">
          <h3 className="summary-title">Selected Sabjis ({selectedSabjis.length}/2)</h3>
          <div className="selected-items">
            {selectedSabjis.map((sabji, index) => (
              <div key={index} className="selected-item">
                {sabji.name}
                {sabji.isSpecial && <span>⭐</span>}
                <button 
                  className="remove-item"
                  onClick={() => removeSabji(sabji.name)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sabjis-grid">
        {menu.listOfSabjis?.map((sabji, index) => {
          const isSelected = selectedSabjis.find(s => s.name === sabji.name);
          const isDisabled = !isSelected && selectedSabjis.length >= 2;
          
          return (
            <div
              key={index}
              className={`sabji-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => !isDisabled && handleSabjiSelect(sabji)}
            >
              {sabji.imageUrl ? (
                <img src={sabji.imageUrl} alt={sabji.name} className="sabji-image" />
              ) : (
                <div className="sabji-image-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
              )}
              
              <div className="sabji-info">
                <div className="sabji-details">
                  <h3>{sabji.name}</h3>
                  {sabji.isSpecial && (
                    <div className="sabji-special">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      Special (+₹20)
                    </div>
                  )}
                </div>
                <div className="selection-indicator">
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-content">
      <h2 className="step-title">Choose Your Base</h2>
      <p className="step-description">
        Select your preferred base option and add extra rotis if needed.
      </p>

      <div className="base-options">
        <div
          className={`base-card ${selectedBase === 'roti' ? 'selected' : ''}`}
          onClick={() => setSelectedBase('roti')}
        >
          <div className="base-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
          </div>
          <h3 className="base-title">5 Rotis</h3>
          <p className="base-description">Fresh, soft rotis made with whole wheat</p>
        </div>

        <div
          className={`base-card ${selectedBase === 'roti+rice' ? 'selected' : ''}`}
          onClick={() => setSelectedBase('roti+rice')}
        >
          <div className="base-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <path d="M9 9h6v6H9z"></path>
            </svg>
          </div>
          <h3 className="base-title">3 Rotis + Rice</h3>
          <p className="base-description">Combination of rotis and steamed basmati rice</p>
        </div>
      </div>

      <div className="extra-roti-section">
        <h3 className="extra-roti-title">Extra Rotis</h3>
        <div className="roti-counter">
          <span className="counter-label">Additional rotis:</span>
          <div className="counter-controls">
            <button
              className="counter-btn"
              onClick={() => setExtraRoti(Math.max(0, extraRoti - 1))}
              disabled={extraRoti === 0}
            >
              -
            </button>
            <span className="counter-value">{extraRoti}</span>
            <button
              className="counter-btn"
              onClick={() => setExtraRoti(Math.min(10, extraRoti + 1))}
              disabled={extraRoti === 10}
            >
              +
            </button>
          </div>
          <span className="counter-price">₹{extraRoti * 10}</span>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="step-content">
      <h2 className="step-title">Review Your Order</h2>
      <p className="step-description">
        Please review your meal selection before proceeding to checkout.
      </p>

      <div className="order-summary">
        <div className="summary-section">
          <h3 className="summary-section-title">Selected Sabjis</h3>
          <div className="summary-items">
            {selectedSabjis.map((sabji, index) => (
              <span key={index} className={`summary-item ${sabji.isSpecial ? 'special' : ''}`}>
                {sabji.name} {sabji.isSpecial && '⭐'}
              </span>
            ))}
          </div>
        </div>

        <div className="summary-section">
          <h3 className="summary-section-title">Base & Extras</h3>
          <div className="summary-items">
            <span className="summary-item">
              {selectedBase === 'roti' ? '5 Rotis' : '3 Rotis + Rice'}
            </span>
            {extraRoti > 0 && (
              <span className="summary-item">+{extraRoti} Extra Roti{extraRoti > 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        <div className="summary-section">
          <h3 className="summary-section-title">Included Items</h3>
          <div className="summary-items">
            <span className="summary-item">Fresh Raita</span>
            <span className="summary-item">Mixed Salad</span>
            <span className="summary-item">Pickle</span>
          </div>
        </div>

        <div className="summary-section">
          <h3 className="summary-section-title">Price Breakdown</h3>
          <div className="price-breakdown">
            <div className="price-row">
              <span className="price-label">Base meal</span>
              <span className="price-value">₹{menu.basePrice}</span>
            </div>
            {selectedSabjis.some(s => s.isSpecial) && (
              <div className="price-row">
                <span className="price-label">Special sabji</span>
                <span className="price-value">₹20</span>
              </div>
            )}
            {extraRoti > 0 && (
              <div className="price-row">
                <span className="price-label">Extra rotis ({extraRoti})</span>
                <span className="price-value">₹{extraRoti * 10}</span>
              </div>
            )}
            <div className="price-row total">
              <span className="price-label">Total</span>
              <span className="price-value">₹{calculatePrice()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="meal-builder">
      <div className="builder-header">
        <h1 className="builder-title">Build Your {mealType === 'lunch' ? 'Lunch' : 'Dinner'}</h1>
        <p className="builder-subtitle">
          Customize your meal exactly how you like it
        </p>
        {renderProgressBar()}
      </div>

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      <div className="builder-actions">
        <button className="action-btn btn-back" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          {currentStep === 1 ? 'Back to Menu' : 'Previous'}
        </button>

        <button
          className={`action-btn ${currentStep === 3 ? 'btn-continue' : 'btn-next'}`}
          onClick={handleNext}
          disabled={!canProceedToNext()}
        >
          {currentStep === 3 ? 'Continue to Order' : 'Next Step'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MealBuilder;