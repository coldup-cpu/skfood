import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '../../components/UI';
import { userAPI } from '../../services/api';
import '../../components/CustomerTheme.css';
import './MyOrders.css';

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [activeFilter, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllOrders();
      const ordersData = response.data.orders || response.data || [];
      setOrders(ordersData);
      setError('');
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (activeFilter === 'all') {
      setFilteredOrders(orders);
    } else if (activeFilter === 'active') {
      setFilteredOrders(
        orders.filter(
          (order) => order.status === 'preparing' || order.status === 'ontheway'
        )
      );
    } else if (activeFilter === 'delivered') {
      setFilteredOrders(orders.filter((order) => order.status === 'delivered'));
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      preparing: {
        label: 'Preparing',
        variant: 'warning',
        icon: '👨‍🍳',
      },
      ontheway: {
        label: 'On the way',
        variant: 'info',
        icon: '🚗',
      },
      delivered: {
        label: 'Delivered',
        variant: 'success',
        icon: '✅',
      },
      cancelled: {
        label: 'Cancelled',
        variant: 'danger',
        icon: '❌',
      },
    };

    return statusMap[status] || statusMap.preparing;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  if (loading) {
    return (
      <div className="my-orders loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <div className="orders-header">
        <div>
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">Track your meal orders</p>
        </div>
        <Button
          className="btn-primary-customer"
          onClick={() => navigate('/meal-builder')}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          }
        >
          New Order
        </Button>
      </div>

      <div className="orders-filters">
        <button
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Orders
          {orders.length > 0 && (
            <span className="filter-count">{orders.length}</span>
          )}
        </button>
        <button
          className={`filter-btn ${activeFilter === 'active' ? 'active' : ''}`}
          onClick={() => setActiveFilter('active')}
        >
          Active
          {orders.filter(
            (o) => o.status === 'preparing' || o.status === 'ontheway'
          ).length > 0 && (
            <span className="filter-count">
              {
                orders.filter(
                  (o) => o.status === 'preparing' || o.status === 'ontheway'
                ).length
              }
            </span>
          )}
        </button>
        <button
          className={`filter-btn ${activeFilter === 'delivered' ? 'active' : ''}`}
          onClick={() => setActiveFilter('delivered')}
        >
          Delivered
          {orders.filter((o) => o.status === 'delivered').length > 0 && (
            <span className="filter-count">
              {orders.filter((o) => o.status === 'delivered').length}
            </span>
          )}
        </button>
      </div>

      <div className="orders-content">
        {error && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
            <button onClick={fetchOrders}>Retry</button>
          </div>
        )}

        {filteredOrders.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <h3>No orders found</h3>
            <p>
              {activeFilter === 'all'
                ? "You haven't placed any orders yet"
                : `No ${activeFilter} orders`}
            </p>
            <Button
              className="btn-primary-customer"
              onClick={() => navigate('/meal-builder')}
            >
              Order Your First Meal
            </Button>
          </div>
        )}

        <div className="orders-list">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <Card
                key={order._id}
                className="order-card"
                onClick={() => navigate(`/order/${order._id}`)}
              >
                <div className="order-card-header">
                  <div className="order-id-section">
                    <span className="order-id">
                      #{order._id?.slice(-8) || 'N/A'}
                    </span>
                    <span className="order-date">
                      {formatDate(order.createdAt || order.orderDate)}
                    </span>
                  </div>
                  <Badge
                    variant={statusInfo.variant}
                    className="order-status-badge"
                  >
                    <span className="status-icon">{statusInfo.icon}</span>
                    {statusInfo.label}
                  </Badge>
                </div>

                <div className="order-card-body">
                  <div className="order-items">
                    <div className="order-item-preview">
                      <span className="item-emoji">🥘</span>
                      <span className="item-text">
                        {order.sabjisSelected?.join(', ') || 'Custom Thali'}
                      </span>
                    </div>
                    <div className="order-item-preview">
                      <span className="item-emoji">
                        {order.base === 'rice' ? '🍚' : '🫓'}
                      </span>
                      <span className="item-text">{order.base || 'Base'}</span>
                    </div>
                    {order.extraRoti > 0 && (
                      <div className="order-item-preview">
                        <span className="item-emoji">➕</span>
                        <span className="item-text">
                          {order.extraRoti} Extra Roti
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="order-meta">
                    <div className="meta-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>{order.quantity} Thali(s)</span>
                    </div>
                    <div className="meta-item price">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      <span>₹{order.totalPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="order-card-footer">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    View Details
                  </Button>
                  {order.status === 'delivered' && (
                    <Button
                      className="btn-primary-customer"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/meal-builder');
                      }}
                    >
                      Reorder
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
