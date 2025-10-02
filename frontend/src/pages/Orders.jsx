import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [verifyingOrderId, setVerifyingOrderId] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [copiedOTP, setCopiedOTP] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [activeTab, orders]);

  const fetchOrders = async () => {
    try {
      const response = await adminAPI.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'status-confirmed';
      case 'on-the-way':
        return 'status-on-the-way';
      case 'delivered':
        return 'status-delivered';
      default:
        return '';
    }
  };

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1 className="page-title">Order Management</h1>
        <p className="page-subtitle">Manage and track all orders</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Orders
          <span className="tab-badge">{orders.length}</span>
        </button>
        <button
          className={`tab ${activeTab === 'confirmed' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('confirmed')}
        >
          Confirmed
          <span className="tab-badge">{orders.filter(o => o.status === 'Confirmed').length}</span>
        </button>
        <button
          className={`tab ${activeTab === 'on-the-way' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('on-the-way')}
        >
          On the Way
          <span className="tab-badge">{orders.filter(o => o.status === 'on-the-way').length}</span>
        </button>
        <button
          className={`tab ${activeTab === 'delivered' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('delivered')}
        >
          Delivered
          <span className="tab-badge">{orders.filter(o => o.status === 'delivered').length}</span>
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3>No orders found</h3>
          <p>Orders will appear here once customers start placing them</p>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id-section">
                  <span className="order-label">Order ID</span>
                  <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                </div>
                <span className={`status-badge ${getStatusColor(order.status)}`}>
                  {order.status === 'on-the-way' ? 'On the Way' : order.status}
                </span>
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
                  <div className="special-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    Special Thali
                  </div>
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

              <div className="order-price">
                <span className="price-label">Total Amount</span>
                <span className="price-value">₹{order.totalPrice}</span>
              </div>

              <div className="otp-section">
                <div className="otp-display">
                  <span className="otp-label">Delivery OTP:</span>
                  <span className="otp-code">{order.otp}</span>
                  <button
                    className="copy-btn"
                    onClick={() => copyOTP(order.otp, order._id)}
                  >
                    {copiedOTP === order._id ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {verifyingOrderId === order._id ? (
                <div className="verify-otp">
                  <input
                    type="text"
                    placeholder="Enter OTP to verify"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="otp-input"
                    maxLength="4"
                  />
                  <div className="verify-actions">
                    <button
                      className="btn-verify"
                      onClick={() => verifyAndDeliver(order)}
                    >
                      Verify & Mark Delivered
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => {
                        setVerifyingOrderId(null);
                        setOtpInput('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="order-actions">
                  {order.status === 'Confirmed' && (
                    <button
                      className="btn-action btn-primary"
                      onClick={() => updateOrderStatus(order._id, 'on-the-way')}
                    >
                      Mark On the Way
                    </button>
                  )}
                  {order.status === 'on-the-way' && (
                    <button
                      className="btn-action btn-success"
                      onClick={() => updateOrderStatus(order._id, 'delivered')}
                    >
                      Mark Delivered
                    </button>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
