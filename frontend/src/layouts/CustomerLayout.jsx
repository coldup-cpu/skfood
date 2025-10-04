import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI';
import '../components/CustomerTheme.css';
import './CustomerLayout.css';

const CustomerLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="customer-layout">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Header */}
      <header className="customer-header">
        <div className="header-container">
          <Link to="/" className="brand-link" onClick={closeMobileMenu}>
            <div className="brand-logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            <span className="brand-name">SKFood</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/meal-builder" 
              className={`nav-link ${isActive('/meal-builder') ? 'active' : ''}`}
            >
              Order Now
            </Link>
            {isAuthenticated && (
              <Link 
                to="/my-orders" 
                className={`nav-link ${isActive('/my-orders') ? 'active' : ''}`}
              >
                My Orders
              </Link>
            )}
          </nav>

          {/* Desktop User Menu */}
          <div className="desktop-user-menu">
            {isAuthenticated ? (
              <div className="user-dropdown">
                <button className="user-button">
                  <img 
                    src={user?.picture || 'https://static.vecteezy.com/system/resources/thumbnails/048/926/084/small_2x/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-illustration-vector.jpg'} 
                    alt={user?.name || 'User'} 
                    className="user-avatar"
                  />
                  <span className="user-name">{user?.name}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div className="dropdown-menu">
                  <Link to="/my-orders" className="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                    My Orders
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="secondary" 
                  size="sm"
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/signup" 
                  className="btn-primary-customer" 
                  size="sm"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-content">
            <Link 
              to="/" 
              className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Home
            </Link>
            <Link 
              to="/meal-builder" 
              className={`mobile-nav-link ${isActive('/meal-builder') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Order Now
            </Link>
            {isAuthenticated && (
              <Link 
                to="/my-orders" 
                className={`mobile-nav-link ${isActive('/my-orders') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                My Orders
              </Link>
            )}
            
            <div className="mobile-nav-divider"></div>
            
            {isAuthenticated ? (
              <>
                <div className="mobile-user-info">
                  <img 
                    src={user?.picture || 'https://static.vecteezy.com/system/resources/thumbnails/048/926/084/small_2x/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-illustration-vector.jpg'} 
                    alt={user?.name || 'User'} 
                    className="mobile-user-avatar"
                  />
                  <span className="mobile-user-name">{user?.name}</span>
                </div>
                <button onClick={handleLogout} className="mobile-nav-link logout">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <div className="mobile-auth-buttons">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="secondary" 
                  onClick={closeMobileMenu}
                  style={{ width: '100%' }}
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/signup" 
                  className="btn-primary-customer" 
                  onClick={closeMobileMenu}
                  style={{ width: '100%' }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="customer-footer">
        <div className="footer-container">
          <div className="footer-section">
            <div className="footer-brand">
              <div className="footer-logo">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <span className="footer-brand-name">SKFood</span>
            </div>
            <p className="footer-description">
              Fresh, homemade thalis delivered to your doorstep. Quality food, affordable prices.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-title">Quick Links</h4>
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/meal-builder" className="footer-link">Order Now</Link>
              {isAuthenticated && (
                <Link to="/my-orders" className="footer-link">My Orders</Link>
              )}
            </div>
            
            <div className="footer-column">
              <h4 className="footer-title">Support</h4>
              <a href="#" className="footer-link">Help Center</a>
              <a href="#" className="footer-link">Contact Us</a>
              <a href="#" className="footer-link">Track Order</a>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-title">Legal</h4>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Refund Policy</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 SKFood. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;