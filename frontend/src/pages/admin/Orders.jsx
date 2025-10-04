import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Card, Badge, Button, Tabs, EmptyState, LoadingSpinner, Input } from '../../components/UI';
import '../../components/UIComponents.css';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [verifyingOrderId, setVerifyingOrderId] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [copiedOTP, setCopiedOTP] = useState(null);

  // Dummy order for design purposes
  const dummyOrder = {
    _id: 'dummy123456789',
    userId: 'user123',
    menuId: 'menu123',
    sabjisSelected: ['Aloo Gobi', 'Dal Tadka'],
    base: 'roti',
    extraRoti: 2,
    isSpecial: true,
    quantity: 2,
    totalPrice: 180,
    tipMoney: 20,
    address: {
      label: 'Hostel Room',
      address: 'Room 204, Boys Hostel, University Campus, New Delhi - 110001',
      lat: 28.6139,
      lng: 77.2090
    },
    otp: '1234',
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [activeTab, orders]);

  const fetchOrders = async () => {
    try {
      const response = await adminAPI.getAllOrders();
      // Add dummy order for design purposes
      setOrders([dummyOrder, ...response.data]);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // If API fails, at least show dummy order
      setOrders([dummyOrder]);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (activeTab === 'all') {
      setFilteredOrders(orders);
    } else if (activeTab === 'confirmed') {
      setFilteredOrders(orders.filter(order => order.status === 'Confirmed'));
    } else if (activeTab === 'on-the-way') {
      setFilteredOrders(orders.filter(order => order.status === 'on-the-way'));
    } else if (activeTab === 'delivered') {
      setFilteredOrders(orders.filter(order => order.status === 'delivered'));
    }
  };

  const copyOTP = (otp, orderId) => {
    navigator.clipboard.writeText(otp);
    setCopiedOTP(orderId);
    setTimeout(() => setCopiedOTP(null), 2000);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (newStatus === 'delivered') {
      setVerifyingOrderId(orderId);
      return;
    }

    try {
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const verifyAndDeliver = (order) => {
    if (otpInput === order.otp) {
      setOrders(orders.map(o =>
        o._id === order._id ? { ...o, status: 'delivered' } : o
      ));
      setVerifyingOrderId(null);
      setOtpInput('');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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

  const tabs = [
    {
      value: 'all',
      label: 'All Orders',
      badge: orders.length
    },
    {
      value: 'confirmed',
      label: 'Confirmed',
      badge: orders.filter(o => o.status === 'Confirmed').length
    },
    {
      value: 'on-the-way',
      label: 'On the Way',
      badge: orders.filter(o => o.status === 'on-the-way').length
    },
    {
      value: 'delivered',
      label: 'Delivered',
      badge: orders.filter(o => o.status === 'delivered').length
    }
  ];

  if (loading) {
    return (
      <div className="orders-page">
        <div className="loading-container">
          <LoadingSpinner size="lg" />
          <p className="loading-text">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h2 className="orders-title">Order Management</h2>
          <p className="orders-subtitle">Track and manage all orders in one place</p>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          }
          title="No orders found"
          description={`No ${activeTab === 'all' ? '' : activeTab + ' '}orders at the moment`}
        />
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order) => (
            <Card key={order._id} className="order-card">
              <div className="order-card-header">
                <div className="order-id-section">
                  <span className="order-label">Order ID</span>
                  <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                </div>
                <Badge variant={getStatusVariant(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
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
                  <span className="detail-label">Quantity:</span>
                  <span className="detail-value">{order.quantity}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Base:</span>
                  <span className="detail-value">{order.base === 'roti' ? '5 Roti' : '3 Roti + Rice'}</span>
                </div>
                {order.extraRoti > 0 && (
                  <div className="detail-row">
                    <span className="detail-label">Extra Roti:</span>
                    <span className="detail-value">{order.extraRoti}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Sabjis:</span>
                  <span className="detail-value">{order.sabjisSelected.join(', ')}</span>
                </div>
                {order.isSpecial && (
                  <Badge 
                    variant="warning" 
                    size="sm" 
                    className="special-badge-inline"
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    }
                  >
                    Special
                  </Badge>
                )}
              </div>

              <div className="order-address">
                <div className="address-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="address-details">
                  <span className="address-label">{order.address.label}</span>
                  <span className="address-text">{order.address.address}</span>
                </div>
              </div>

              <div className="order-price-row">
                <span className="price-label">Total Amount</span>
                <span className="price-value">₹{order.totalPrice}</span>
              </div>

              <div className="otp-section">
                <div className="otp-display">
                  <span className="otp-label">Delivery OTP:</span>
                  <span className="otp-code">{order.otp}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyOTP(order.otp, order._id)}
                    icon={
                      copiedOTP === order._id ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      )
                    }
                  >
                    {copiedOTP === order._id ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>

              {verifyingOrderId === order._id ? (
                <div className="verify-otp-section">
                  <Input
                    type="text"
                    placeholder="Enter OTP to verify"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="otp-input"
                    maxLength="4"
                  />
                  <div className="verify-actions">
                    <Button
                      variant="success"
                      onClick={() => verifyAndDeliver(order)}
                    >
                      Verify & Mark Delivered
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setVerifyingOrderId(null);
                        setOtpInput('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="order-actions">
                  {order.status === 'Confirmed' && (
                    <Button
                      variant="primary"
                      onClick={() => updateOrderStatus(order._id, 'on-the-way')}
                    >
                      Mark On the Way
                    </Button>
                  )}
                  {order.status === 'on-the-way' && (
                    <Button
                      variant="success"
                      onClick={() => updateOrderStatus(order._id, 'delivered')}
                    >
                      Mark Delivered
                    </Button>
                  )}
                  {order.status === 'delivered' && (
                    <div className="delivered-badge">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      Order Delivered
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;