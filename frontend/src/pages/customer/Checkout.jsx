import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Input } from '../../components/UI';
import '../../components/CustomerTheme.css';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { address, updateAddress, getOrderData, calculatePrice } = useOrder();

  const [deliveryInfo, setDeliveryInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: address?.address || '',
    landmark: address?.landmark || '',
    city: address?.city || '',
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const orderData = getOrderData();
    if (orderData.sabjisSelected.length === 0) {
      navigate('/meal-builder');
      return;
    }

    const saved = localStorage.getItem('savedAddresses');
    if (saved) {
      try {
        const addresses = JSON.parse(saved);
        setSavedAddresses(addresses);
      } catch (error) {
        console.error('Error loading saved addresses:', error);
      }
    }
  }, [navigate, getOrderData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data && data.address) {
            setDeliveryInfo(prev => ({
              ...prev,
              address: data.display_name || '',
              city: data.address.city || data.address.town || data.address.village || '',
            }));
          }
        } catch (error) {
          console.error('Error fetching address:', error);
          alert('Could not fetch address. Please enter manually.');
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Could not get your location. Please enter address manually.');
        setIsLoadingLocation(false);
      }
    );
  };

  const selectSavedAddress = (address) => {
    setSelectedAddressId(address.id);
    setDeliveryInfo(prev => ({
      ...prev,
      address: address.address,
      landmark: address.landmark,
      city: address.city,
    }));
  };

  const saveCurrentAddress = () => {
    if (!deliveryInfo.address || !deliveryInfo.city) {
      alert('Please fill in address and city before saving');
      return;
    }

    const newAddress = {
      id: Date.now(),
      address: deliveryInfo.address,
      landmark: deliveryInfo.landmark,
      city: deliveryInfo.city,
    };

    const updatedAddresses = [...savedAddresses, newAddress];
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
    alert('Address saved successfully!');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!deliveryInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!deliveryInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(deliveryInfo.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!deliveryInfo.address.trim()) {
      newErrors.address = 'Delivery address is required';
    }

    if (!deliveryInfo.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (!validateForm()) {
      return;
    }

    updateAddress(deliveryInfo);
    navigate('/payment');
  };

  const pricing = calculatePrice();

  return (
    <div className="checkout">
      <div className="checkout-header">
        <button className="back-btn" onClick={() => navigate('/order-summary')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div>
          <h1 className="page-title">Checkout</h1>
          <p className="page-subtitle">Complete your delivery details</p>
        </div>
      </div>

      <div className="checkout-content">
        <Card className="delivery-info-card">
          <h3 className="card-title">Contact Information</h3>

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <Input
              id="name"
              name="name"
              value={deliveryInfo.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              error={errors.name}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={deliveryInfo.phone}
              onChange={handleInputChange}
              placeholder="10-digit mobile number"
              maxLength="10"
              error={errors.phone}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
        </Card>

        {savedAddresses.length > 0 && (
          <Card className="saved-addresses-card">
            <h3 className="card-title">Saved Addresses</h3>
            <div className="saved-addresses-list">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`saved-address-item ${selectedAddressId === addr.id ? 'selected' : ''}`}
                  onClick={() => selectSavedAddress(addr)}
                >
                  <div className="address-radio">
                    {selectedAddressId === addr.id && (
                      <div className="radio-dot"></div>
                    )}
                  </div>
                  <div className="address-content">
                    <p className="address-text">{addr.address}</p>
                    {addr.landmark && <p className="address-landmark">{addr.landmark}</p>}
                    <p className="address-city">{addr.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="delivery-address-card">
          <div className="card-header-with-action">
            <h3 className="card-title">Delivery Address</h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGetLocation}
              disabled={isLoadingLocation}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              }
            >
              {isLoadingLocation ? 'Getting Location...' : 'Use My Location'}
            </Button>
          </div>

          <div className="form-group">
            <label htmlFor="address">Street Address *</label>
            <Input
              id="address"
              name="address"
              as="textarea"
              value={deliveryInfo.address}
              onChange={handleInputChange}
              placeholder="House no., Building name, Street"
              rows={3}
              error={errors.address}
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="landmark">Landmark (Optional)</label>
            <Input
              id="landmark"
              name="landmark"
              value={deliveryInfo.landmark}
              onChange={handleInputChange}
              placeholder="e.g., Near Main Gate, Behind Hostel"
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City *</label>
            <Input
              id="city"
              name="city"
              value={deliveryInfo.city}
              onChange={handleInputChange}
              placeholder="Enter your city"
              error={errors.city}
            />
            {errors.city && <span className="error-text">{errors.city}</span>}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={saveCurrentAddress}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
            }
          >
            Save This Address
          </Button>
        </Card>

        <Card className="order-total-card">
          <div className="total-row">
            <span className="total-label">Total Amount</span>
            <span className="total-amount">₹{pricing.total}</span>
          </div>
        </Card>

        <div className="checkout-actions">
          <Button
            variant="secondary"
            onClick={() => navigate('/order-summary')}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            }
          >
            Back to Order
          </Button>

          <Button
            className="btn-primary-customer"
            size="lg"
            onClick={handleProceedToPayment}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            }
          >
            Proceed to Payment • ₹{pricing.total}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
