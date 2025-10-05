import './UserComponents.css';

export const DishCard = ({ dish, selected, onSelect, className = '' }) => {
  return (
    <div
      className={`user-dish-card ${selected ? 'selected' : ''} ${className} user-animate-scaleIn`}
      onClick={onSelect}
    >
      {selected && (
        <div className="user-dish-check">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      )}
      {dish.isSpecial && <div className="user-dish-special-badge">Special</div>}
      <img
        src={dish.imageUrl || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'}
        alt={dish.name}
        className="user-dish-card-image"
      />
      <div className="user-dish-card-content">
        <div className="user-dish-card-header">
          <h3 className="user-dish-card-title">{dish.name}</h3>
        </div>
        <p className="user-dish-card-desc">Delicious and freshly prepared</p>
      </div>
    </div>
  );
};

export const QuantitySelector = ({ value, onChange, min = 1, max = 5, className = '' }) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={`user-quantity-selector ${className}`}>
      <button
        className="user-quantity-btn"
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      <span className="user-quantity-value">{value}</span>
      <button
        className="user-quantity-btn"
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};

export const PriceBreakdown = ({ items, className = '' }) => {
  return (
    <div className={`user-price-breakdown ${className}`}>
      <h3 className="user-price-breakdown-title">Price Breakdown</h3>
      {items.map((item, index) => {
        if (item.type === 'divider') {
          return <div key={index} className="user-price-divider" />;
        }

        return (
          <div
            key={index}
            className={`user-price-row ${item.highlight ? 'total' : ''} ${item.discount ? 'discount' : ''}`}
          >
            <span className="user-price-row-label">{item.label}</span>
            <span className="user-price-row-value">
              {item.discount && '- '}₹{item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const ProgressSteps = ({ steps, currentStep, className = '' }) => {
  return (
    <div className={`user-progress-steps ${className}`}>
      {Array.from({ length: steps }).map((_, index) => (
        <div
          key={index}
          className={`user-progress-step ${
            index < currentStep ? 'completed' : index === currentStep ? 'active' : ''
          }`}
        />
      ))}
    </div>
  );
};

export const AddressCard = ({ address, selected, onSelect, onEdit, onDelete, className = '' }) => {
  return (
    <div
      className={`user-address-card ${selected ? 'selected' : ''} ${className}`}
      onClick={onSelect}
    >
      <div className="user-address-card-header">
        <div className="user-address-label">{address.label}</div>
        {selected && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        )}
      </div>
      <div className="user-address-text">{address.address}</div>
      {address.roomNumber && <div className="user-address-text">Room: {address.roomNumber}</div>}
      <div className="user-address-actions">
        {onEdit && (
          <button
            className="user-address-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(address);
            }}
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            className="user-address-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(address);
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export const StatusBadge = ({ status, className = '' }) => {
  const getStatusClass = () => {
    if (status === 'Confirmed') return 'confirmed';
    if (status === 'on-the-way') return 'on-the-way';
    if (status === 'delivered') return 'delivered';
    return '';
  };

  const getStatusLabel = () => {
    if (status === 'on-the-way') return 'On the Way';
    return status;
  };

  return (
    <span className={`user-status-badge ${getStatusClass()} ${className}`}>
      {getStatusLabel()}
    </span>
  );
};

export const OTPDisplay = ({ otp, onCopy, className = '' }) => {
  return (
    <div className={`user-otp-display ${className}`}>
      <div className="user-otp-label">Your Order OTP</div>
      <div className="user-otp-code">{otp}</div>
      <button className="user-otp-copy" onClick={onCopy}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy OTP
      </button>
    </div>
  );
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`user-btn user-btn-${variant} ${size === 'lg' ? 'user-btn-lg' : ''} ${
        block ? 'user-btn-block' : ''
      } ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="user-loading-spinner" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export const EmptyState = ({ icon, title, description, action, className = '' }) => {
  return (
    <div className={`user-empty-state ${className}`}>
      {icon && <div className="user-empty-icon">{icon}</div>}
      {title && <h3 className="user-empty-title">{title}</h3>}
      {description && <p className="user-empty-desc">{description}</p>}
      {action && <div style={{ marginTop: 'var(--user-spacing-lg)' }}>{action}</div>}
    </div>
  );
};
