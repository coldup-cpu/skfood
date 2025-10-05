import { useNavigate } from 'react-router-dom';
import { useMealBuilder } from '../../contexts/MealBuilderContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { setMealType, setCurrentStep } = useMealBuilder();

  const handleBuildThali = (type) => {
    setMealType(type);
    setCurrentStep(1);
    navigate('/build/dishes');
  };

  return (
    <div className="user-home">
      <section className="user-hero user-animate-fadeIn">
        <div className="user-hero-content">
          <div className="user-hero-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Premium Quality Food
          </div>
          <h1 className="user-hero-title">Delicious Thali Meals, Delivered Fresh</h1>
          <p className="user-hero-subtitle">
            Customize your perfect thali with your choice of dishes, base, and extras. Made fresh daily for students.
          </p>
          <div className="user-hero-price">
            <span className="user-hero-price-label">Starting at</span>
            <span className="user-hero-price-amount">₹120</span>
          </div>
          <button className="user-hero-cta" onClick={() => handleBuildThali('lunch')}>
            <span>Build Your Thali</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </section>

      <div className="user-container">
        <div className="user-section-header user-animate-slideUp">
          <h2 className="user-section-title">Choose Your Meal Time</h2>
          <p className="user-section-subtitle">
            Select your preferred meal time and start building your perfect thali
          </p>
        </div>

        <div className="user-timing-grid">
          <div className="user-timing-card user-animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <div className="user-timing-card-icon">🌅</div>
            <h3 className="user-timing-card-title">Lunch</h3>
            <p className="user-timing-card-time">Available: 12:00 PM - 3:00 PM</p>
            <button
              className="user-timing-card-btn"
              onClick={() => handleBuildThali('lunch')}
            >
              Order Lunch
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <div className="user-timing-card user-animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <div className="user-timing-card-icon">🌙</div>
            <h3 className="user-timing-card-title">Dinner</h3>
            <p className="user-timing-card-time">Available: 7:00 PM - 10:00 PM</p>
            <button
              className="user-timing-card-btn"
              onClick={() => handleBuildThali('dinner')}
            >
              Order Dinner
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <div className="user-section-header user-animate-slideUp">
          <h2 className="user-section-title">Why Choose SKFood?</h2>
          <p className="user-section-subtitle">
            We're committed to delivering quality meals with exceptional service
          </p>
        </div>

        <div className="user-features-grid">
          <div className="user-feature-card user-animate-scaleIn" style={{ animationDelay: '0.1s' }}>
            <div className="user-feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 className="user-feature-title">Fast Delivery</h3>
            <p className="user-feature-desc">
              Get your meal delivered hot and fresh in 30-40 minutes
            </p>
          </div>

          <div className="user-feature-card user-animate-scaleIn" style={{ animationDelay: '0.2s' }}>
            <div className="user-feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className="user-feature-title">Fresh Ingredients</h3>
            <p className="user-feature-desc">
              All meals prepared with fresh, quality ingredients daily
            </p>
          </div>

          <div className="user-feature-card user-animate-scaleIn" style={{ animationDelay: '0.3s' }}>
            <div className="user-feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="user-feature-title">Student Friendly</h3>
            <p className="user-feature-desc">
              Affordable pricing with bulk order discounts for students
            </p>
          </div>

          <div className="user-feature-card user-animate-scaleIn" style={{ animationDelay: '0.4s' }}>
            <div className="user-feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
            <h3 className="user-feature-title">Secure Payment</h3>
            <p className="user-feature-desc">
              Multiple payment options with secure checkout via Razorpay
            </p>
          </div>
        </div>

        <div className="user-login-banner user-animate-scaleIn">
          <div className="user-login-banner-content">
            <h3 className="user-login-banner-title">Save time with an account</h3>
            <p className="user-login-banner-desc">
              Sign in to save addresses, track orders, and checkout faster
            </p>
            <button className="user-login-banner-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Sign In or Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
