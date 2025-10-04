import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  const [selectedAddressType, setSelectedAddressType] = useState('geolocation');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [manualAddress, setManualAddress] = useState({
    label: '',
    address: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});

  // Mock saved addresses
  const [savedAddresses] = useState([
    {
      id: 1,
      label: 'Hostel Room',
      address: 'Room 204, Boys Hostel, University Campus, New Delhi - 110001',
      phoneNumber: '9876543210'
    },
    {
      id: 2,
      label: 'PG',
      address: 'Flat 3B, Sunrise PG, Sector 15, Noida - 201301',
      phoneNumber: '9876543210'
    }
  ]);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState(null);

  // Redirect if no order data
  if (!orderData) {
    navigate('/user');
    return null;
  }

  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({
            lat: latitude,
            lng: longitude,
            address: `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
          alert('Unable to get your location. Please enter address manually.');
        }
      );
    } else {
      setLocationLoading(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (selectedAddressType === 'manual') {
      if (!manualAddress.label.trim()) {
        newErrors.label = 'Address label is required';
      }
      if (!manualAddress.address.trim()) {
        newErrors.address = 'Address is required';
      }
      if (!manualAddress.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!/^\d{10}$/.test(manualAddress.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
      }
    } else if (selectedAddressType === 'geolocation' && !currentLocation) {
      newErrors.location = 'Please get your current location';
    } else if (selectedAddressType === 'saved' && !selectedSavedAddress) {
      newErrors.savedAddress = 'Please select a saved address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      return;
    }

    let deliveryAddress;
    
    if (selectedAddressType === 'geolocation') {
      deliveryAddress = {
        label: 'Current Location',
        address: currentLocation.address,
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        phoneNumber: '9876543210' // This would come from user profile
      };
    } else if (selectedAddressType === 'manual') {
      deliveryAddress = {
        ...manualAddress,
        lat: null,
        lng: null
      };
    } else {
      deliveryAddress = selectedSavedAddress;
    }

    const finalOrderData = {
      ...orderData,
      deliveryAddress,
      orderTime: new Date().toISOString()
    };

    navigate('/user/payment-confirmation', { state: finalOrderData });
  };

  const handleManualAddressChange = (field, value) => {
    setManualAddress(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const getEstimatedDeliveryTime = () => {
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
    return deliveryTime.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1 className="checkout-title">Checkout</h1>
        <p className="checkout-subtitle">
          Choose your delivery address and complete your order
        </p>
      </div>

      <div className="checkout-content">
        <div className="checkout-form">
          <div className="form-section">
            <h2 className="section-title">
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Delivery Address
            </h2>

            <div className="address-options">
              <div 
                className={`address-option ${selectedAddressType === 'geolocation' ? 'selected' : ''}`}
                onClick={() => setSelectedAddressType('geolocation')}
              >
                <input
                  type="radio"
                  name="addressType"
                  value="geolocation"
                  checked={selectedAddressType === 'geolocation'}
                  onChange={() => setSelectedAddressType('geolocation')}
                  className="address-radio"
                />
                <div className="address-details">
                  <div className="address-label">Use Current Location</div>
                  <div className="address-text">
                    Get your location automatically using GPS
                  </div>
                </div>
              </div>

              {savedAddresses.length > 0 && (
                <div 
                  className={`address-option ${selectedAddressType === 'saved' ? 'selected' : ''}`}
                  onClick={() => setSelectedAddressType('saved')}
                >
                  <input
                    type="radio"
                    name="addressType"
                    value="saved"
                    checked={selectedAddressType === 'saved'}
                    onChange={() => setSelectedAddressType('saved')}
                    className="address-radio"
                  />
                  <div className="address-details">
                    <div className="address-label">Saved Addresses</div>
                    <div className="address-text">
                      Choose from your previously saved addresses
                    </div>
                  </div>
                </div>
              )}

              <div 
                className={`address-option ${selectedAddressType === 'manual' ? 'selected' : ''}`}
                onClick={() => setSelectedAddressType('manual')}
              >
                <input
                  type="radio"
                  name="addressType"
                  value="manual"
                  checked={selectedAddressType === 'manual'}
                  onChange={() => setSelectedAddressType('manual')}
                  className="address-radio"
                />
                <div className="address-details">
                  <div className="address-label">Enter Address Manually</div>
                  <div className="address-text">
                    Type your delivery address manually
                  </div>
                </div>
              </div>
            </div>

            {selectedAddressType === 'geolocation' && (
              <div className="geolocation-section">
                {!currentLocation ? (
                  <button
                    className="location-btn"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {locationLoading ? 'Getting Location...' : 'Get My Location'}
                  </button>
                ) : (
                  <div className="location-status">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Location obtained successfully
                  </div>
                )}
                {errors.location && <div className="input-error">{errors.location}</div>}
              </div>
            )}

            {selectedAddressType === 'saved' && (
              <div className="saved-addresses">
                {savedAddresses.map((address) => (
                  <div
                    key={address.id}
                    className={`saved-address ${selectedSavedAddress?.id === address.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSavedAddress(address)}
                  >
                    <div className="saved-address-info">
                      <input
                        type="radio"
                        name="savedAddress"
                        checked={selectedSavedAddress?.id === address.id}
                        onChange={() => setSelectedSavedAddress(address)}
                        className="address-radio"
                      />
                      <div className="saved-address-details">
                        <div className="saved-address-label">{address.label}</div>
                        <div className="saved-address-text">{address.address}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {errors.savedAddress && <div className="input-error">{errors.savedAddress}</div>}
              </div>
            )}

            {selectedAddressType === 'manual' && (
              <div className="manual-address">
                <div className="form-group">
                  <label className="form-label">Address Label *</label>
                  <input
                    type="text"
                    className={`form-input ${errors.label ? 'error' : ''}`}
                    placeholder="e.g., Home, Office, Hostel"
                    value={manualAddress.label}
                    onChange={(e) => handleManualAddressChange('label', e.target.value)}
                  />
                  {errors.label && <div className="input-error">{errors.label}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Complete Address *</label>
                  <textarea
                    className={`form-input form-textarea ${errors.address ? 'error' : ''}`}
                    placeholder="Enter your complete address with landmarks"
                    value={manualAddress.address}
                    onChange={(e) => handleManualAddressChange('address', e.target.value)}
                  />
                  {errors.address && <div className="input-error">{errors.address}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                    placeholder="10-digit mobile number"
                    value={manualAddress.phoneNumber}
                    onChange={(e) => handleManualAddressChange('phoneNumber', e.target.value)}
                  />
                  {errors.phoneNumber && <div className="input-error">{errors.phoneNumber}</div>}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="order-sidebar">
          <div className="order-summary-card">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-items">
              <div className="summary-item">
                <span className="item-label">Meal Type</span>
                <span className="item-value">{orderData.mealType}</span>
              </div>
              <div className="summary-item">
                <span className="item-label">Quantity</span>
                <span className="item-value">{orderData.quantity} Thali{orderData.quantity > 1 ? 's' : ''}</span>
              </div>
              <div className="summary-item">
                <span className="item-label">Sabjis</span>
                <span className="item-value">{orderData.selectedSabjis.join(', ')}</span>
              </div>
              <div className="summary-item">
                <span className="item-label">Base</span>
                <span className="item-value">
                  {orderData.base === 'roti' ? '5 Rotis' : '3 Rotis + Rice'}
                  {orderData.extraRoti > 0 && ` + ${orderData.extraRoti} Extra`}
                </span>
              </div>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total Amount</span>
              <span>₹{orderData.finalTotalPrice}</span>
            </div>
          </div>

          <div className="delivery-info">
            <h3 className="delivery-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Delivery Information
            </h3>
            <div className="delivery-details">
              <div className="delivery-time">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Estimated delivery: {getEstimatedDeliveryTime()}
              </div>
              <div>• Free delivery on all orders</div>
              <div>• Fresh and hot meal guaranteed</div>
              <div>• Contact delivery partner for updates</div>
            </div>
          </div>

          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.51 0 2.93.37 4.18 1.03"></path>
            </svg>
            Place Order - ₹{orderData.finalTotalPrice}
          </button>

          <div className="security-note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Your payment information is secure and encrypted
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;