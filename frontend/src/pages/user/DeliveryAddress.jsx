import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ProgressSteps } from '../../components/user/UserComponents';
import './BuildDishes.css';
import './DeliveryAddress.css';

const DeliveryAddress = () => {
  const navigate = useNavigate();
  const [addressType, setAddressType] = useState('manual');
  const [hostel, setHostel] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [fullAddress, setFullAddress] = useState('');

  const hostels = [
    'BH-1 (Boys Hostel 1)',
    'BH-2 (Boys Hostel 2)',
    'BH-3 (Boys Hostel 3)',
    'GH-1 (Girls Hostel 1)',
    'GH-2 (Girls Hostel 2)',
    'PG Accommodation'
  ];

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          alert(`Location captured: ${position.coords.latitude}, ${position.coords.longitude}`);
          setAddressType('gps');
        },
        (error) => {
          alert('Unable to get location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const handleProceed = () => {
    if (addressType === 'manual' && (!hostel || !roomNumber)) {
      alert('Please fill in all address fields');
      return;
    }
    navigate('/checkout/payment');
  };

  return (
    <div className="user-build-page user-animate-fadeIn">
      <div className="user-build-container">
        <ProgressSteps steps={4} currentStep={3} />

        <div className="user-build-header">
          <h1 className="user-build-title">Delivery Address</h1>
          <p className="user-build-subtitle">
            Where should we deliver your thali?
          </p>
        </div>

        <div className="user-address-section">
          <div className="user-address-options">
            <button
              className="user-address-option-btn user-animate-scaleIn"
              onClick={handleUseLocation}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>Use Current Location</span>
            </button>
          </div>

          <div className="user-address-divider user-animate-fadeIn">
            <span>OR</span>
          </div>

          <div className="user-address-form user-animate-slideUp">
            <h3 className="user-address-form-title">Enter Address Manually</h3>

            <div className="user-form-group">
              <label className="user-form-label">Hostel / Location</label>
              <select
                className="user-form-select"
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
              >
                <option value="">Select Hostel</option>
                {hostels.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <div className="user-form-group">
              <label className="user-form-label">Room Number</label>
              <input
                type="text"
                className="user-form-input"
                placeholder="e.g., 204"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
              />
            </div>

            <div className="user-form-group">
              <label className="user-form-label">Additional Instructions (Optional)</label>
              <textarea
                className="user-form-textarea"
                placeholder="e.g., Near stairs, first floor"
                rows="3"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="user-delivery-info user-animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
            <div>
              <div className="user-delivery-info-title">Estimated Delivery Time</div>
              <div className="user-delivery-info-text">30-40 minutes after order confirmation</div>
            </div>
          </div>
        </div>
      </div>

      <div className="user-build-footer">
        <div className="user-build-footer-content">
          <div className="user-build-footer-info">
            <div className="user-build-footer-label">Delivery Location</div>
            <div className="user-build-footer-selection">
              {hostel && roomNumber ? `${hostel}, Room ${roomNumber}` : 'Not set'}
            </div>
          </div>
          <div className="user-build-footer-actions">
            <Button variant="primary" size="lg" onClick={handleProceed}>
              Proceed to Payment
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddress;
