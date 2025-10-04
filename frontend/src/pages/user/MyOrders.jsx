import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../services/api';
import { LoadingSpinner } from '../../components/UI';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [copiedOTP, setCopiedOTP] = useState(null);

  // Mock orders for demonstration
  const mockOrders = [
    {
      _id: 'order123456789',
      mealType: 'lunch',
      selectedSabjis: ['Aloo Gobi', 'Dal Tadka'],
      base: 'roti',
      extraRoti: 2,
      quantity: 2,
      totalPrice: 180,
      isSpecial: true,
      deliveryAddress: {
        label: 'Hostel Room',
        address: 'Room 204, Boys Hostel, University Campus, New Delhi - 110001'
      },
      otp: '1234',
      status: 'Confirmed',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    },
    {
      _id: 'order987654321',
      mealType: 'dinner',
      selectedSabjis: ['Paneer Butter Masala', 'Mixed Vegetables'],
      base: 'roti+rice',
      extraRoti: 0,
      quantity: 1,
      totalPrice: 140,
      isSpecial: true,
      deliveryAddress: {
        label: 'PG',
        address: 'Flat 3B, Sunrise PG, Sector 15, Noida - 201301'
      },
      otp: '5678',
      status: 'on-the-way',
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString() // 45 minutes ago
    },
    {
      _id: 'order456789123',
      mealType: 'lunch',
      selectedSabjis: ['Rajma', 'Bhindi Masala'],
      base: 'roti',
      extraRoti: 1,
      quantity: 1,
      totalPrice: 130,
      isSpecial: false,
      deliveryAddress: {
        label: 'Home',
        address: 'A-123, Sector 10, Gurgaon - 122001'
      },
      otp: '9012',
      status: 'delivered',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [activeTab, orders]);

  const fetchOrders = async () => {
    try {
      // For now, using mock data. In real app, this would be:
      // const response = await userAPI.getMyOrders();
      // setOrders(response.data);
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Fallback to mock data
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (activeTab === 'all') {
      setFilteredOrders(orders);
    } else if (activeTab === 'active') {
      setFilteredOrders(orders.filter(order => 
        order.status === 'Confirmed' || order.status === 'on-the-way'
      ));
    } else if (activeTab === 'delivered') {
      setFilteredOrders(orders.filter(order => order.status === 'delivered'));
    }
  };

  const copyOTP = (otp, orderId) => {
    navigator.clipboard.writeText(otp);
    setCopiedOTP(orderId);
    setTimeout(() => setCopiedOTP(null), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status) => {
    if (status === 'on-the-way') return 'On the Way';
    return status;
  };

  const getStatusClass = (status) => {
    if (status === 'Confirmed') return 'status-confirmed';
    if (status === 'on-the-way') return 'status-on-the-way';
    if (status === 'delivered') return 'status-delivered';
    return '';
  };

  const tabs = [
    {
      id: 'all',
      label: 'All Orders',
      count: orders.length,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
      )
    },
    {
      id: 'active',
      label: 'Active',
      count: orders.filter(o => o.status === 'Confirmed' || o.status === 'on-the-way').length,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    {
      id: 'delivered',
      label: 'Delivered',
      count: orders.filter(o => o.status === 'delivered').length,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      )
    }
  ];

  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="loading-container">
          <LoadingSpinner size="lg" />
          <p className="loading-text">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="orders-header">
        <h1 className="orders-title">My Orders</h1>
        <p className="orders-subtitle">Track your delicious meals and order history</p>
      </div>

      <div className="orders-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 className="empty-title">
            {activeTab === 'all' ? 'No orders yet' : 
             activeTab === 'active' ? 'No active orders' : 'No delivered orders'}
          </h2>
          <p className="empty-description">
            {activeTab === 'all' 
              ? "You haven't placed any orders yet. Start by exploring our fresh daily menu!"
              : activeTab === 'active'
              ? "You don't have any active orders right now. Place a new order to see it here."
              : "You don't have any delivered orders yet. Your completed orders will appear here."
            }
          </p>
          {activeTab === 'all' && (
            <Link to="/user" className="empty-action">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Order Now
            </Link>
          )}
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order) => (
            <div key={order._id} className={`order-card ${getStatusClass(order.status)}`}>
              <div className="order-header">
                <div className="order-id-section">
                  <span className="order-label">Order ID</span>
                  <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                </div>
                <div className={`order-status ${getStatusClass(order.status)}`}>
                  {getStatusLabel(order.status)}
                </div>
              </div>

              <div className="order-time">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {formatDate(order.createdAt)}
              </div>

              <div className="order-details">
                <div className="detail-row">
                  <span className="detail-label">Meal Type:</span>
                  <span className="detail-value">{order.mealType}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Quantity:</span>
                  <span className="detail-value">{order.quantity} Thali{order.quantity > 1 ? 's' : ''}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Base:</span>
                  <span className="detail-value">
                    {order.base === 'roti' ? '5 Rotis' : '3 Rotis + Rice'}
                    {order.extraRoti > 0 && ` + ${order.extraRoti} Extra`}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Sabjis:</span>
                  <div className="sabjis-list">
                    {order.selectedSabjis.map((sabji, index) => (
                      <span 
                        key={index} 
                        className={`sabji-tag ${order.isSpecial ? 'special' : ''}`}
                      >
                        {sabji}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="order-address">
                <div className="address-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {order.deliveryAddress.label}
                </div>
                <div className="address-text">{order.deliveryAddress.address}</div>
              </div>

              {(order.status === 'Confirmed' || order.status === 'on-the-way') && (
                <div className="otp-display">
                  <div className="otp-info">
                    <span className="otp-label">Delivery OTP</span>
                    <span className="otp-code">{order.otp}</span>
                  </div>
                  <button
                    className="copy-btn"
                    onClick={() => copyOTP(order.otp, order._id)}
                  >
                    {copiedOTP === order._id ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}

              <div className="order-footer">
                <div className="order-total">₹{order.totalPrice}</div>
                <div className="order-actions">
                  {order.status !== 'delivered' && (
                    <button className="action-btn btn-track">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      Track
                    </button>
                  )}
                  <button className="action-btn btn-reorder">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 4h22l-1 7H2z"></path>
                      <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                      <path d="M17 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                    </svg>
                    Reorder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;