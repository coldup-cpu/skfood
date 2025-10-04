import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './UserLayout.css';

const UserLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount] = useState(0); // This would come from context/state management
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="user-layout">
      <header className="user-header">
        <div className="header-container">
          <NavLink to="/user" className="user-brand">
            <div className="brand-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            <div>
              <div className="brand-name">SKFood</div>
              <div className="brand-tagline">Fresh & Fast</div>
            </div>
          </NavLink>

          <nav className="header-nav">
            <div className="nav-links">
              <NavLink
                to="/user"
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                end
              >
                Home
              </NavLink>
              <NavLink
                to="/user/orders"
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                My Orders
              </NavLink>
            </div>

            <div className="header-actions">
              <button className="cart-button" aria-label="Shopping cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </button>

              <button
                className="mobile-menu-btn"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
          </nav>
        </div>

        <nav className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-links">
            <NavLink
              to="/user"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
              onClick={closeMobileMenu}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/user/orders"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
              onClick={closeMobileMenu}
            >
              My Orders
            </NavLink>
          </div>
        </nav>
      </header>

      <main className="main-content">
        <div className="content-container">
          <Outlet />
        </div>
      </main>

      <footer className="user-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>SKFood</h3>
              <p>Fresh, homemade meals delivered right to your doorstep. Made with love, served with care.</p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <div className="footer-links">
                <NavLink to="/user">Home</NavLink>
                <NavLink to="/user/orders">My Orders</NavLink>
              </div>
            </div>
            <div className="footer-section">
              <h3>Contact</h3>
              <div className="footer-links">
                <a href="tel:+919876543210">+91 98765 43210</a>
                <a href="mailto:hello@skfood.com">hello@skfood.com</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 SKFood. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;