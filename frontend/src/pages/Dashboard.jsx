import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { StatCard, Card, Badge, EmptyState, LoadingSpinner } from '../components/UI';
import '../components/UIComponents.css';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getAllOrders();
      const orders = response.data;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      });

      const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      const pendingOrders = orders.filter(order => order.status === 'Confirmed').length;

      setStats({
        todayOrders: todayOrders.length,
        todayRevenue: todayRevenue,
        pendingOrders: pendingOrders,
      });

      setRecentOrders(orders.slice(0, 8));
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
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

  const getStatusVariant = (status) => {
    if (status === 'Confirmed') return 'warning';
    if (status === 'on-the-way') return 'primary';
    if (status === 'delivered') return 'success';
    return 'default';
  };

  const getStatusLabel = (status) => {
    if (status === 'on-the-way') return 'On the Way';
    return status;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-text">
          <h1 className="dashboard-greeting">{getGreeting()}!</h1>
          <p className="dashboard-subtitle">Here's what's happening with your restaurant today</p>
        </div>
        <Link to="/admin/publish-menu" className="btn btn-primary btn-lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Publish Menu
        </Link>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
          }
          label="Today's Orders"
          value={loading ? '...' : stats.todayOrders}
          trend="up"
          trendValue="+12%"
          loading={loading}
          gradient="accent"
        />

        <StatCard
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          }
          label="Today's Revenue"
          value={loading ? '...' : `₹${stats.todayRevenue}`}
          trend="up"
          trendValue="+8%"
          loading={loading}
          gradient="success"
        />

        <StatCard
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          }
          label="Pending Orders"
          value={loading ? '...' : stats.pendingOrders}
          loading={loading}
          gradient="warning"
        />
      </div>

      <div className="quick-actions">
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
        </div>
        <div className="action-cards">
          <Link to="/admin/publish-menu" className="action-card">
            <div className="action-card-icon action-icon-accent">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
            <div className="action-card-content">
              <h3 className="action-card-title">Publish Menu</h3>
              <p className="action-card-description">Create or update lunch & dinner menu</p>
            </div>
            <svg className="action-card-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>

          <Link to="/admin/orders" className="action-card">
            <div className="action-card-icon action-icon-success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </div>
            <div className="action-card-content">
              <h3 className="action-card-title">Manage Orders</h3>
              <p className="action-card-description">View and update order status</p>
            </div>
            <svg className="action-card-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>
        </div>
      </div>

      <div className="recent-orders-section">
        <div className="section-header">
          <h2 className="section-title">Recent Orders</h2>
          <Link to="/admin/orders" className="view-all-link">
            View all
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="loading-container">
            <LoadingSpinner size="lg" />
            <p className="loading-text">Loading orders...</p>
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="orders-grid">
            {recentOrders.map((order) => (
              <Card key={order._id} className="order-card" hover>
                <div className="order-card-header">
                  <div className="order-id">
                    <span className="order-label">Order</span>
                    <span className="order-number">#{order._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <Badge variant={getStatusVariant(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>

                <div className="order-card-details">
                  <div className="order-detail-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>

                  <div className="order-detail-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>Qty: {order.quantity}</span>
                  </div>
                </div>

                {order.sabjisSelected && order.sabjisSelected.length > 0 && (
                  <div className="order-items">
                    {order.sabjisSelected.slice(0, 2).map((item, idx) => (
                      <span key={idx} className="order-item">{item}</span>
                    ))}
                    {order.sabjisSelected.length > 2 && (
                      <span className="order-item-more">+{order.sabjisSelected.length - 2} more</span>
                    )}
                  </div>
                )}

                <div className="order-card-footer">
                  <span className="order-price">₹{order.totalPrice}</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            }
            title="No orders yet"
            description="Orders will appear here once customers start placing them"
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
