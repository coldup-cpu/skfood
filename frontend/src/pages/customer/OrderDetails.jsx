import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '../../components/UI';
import { userAPI } from '../../services/api';
import '../../components/CustomerTheme.css';
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getOrderById(orderId);
      setOrder(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      preparing: {
        label: 'Preparing Your Meal',
        color: '#F59E0B',
        icon: '👨‍🍳',
        description: 'Our chefs are preparing your delicious thali',
      },
      ontheway: {
        label: 'On the Way',
        color: '#3B82F6',
        icon: '🚗',
        description: 'Your order is being delivered',
      },
      delivered: {
        label: 'Delivered',
        color: '#10B981',
        icon: '✅',
        description: 'Your order has been delivered',
      },
      cancelled: {
        label: 'Cancelled',
        color: '#EF4444',
        icon: '❌',
        description: 'This order was cancelled',
      },
    };

    return statusMap[status] || statusMap.preparing;
  };

  const getTrackingSteps = (currentStatus) => {
    const steps = [
      { id: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
      { id: 'ontheway', label: 'On the Way', icon: '🚗' },
      { id: 'delivered', label: 'Delivered', icon: '✅' },
    ];

    const statusOrder = ['preparing', 'ontheway', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="order-details loading">
        <div className="loading-spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-details error">
        <Card className="error-card">
          <div className="error-icon">❌</div>
          <h2>Order Not Found</h2>
          <p>{error || "We couldn't find the order you're looking for."}</p>
          <div className="error-actions">
            <Button
              className="btn-primary-customer"
              onClick={() => navigate('/my-orders')}
            >
              View All Orders
            </Button>
            <Button variant="secondary" onClick={fetchOrderDetails}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const trackingSteps = getTrackingSteps(order.status);

  return (
    <div className="order-details">
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate('/my-orders')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div>
          <h1 className="page-title">Order Details</h1>
          <p className="order-id-subtitle">
            Order #{order._id?.slice(-8) || orderId.slice(-8)}
          </p>
        </div>
      </div>

      <div className="details-content">
        <Card className="status-card" style={{ borderColor: statusInfo.color }}>
          <div className="status-hero" style={{ background: `${statusInfo.color}15` }}>
            <div className="status-icon-large" style={{ color: statusInfo.color }}>
              {statusInfo.icon}
            </div>
            <h2 style={{ color: statusInfo.color }}>{statusInfo.label}</h2>
            <p>{statusInfo.description}</p>
          </div>

          {order.status !== 'cancelled' && (
            <div className="tracking-timeline">
              {trackingSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`timeline-step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}
                >
                  <div className="timeline-marker">
                    <div className="timeline-icon">{step.icon}</div>
                    {index < trackingSteps.length - 1 && (
                      <div className="timeline-line"></div>
                    )}
                  </div>
                  <div className="timeline-content">
                    <span className="timeline-label">{step.label}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {order.status === 'delivered' && (
            <div className="delivery-time-info">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>
                Delivered on {formatDate(order.deliveredAt || order.updatedAt)}
              </span>
            </div>
          )}
        </Card>

        <Card className="meal-details-card">
          <h3 className="card-title">Your Meal</h3>

          <div className="meal-items-grid">
            {order.sabjisSelected?.map((sabji, index) => (
              <div key={index} className="meal-item">
                <span className="meal-emoji">🥘</span>
                <span className="meal-name">{sabji}</span>
              </div>
            ))}

            <div className="meal-item">
              <span className="meal-emoji">
                {order.base === 'rice' ? '🍚' : '🫓'}
              </span>
              <span className="meal-name">{order.base}</span>
            </div>

            {order.extraRoti > 0 && (
              <div className="meal-item">
                <span className="meal-emoji">➕</span>
                <span className="meal-name">{order.extraRoti} Extra Roti</span>
              </div>
            )}

            <div className="meal-item complimentary">
              <span className="meal-emoji">🥗</span>
              <span className="meal-name">Raita & Salad</span>
              <Badge size="sm" variant="success">Free</Badge>
            </div>
          </div>
        </Card>

        <Card className="price-details-card">
          <h3 className="card-title">Price Breakdown</h3>

          <div className="price-rows">
            <div className="price-row">
              <span className="price-label">Quantity</span>
              <span className="price-value">{order.quantity} Thali(s)</span>
            </div>

            {order.isSpecial && (
              <div className="price-row">
                <span className="price-label">Special Sabji</span>
                <span className="price-value">+₹20</span>
              </div>
            )}

            {order.extraRoti > 0 && (
              <div className="price-row">
                <span className="price-label">Extra Roti ({order.extraRoti})</span>
                <span className="price-value">+₹{order.extraRoti * 5}</span>
              </div>
            )}

            <div className="price-divider"></div>

            <div className="price-row total">
              <span className="price-label">Total Amount</span>
              <span className="price-value">{formatPrice(order.totalPrice)}</span>
            </div>

            <div className="payment-method-info">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              <span>Paid via {order.paymentMethod || 'Online'}</span>
            </div>
          </div>
        </Card>

        <Card className="delivery-details-card">
          <h3 className="card-title">Delivery Information</h3>

          <div className="delivery-info-rows">
            <div className="info-row">
              <div className="info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div>
                <p className="info-label">Contact Name</p>
                <p className="info-value">{order.contactName}</p>
              </div>
            </div>

            <div className="info-row">
              <div className="info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div>
                <p className="info-label">Phone Number</p>
                <p className="info-value">{order.contactPhone}</p>
              </div>
            </div>

            <div className="info-row">
              <div className="info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <p className="info-label">Delivery Address</p>
                <p className="info-value">{order.deliveryAddress}</p>
              </div>
            </div>

            {order.specialInstructions && (
              <div className="info-row">
                <div className="info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div>
                  <p className="info-label">Special Instructions</p>
                  <p className="info-value">{order.specialInstructions}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="order-metadata-card">
          <div className="metadata-row">
            <span className="metadata-label">Order Placed</span>
            <span className="metadata-value">
              {formatDate(order.createdAt || order.orderDate)}
            </span>
          </div>
          {order.updatedAt && order.updatedAt !== order.createdAt && (
            <div className="metadata-row">
              <span className="metadata-label">Last Updated</span>
              <span className="metadata-value">{formatDate(order.updatedAt)}</span>
            </div>
          )}
        </Card>

        <div className="action-buttons">
          {order.status === 'delivered' && (
            <Button
              className="btn-primary-customer"
              onClick={() => navigate('/meal-builder')}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              }
            >
              Reorder This Meal
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={() => navigate('/my-orders')}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            }
          >
            Back to Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
