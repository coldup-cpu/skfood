import './UI.css';

export const Button = ({ children, variant = 'primary', size = 'md', className = '', disabled = false, loading = false, icon, ...props }) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const classes = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <>
          <span className="btn-spinner"></span>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export const Card = ({ children, className = '', hover = false, ...props }) => {
  const classes = `card ${hover ? 'card-hover' : ''} ${className}`.trim();
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const classes = `badge badge-${variant} badge-${size} ${className}`.trim();
  return <span className={classes}>{children}</span>;
};

export const Skeleton = ({ className = '', width, height, circle = false }) => {
  const style = {
    width: width || '100%',
    height: height || '20px',
    borderRadius: circle ? '50%' : undefined
  };
  return <div className={`skeleton ${className}`} style={style}></div>;
};

export const Input = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        <input className={`input ${error ? 'input-error' : ''} ${icon ? 'input-with-icon' : ''}`} {...props} />
      </div>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};

export const Select = ({ label, error, options = [], className = '', ...props }) => {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <select className={`input input-select ${error ? 'input-error' : ''}`} {...props}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};

export const StatCard = ({ icon, label, value, trend, trendValue, loading = false, gradient = 'accent', onClick }) => {
  if (loading) {
    return (
      <Card className="stat-card" hover={!!onClick} onClick={onClick}>
        <div className="stat-card-content">
          <Skeleton width="48px" height="48px" circle />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skeleton width="120px" height="14px" />
            <Skeleton width="80px" height="32px" />
            <Skeleton width="100px" height="12px" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`stat-card stat-card-${gradient}`} hover={!!onClick} onClick={onClick}>
      <div className="stat-card-content">
        <div className={`stat-icon stat-icon-${gradient}`}>{icon}</div>
        <div className="stat-info">
          <span className="stat-label">{label}</span>
          <span className="stat-value">{value}</span>
          {trend && (
            <div className={`stat-trend stat-trend-${trend}`}>
              {trend === 'up' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      {title && <h3 className="empty-state-title">{title}</h3>}
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};

export const LoadingSpinner = ({ size = 'md' }) => {
  return (
    <div className={`spinner spinner-${size}`}>
      <div className="spinner-circle"></div>
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`tab ${activeTab === tab.value ? 'tab-active' : ''}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.icon && <span className="tab-icon">{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.badge !== undefined && <Badge variant="light" size="sm">{tab.badge}</Badge>}
        </button>
      ))}
    </div>
  );
};
