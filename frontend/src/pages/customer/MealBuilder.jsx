import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { userAPI } from '../../services/api';
import { Button, Card, Badge, LoadingSpinner } from '../../components/UI';
import '../../components/CustomerTheme.css';
import './MealBuilder.css';

const MealBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mealType, setMealType] = useState('lunch');
  
  const {
    selectedSabjis,
    selectedBase,
    extraRoti,
    selectSabji,
    selectBase,
    updateExtraRoti,
    calculatePrice
  } = useOrder();
  
  const navigate = useNavigate();

  useEffect(() => {
    // Determine meal type based on current time
    const hour = new Date().getHours();
    const currentMealType = (hour >= 19 || hour < 12) ? 'dinner' : 'lunch';
    setMealType(currentMealType);
    fetchMenu(currentMealType);
  }, []);

  const fetchMenu = async (type) => {
    try {
      setLoading(true);
      const response = type === 'lunch' 
        ? await userAPI.getLunchMenu() 
        : await userAPI.getDinnerMenu();
      
      if (response.data && response.data.length > 0) {
        setMenu(response.data[0]);
      } else {
        // Fallback dummy data for demo
        setMenu({
          mealType: type,
          basePrice: 120,
          listOfSabjis: [
            { name: 'Paneer Butter Masala', imageUrl: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg', isSpecial: true },
            { name: 'Dal Tadka', imageUrl: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg', isSpecial: false },
            { name: 'Aloo Gobi', imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', isSpecial: false },
            { name: 'Rajma Masala', imageUrl: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg', isSpecial: true },
            { name: 'Bhindi Masala', imageUrl: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg', isSpecial: false },
            { name: 'Chole', imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', isSpecial: false }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSabjiSelect = (sabji) => {
    selectSabji(sabji);
  };

  const handleBaseSelect = (base) => {
    selectBase(base);
  };

  const handleExtraRotiChange = (change) => {
    const newCount = Math.max(0, Math.min(3, extraRoti + change));
    updateExtraRoti(newCount);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/order-summary');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedSabjis.length === 2;
    if (currentStep === 2) return selectedBase !== '';
    return true;
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Choose Your Sabjis';
      case 2: return 'Select Your Base';
      case 3: return 'Review Your Thali';
      default: return 'Build Your Thali';
    }
  };

  const getNextButtonText = () => {
    switch (currentStep) {
      case 1: return 'Next: Choose Base';
      case 2: return 'Next: Review Thali';
      case 3: return 'Continue to Summary';
      default: return 'Next';
    }
  };

  if (loading) {
    return (
      <div className="meal-builder-loading">
        <LoadingSpinner size="lg" />
        <p>Loading today's menu...</p>
      </div>
    );
  }

  return (
    <div className="meal-builder">
      {/* Progress Indicator */}
      <div className="progress-indicator">
        {[1, 2, 3].map((step) => (
          <div key={step} className="progress-step">
            <div className={`progress-circle ${
              step < currentStep ? 'completed' : 
              step === currentStep ? 'active' : 'inactive'
            }`}>
              {step < currentStep ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : step}
            </div>
            {step < 3 && <div className={`progress-line ${step < currentStep ? 'completed' : ''}`}></div>}
          </div>
        ))}
      </div>

      <div className="meal-builder-header">
        <h1 className="meal-builder-title">{getStepTitle()}</h1>
        <p className="meal-builder-subtitle">
          Step {currentStep} of 3 • {mealType === 'lunch' ? 'Lunch' : 'Dinner'} Menu
        </p>
      </div>

      {/* Step 1: Sabji Selection */}
      {currentStep === 1 && (
        <div className="step-content">
          <div className="selection-info">
            <p>Select exactly 2 sabjis for your thali</p>
            <div className="selection-counter">
              {selectedSabjis.length} of 2 selected
            </div>
          </div>

          <div className="sabjis-grid">
            {menu?.listOfSabjis?.map((sabji, index) => {
              const isSelected = selectedSabjis.some(s => s.name === sabji.name);
              return (
                <Card 
                  key={index} 
                  className={`sabji-card ${isSelected ? 'selected' : ''} ${selectedSabjis.length >= 2 && !isSelected ? 'disabled' : ''}`}
                  onClick={() => handleSabjiSelect(sabji)}
                >
                  <div className="sabji-image-container">
                    <img 
                      src={sabji.imageUrl || 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg'} 
                      alt={sabji.name}
                      className="sabji-image"
                    />
                    {sabji.isSpecial && (
                      <Badge className="special-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        Special
                      </Badge>
                    )}
                    {isSelected && (
                      <div className="selection-checkmark">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="sabji-info">
                    <h3 className="sabji-name">{sabji.name}</h3>
                    {sabji.isSpecial && <span className="special-price">+₹20</span>}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Base Selection */}
      {currentStep === 2 && (
        <div className="step-content">
          <div className="base-options">
            {[
              { value: 'roti', label: '5 Roti Only', description: 'Perfect for roti lovers', icon: '🫓' },
              { value: 'roti+rice', label: '3 Roti + Rice', description: 'Best of both worlds', icon: '🍚' },
              { value: 'rice', label: 'Rice Only', description: 'For rice enthusiasts', icon: '🍛' }
            ].map((option) => (
              <Card 
                key={option.value}
                className={`base-option ${selectedBase === option.value ? 'selected' : ''}`}
                onClick={() => handleBaseSelect(option.value)}
              >
                <div className="base-icon">{option.icon}</div>
                <div className="base-info">
                  <h3 className="base-name">{option.label}</h3>
                  <p className="base-description">{option.description}</p>
                </div>
                <div className="base-radio">
                  <div className={`radio-circle ${selectedBase === option.value ? 'selected' : ''}`}>
                    {selectedBase === option.value && <div className="radio-dot"></div>}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="extra-roti-section">
            <h3 className="section-title">Extra Roti (Optional)</h3>
            <p className="section-description">Add extra rotis for ₹5 each (max 3)</p>
            
            <div className="quantity-selector">
              <button 
                className="quantity-btn"
                onClick={() => handleExtraRotiChange(-1)}
                disabled={extraRoti === 0}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span className="quantity-display">{extraRoti}</span>
              <button 
                className="quantity-btn"
                onClick={() => handleExtraRotiChange(1)}
                disabled={extraRoti === 3}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>

            {extraRoti > 0 && (
              <p className="extra-cost">+₹{extraRoti * 5} for {extraRoti} extra roti{extraRoti > 1 ? 's' : ''}</p>
            )}
          </Card>
        </div>
      )}

      {/* Step 3: Review */}
      {currentStep === 3 && (
        <div className="step-content">
          <Card className="thali-preview">
            <h3 className="section-title">Your Thali Includes</h3>
            
            <div className="thali-items">
              <div className="item-category">
                <h4>Selected Sabjis</h4>
                <div className="items-list">
                  {selectedSabjis.map((sabji, index) => (
                    <div key={index} className="thali-item">
                      <span className="item-name">{sabji.name}</span>
                      {sabji.isSpecial && <Badge size="sm" variant="warning">Special</Badge>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="item-category">
                <h4>Base</h4>
                <div className="thali-item">
                  <span className="item-name">
                    {selectedBase === 'roti' ? '5 Roti' : 
                     selectedBase === 'roti+rice' ? '3 Roti + Rice' : 'Rice'}
                  </span>
                </div>
                {extraRoti > 0 && (
                  <div className="thali-item">
                    <span className="item-name">+{extraRoti} Extra Roti</span>
                    <span className="item-price">₹{extraRoti * 5}</span>
                  </div>
                )}
              </div>

              <div className="item-category">
                <h4>Complimentary</h4>
                <div className="thali-item">
                  <span className="item-name">Raita</span>
                  <Badge size="sm" variant="success">Free</Badge>
                </div>
                <div className="thali-item">
                  <span className="item-name">Garden Salad</span>
                  <Badge size="sm" variant="success">Free</Badge>
                </div>
              </div>
            </div>

            <div className="price-preview">
              <div className="price-row">
                <span>Base Thali</span>
                <span>₹{menu?.basePrice || 120}</span>
              </div>
              {selectedSabjis.some(s => s.isSpecial) && (
                <div className="price-row">
                  <span>Special Sabji</span>
                  <span>₹20</span>
                </div>
              )}
              {extraRoti > 0 && (
                <div className="price-row">
                  <span>Extra Roti ({extraRoti})</span>
                  <span>₹{extraRoti * 5}</span>
                </div>
              )}
              <div className="price-row total">
                <span>Per Thali Total</span>
                <span>₹{calculatePrice().perThaliPrice}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="meal-builder-navigation">
        <Button
          variant="secondary"
          onClick={prevStep}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          }
        >
          {currentStep === 1 ? 'Back to Home' : 'Previous'}
        </Button>

        <Button
          className="btn-primary-customer"
          onClick={nextStep}
          disabled={!canProceed()}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          }
        >
          {getNextButtonText()}
        </Button>
      </div>
    </div>
  );
};

export default MealBuilder;