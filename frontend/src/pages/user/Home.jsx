import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../services/api';
import { LoadingSpinner } from '../../components/UI';
import './Home.css';

const Home = () => {
  const [lunchMenu, setLunchMenu] = useState(null);
  const [dinnerMenu, setDinnerMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const [lunchResponse, dinnerResponse] = await Promise.all([
        userAPI.getLunchMenu(),
        userAPI.getDinnerMenu()
      ]);
      
      setLunchMenu(lunchResponse.data[0] || null);
      setDinnerMenu(dinnerResponse.data[0] || null);
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTime = () => {
    const hour = new Date().getHours();
    return hour;
  };

  const getMealStatus = (mealType) => {
    const hour = getCurrentTime();
    
    if (mealType === 'lunch') {
      return hour >= 11 && hour < 15 ? 'available' : 'coming-soon';
    } else {
      return hour >= 18 && hour < 22 ? 'available' : 'coming-soon';
    }
  };

  const renderMealCard = (menu, mealType, icon, iconClass) => {
    const status = getMealStatus(mealType);
    const isAvailable = status === 'available';
    
    return (
      <div className="meal-card">
        <div className="meal-header">
          <div className="meal-info">
            <div className={`meal-icon ${iconClass}`}>
              {icon}
            </div>
            <div className="meal-details">
              <h3>{mealType === 'lunch' ? 'Lunch' : 'Dinner'}</h3>
              <div className="meal-time">
                {mealType === 'lunch' ? '12:00 PM - 3:00 PM' : '7:00 PM - 10:00 PM'}
              </div>
            </div>
          </div>
          <div className={`meal-status ${isAvailable ? 'status-available' : 'status-coming-soon'}`}>
            {isAvailable ? 'Available Now' : 'Coming Soon'}
          </div>
        </div>

        <div className="meal-content">
          <p className="meal-description">
            {menu ? 
              `Fresh homemade ${mealType} with ${menu.listOfSabjis?.length || 0} delicious sabjis, served with your choice of base.` :
              `Today's ${mealType} menu will be available soon. Check back later for fresh homemade meals.`
            }
          </p>

          {menu && menu.listOfSabjis && (
            <div className="sabjis-preview">
              {menu.listOfSabjis.slice(0, 4).map((sabji, index) => (
                <span 
                  key={index} 
                  className={`sabji-tag ${sabji.isSpecial ? 'special' : ''}`}
                >
                  {sabji.name}
                </span>
              ))}
              {menu.listOfSabjis.length > 4 && (
                <span className="sabji-tag">+{menu.listOfSabjis.length - 4} more</span>
              )}
            </div>
          )}

          <div className="meal-price">
            <div>
              <div className="price-label">Starting from</div>
              <div className="price-value">₹{menu?.basePrice || 120}</div>
              <div className="price-includes">Includes raita & salad</div>
            </div>
          </div>
        </div>

        <div className="meal-actions">
          {menu && isAvailable ? (
            <Link 
              to={`/user/meal-builder?type=${mealType}`}
              className="order-btn order-btn-primary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Order Now
            </Link>
          ) : (
            <button 
              className="order-btn order-btn-secondary" 
              disabled
            >
              {menu ? 'Not Available' : 'Menu Coming Soon'}
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-container">
          <LoadingSpinner size="lg" />
          <p className="loading-text">Loading today's fresh menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1 className="hero-title">
          Today's <span className="hero-highlight">Fresh Meals</span>
        </h1>
        <p className="hero-subtitle">
          Homemade, nutritious meals prepared with love and delivered fresh to your doorstep
        </p>
      </section>

      <section className="meal-sections">
        {renderMealCard(
          lunchMenu,
          'lunch',
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>,
          'lunch-icon'
        )}

        {renderMealCard(
          dinnerMenu,
          'dinner',
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>,
          'dinner-icon'
        )}
      </section>

      <section className="features-section">
        <h2 className="features-title">Why Choose SKFood?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon feature-icon-1">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h3 className="feature-title">Made with Love</h3>
            <p className="feature-description">
              Every meal is prepared with care using fresh ingredients and traditional recipes
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-icon-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 className="feature-title">Fast Delivery</h3>
            <p className="feature-description">
              Quick and reliable delivery to ensure your meal reaches you hot and fresh
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-icon-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            </div>
            <h3 className="feature-title">Quality Assured</h3>
            <p className="feature-description">
              Premium quality ingredients and hygienic preparation for your health and satisfaction
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;