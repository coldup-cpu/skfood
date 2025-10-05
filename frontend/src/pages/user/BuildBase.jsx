import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMealBuilder } from '../../contexts/MealBuilderContext';
import { QuantitySelector, ProgressSteps } from '../../components/user/UserComponents';
import './BuildBase.css';
import './BuildDishes.css';

const BuildBase = () => {
  const navigate = useNavigate();
  const {
    selectedBase,
    setSelectedBase,
    extraRotis,
    setExtraRotis,
    setCurrentStep,
    BASE_PRICE,
    EXTRA_ROTI_PRICE,
    calculateSubtotal
  } = useMealBuilder();

  useEffect(() => {
    setCurrentStep(2);
  }, []);

  const baseOptions = [
    {
      id: 'roti',
      icon: '🫓',
      title: 'Roti Only',
      description: '5 Soft Rotis'
    },
    {
      id: 'roti+rice',
      icon: '🍛',
      title: 'Roti + Rice',
      description: '3 Rotis + Rice Bowl'
    },
    {
      id: 'rice',
      icon: '🍚',
      title: 'Rice Only',
      description: 'Generous Rice Bowl'
    }
  ];

  const handleNext = () => {
    navigate('/build/review');
  };

  return (
    <div className="user-build-page user-animate-fadeIn">
      <div className="user-build-container">
        <ProgressSteps steps={4} currentStep={1} />

        <div className="user-build-header">
          <h1 className="user-build-title">Choose Your Base</h1>
          <p className="user-build-subtitle">
            Select your preferred base for the thali
          </p>
        </div>

        <div className="user-base-grid">
          {baseOptions.map((option) => (
            <div
              key={option.id}
              className={`user-base-card ${selectedBase === option.id ? 'selected' : ''} user-animate-scaleIn`}
              onClick={() => setSelectedBase(option.id)}
            >
              <div className="user-base-card-check">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div className="user-base-card-icon">{option.icon}</div>
              <h3 className="user-base-card-title">{option.title}</h3>
              <p className="user-base-card-desc">{option.description}</p>
            </div>
          ))}
        </div>

        <div className="user-extra-section user-animate-slideUp">
          <div className="user-extra-header">
            <h3 className="user-extra-title">Add Extra Rotis</h3>
          </div>
          <div className="user-extra-content">
            <div className="user-extra-info">
              <div className="user-extra-label">Price per Roti</div>
              <div className="user-extra-price">₹{EXTRA_ROTI_PRICE}</div>
              <div className="user-extra-limit">Maximum 3 extra rotis</div>
            </div>
            <QuantitySelector
              value={extraRotis}
              onChange={setExtraRotis}
              min={0}
              max={3}
            />
          </div>
        </div>

        <div className="user-price-preview user-animate-slideUp">
          <div className="user-price-preview-title">Current Price</div>
          <div className="user-price-preview-amount">₹{calculateSubtotal()}</div>
          <div className="user-price-preview-label">Per Thali (before tax & delivery)</div>
        </div>
      </div>

      <div className="user-build-footer">
        <div className="user-build-footer-content">
          <div className="user-build-footer-info">
            <div className="user-build-footer-label">Base Selection</div>
            <div className="user-build-footer-selection">
              {baseOptions.find(o => o.id === selectedBase)?.title}
              {extraRotis > 0 && ` + ${extraRotis} Extra Roti${extraRotis > 1 ? 's' : ''}`}
            </div>
          </div>
          <div className="user-build-footer-actions">
            <button
              className="user-build-next-btn"
              onClick={handleNext}
            >
              Next: Review Order
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildBase;
