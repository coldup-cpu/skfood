import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../services/api';
import { Button, Card, Badge } from '../../components/UI';
import './Home.css';

const Home = () => {
  const [todaysSpecials, setTodaysSpecials] = useState([]);
  const [currentMealType, setCurrentMealType] = useState('lunch');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Determine current meal type based on time
    const hour = new Date().getHours();
    const mealType = hour >= 19 || hour < 12 ? 'dinner' : 'lunch';
    setCurrentMealType(mealType);
    
    fetchTodaysSpecials(mealType);
  }, []);

  const fetchTodaysSpecials = async (mealType) => {
    try {
      const response = mealType === 'lunch' 
        ? await userAPI.getLunchMenu() 
        : await userAPI.getDinnerMenu();
      
      if (response.data && response.data.length > 0) {
        const menu = response.data[0];
        const specials = menu.listOfSabjis?.filter(sabji => sabji.isSpecial).slice(0, 4) || [];
        setTodaysSpecials(specials);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      // Set dummy data for demo
      setTodaysSpecials([
        { name: 'Paneer Butter Masala', imageUrl: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg', isSpecial: true },
        { name: 'Dal Makhani', imageUrl: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg', isSpecial: true },
        { name: 'Aloo Gobi', imageUrl: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg', isSpecial: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTimeSlot = () => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 15) return { type: 'lunch', label: 'Lunch Time', time: '12-3 PM', active: true };
    if (hour >= 19 && hour < 22) return { type: 'dinner', label: 'Dinner Time', time: '7-10 PM', active: true };
    if (hour < 12) return { type: 'lunch', label: 'Lunch', time: '12-3 PM', active: false };
    return { type: 'dinner', label: 'Dinner', time: '7-10 PM', active: false };
  };

  const timeSlot = getCurrentTimeSlot();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Fresh Homemade
                <span className="hero-highlight"> Thalis</span>
                <br />
                Delivered Hot
              </h1>
              <p className="hero-subtitle">
                Choose your favorite sabjis, customize your thali, and enjoy restaurant-quality food at home. Starting from just ₹120.
              </p>
              
              <div className="hero-timing">
                <div className={`timing-badge ${timeSlot.active ? 'active' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{timeSlot.label}: {timeSlot.time}</span>
                  {timeSlot.active && <span className="live-dot"></span>}
                </div>
              </div>

              <div className="hero-actions">
                <Button 
                  as={Link} 
                  to="/meal-builder" 
                  className="btn-primary-customer" 
                  size="lg"
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                  }
                >
                  Build Your Thali
                </Button>
                <div className="hero-price">
                  <span className="price-label">Starting from</span>
                  <span className="price-value">₹120</span>
                </div>
              </div>
            </div>
            
            <div className="hero-image">
              <div className="hero-image-container">
                <img 
                  src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg" 
                  alt="Delicious Indian Thali" 
                  className="hero-img"
                />
                <div className="hero-image-overlay">
                  <div className="floating-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    Fresh & Hot
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Specials */}
      <section className="specials-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Today's Special Sabjis</h2>
            <p className="section-subtitle">
              Handpicked premium dishes made with fresh ingredients
            </p>
          </div>

          {loading ? (
            <div className="specials-loading">
              <div className="loading-spinner"></div>
              <p>Loading today's specials...</p>
            </div>
          ) : (
            <div className="specials-grid">
              {todaysSpecials.map((special, index) => (
                <Card key={index} className="special-card">
                  <div className="special-image">
                    <img 
                      src={special.imageUrl || 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg'} 
                      alt={special.name}
                    />
                    <Badge className="badge-special">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      Special
                    </Badge>
                  </div>
                  <div className="special-content">
                    <h3 className="special-name">{special.name}</h3>
                    <p className="special-price">+₹20</p>
                  </div>
                </Card>
              ))}
              
              {todaysSpecials.length === 0 && (
                <div className="no-specials">
                  <p>No special sabjis available today</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Get your perfect thali in just 3 simple steps
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <div className="step-number">1</div>
              <h3 className="step-title">Choose Your Sabjis</h3>
              <p className="step-description">
                Select any 2 sabjis from our fresh daily menu. Add special items for extra flavor.
              </p>
            </div>

            <div className="step-card">
              <div className="step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <div className="step-number">2</div>
              <h3 className="step-title">Customize Your Base</h3>
              <p className="step-description">
                Pick your base - 5 rotis, 3 rotis + rice, or rice only. Add extra rotis if needed.
              </p>
            </div>

            <div className="step-card">
              <div className="step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="step-number">3</div>
              <h3 className="step-title">Get It Delivered</h3>
              <p className="step-description">
                Add your address, pay securely, and get fresh hot food delivered in 30-40 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Order?</h2>
            <p className="cta-subtitle">
              Build your perfect thali now and satisfy your cravings
            </p>
            <Button 
              as={Link} 
              to="/meal-builder" 
              className="btn-primary-customer" 
              size="lg"
            >
              Start Building Your Thali
            </Button>
          </div>
          <div className="cta-features">
            <div className="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Fresh Ingredients</span>
            </div>
            <div className="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>30-40 Min Delivery</span>
            </div>
            <div className="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Affordable Prices</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;