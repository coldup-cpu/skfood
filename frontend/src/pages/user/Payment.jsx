import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMealBuilder } from '../../contexts/MealBuilderContext';
import { Button, ProgressSteps } from '../../components/user/UserComponents';
import './BuildDishes.css';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const { calculateTotal } = useMealBuilder();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    { id: 'upi', label: 'UPI', icon: '💳', recommended: true },
    { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
    { id: 'wallet', label: 'Digital Wallet', icon: '👛' }
  ];

  const handlePayment = async () => {
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      const otp = Math.floor(1000 + Math.random() * 9000);
      navigate('/order-confirmation', { state: { otp } });
    }, 2000);
  };

  return (
    <div className="user-build-page user-animate-fadeIn">
      <div className="user-build-container">
        <ProgressSteps steps={4} currentStep={3} />

        <div className="user-build-header">
          <h1 className="user-build-title">Payment</h1>
          <p className="user-build-subtitle">
            Choose your preferred payment method
          </p>
        </div>

        <div className="user-payment-section">
          <div className="user-payment-amount user-animate-scaleIn">
            <div className="user-payment-amount-label">Total Amount to Pay</div>
            <div className="user-payment-amount-value">₹{calculateTotal().toFixed(0)}</div>
          </div>

          <div className="user-payment-methods user-animate-slideUp">
            <h3 className="user-payment-methods-title">Select Payment Method</h3>
            <div className="user-payment-methods-grid">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`user-payment-method-card ${paymentMethod === method.id ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  {method.recommended && (
                    <div className="user-payment-recommended">Recommended</div>
                  )}
                  <div className="user-payment-method-icon">{method.icon}</div>
                  <div className="user-payment-method-label">{method.label}</div>
                  <div className="user-payment-method-check">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {paymentMethod === 'upi' && (
            <div className="user-payment-form user-animate-slideUp">
              <h3 className="user-payment-form-title">Enter UPI ID</h3>
              <div className="user-form-group">
                <input
                  type="text"
                  className="user-form-input"
                  placeholder="username@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            </div>
          )}

          {paymentMethod === 'wallet' && (
            <div className="user-payment-wallets user-animate-slideUp">
              <h3 className="user-payment-form-title">Choose Wallet</h3>
              <div className="user-wallet-options">
                <button className="user-wallet-btn">
                  <span>Paytm</span>
                </button>
                <button className="user-wallet-btn">
                  <span>PhonePe</span>
                </button>
                <button className="user-wallet-btn">
                  <span>Google Pay</span>
                </button>
              </div>
            </div>
          )}

          <div className="user-payment-security user-animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <div>
              <div className="user-payment-security-title">Secure Payment</div>
              <div className="user-payment-security-text">
                Your payment is secured by Razorpay with 256-bit SSL encryption
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="user-build-footer">
        <div className="user-build-footer-content">
          <div className="user-build-footer-info">
            <div className="user-build-footer-label">Amount</div>
            <div className="user-build-footer-selection">₹{calculateTotal().toFixed(0)}</div>
          </div>
          <div className="user-build-footer-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={handlePayment}
              loading={processing}
            >
              {processing ? 'Processing...' : `Pay ₹${calculateTotal().toFixed(0)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
