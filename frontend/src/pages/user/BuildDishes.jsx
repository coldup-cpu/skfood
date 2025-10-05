import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMealBuilder } from '../../contexts/MealBuilderContext';
import { userAPI } from '../../services/api';
import { DishCard, ProgressSteps } from '../../components/user/UserComponents';
import './BuildDishes.css';

const BuildDishes = () => {
  const navigate = useNavigate();
  const { mealType, selectedDishes, selectDish, setCurrentStep } = useMealBuilder();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentStep(1);
    fetchDishes();
  }, [mealType]);

  const fetchDishes = async () => {
    try {
      setLoading(true);
      const response = mealType === 'lunch'
        ? await userAPI.getLunchMenu()
        : await userAPI.getDinnerMenu();

      if (response.data && response.data.listOfSabjis) {
        setDishes(response.data.listOfSabjis);
      }
    } catch (error) {
      console.error('Error fetching dishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (selectedDishes.length === 2) {
      navigate('/build/base');
    }
  };

  const isDishSelected = (dish) => {
    return selectedDishes.some(d => d.name === dish.name);
  };

  return (
    <div className="user-build-page user-animate-fadeIn">
      <div className="user-build-container">
        <ProgressSteps steps={4} currentStep={0} />

        <div className="user-build-header">
          <h1 className="user-build-title">Choose Your Dishes</h1>
          <p className="user-build-subtitle">
            Select exactly 2 dishes for your {mealType} thali
          </p>
          <div className="user-build-progress-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            {selectedDishes.length} of 2 selected
          </div>
        </div>

        {loading ? (
          <div className="user-loading">
            <div className="user-loading-spinner" />
            <p className="user-loading-text">Loading dishes...</p>
          </div>
        ) : dishes.length > 0 ? (
          <div className="user-dishes-grid">
            {dishes.map((dish, index) => (
              <DishCard
                key={index}
                dish={dish}
                selected={isDishSelected(dish)}
                onSelect={() => selectDish(dish)}
              />
            ))}
          </div>
        ) : (
          <div className="user-empty-state">
            <div className="user-empty-icon">🍽️</div>
            <h3 className="user-empty-title">No dishes available</h3>
            <p className="user-empty-desc">
              Please check back later or contact support
            </p>
          </div>
        )}
      </div>

      <div className="user-build-footer">
        <div className="user-build-footer-content">
          <div className="user-build-footer-info">
            <div className="user-build-footer-label">Selected Dishes</div>
            <div className="user-build-footer-selection">
              {selectedDishes.length === 0
                ? 'None selected'
                : selectedDishes.map(d => d.name).join(', ')}
            </div>
          </div>
          <div className="user-build-footer-actions">
            <button
              className="user-build-next-btn"
              onClick={handleNext}
              disabled={selectedDishes.length !== 2}
            >
              Next: Choose Base
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

export default BuildDishes;
