import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import './PublishMenu.css';

const PublishMenu = () => {
  const [mealType, setMealType] = useState('lunch');
  const [basePrice, setBasePrice] = useState(60);
  const [sabjis, setSabjis] = useState([]);
  const [menuHistory, setMenuHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingSabjiIndex, setUploadingSabjiIndex] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchMenuHistory();
  }, []);

  const fetchMenuHistory = async () => {
    try {
      const response = await adminAPI.getMenuHistory();
      setMenuHistory(response.data);
    } catch (error) {
      console.error('Error fetching menu history:', error);
    }
  };

  const addSabji = () => {
    setSabjis([...sabjis, { name: '', imageUrl: '', isSpecial: false }]);
  };

  const removeSabji = (index) => {
    setSabjis(sabjis.filter((_, i) => i !== index));
  };

  const updateSabji = (index, field, value) => {
    const updatedSabjis = [...sabjis];
    updatedSabjis[index][field] = value;
    setSabjis(updatedSabjis);
  };

  const handleImageUpload = async (index, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('imageFile', file);

    try {
      setUploadingSabjiIndex(index);
      const response = await adminAPI.uploadImage(formData);
      updateSabji(index, 'imageUrl', response.data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingSabjiIndex(null);
    }
  };

  const loadHistoryMenu = (menu) => {
    setMealType(menu.mealType);
    setBasePrice(menu.basePrice);
    setSabjis(menu.listOfSabjis || []);
    setShowHistory(false);
  };

  const publishMenu = async () => {
    if (sabjis.length === 0) {
      alert('Please add at least one sabji');
      return;
    }

    const invalidSabjis = sabjis.filter(s => !s.name || !s.imageUrl);
    if (invalidSabjis.length > 0) {
      alert('Please complete all sabji details (name and image)');
      return;
    }

    const menuData = {
      mealType,
      basePrice,
      listOfSabjis: sabjis,
    };

    try {
      setLoading(true);
      await adminAPI.createMenu(menuData);
      alert('Menu published successfully!');
      setSabjis([]);
      fetchMenuHistory();
    } catch (error) {
      console.error('Error publishing menu:', error);
      alert('Failed to publish menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="publish-menu-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Publish Menu</h1>
          <p className="page-subtitle">Create or update lunch & dinner menu</p>
        </div>
        <button
          className="btn-history"
          onClick={() => setShowHistory(!showHistory)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {showHistory ? 'Hide' : 'Show'} History
        </button>
      </div>

      {showHistory && (
        <div className="menu-history">
          <h3 className="history-title">Previous Menus</h3>
          {menuHistory.length === 0 ? (
            <p className="history-empty">No previous menus found</p>
          ) : (
            <div className="history-grid">
              {menuHistory.map((menu) => (
                <div key={menu._id} className="history-card">
                  <div className="history-header">
                    <span className="history-meal-type">
                      {menu.mealType === 'lunch' ? '🌞 Lunch' : '🌙 Dinner'}
                    </span>
                    <span className="history-price">₹{menu.basePrice}</span>
                  </div>
                  <div className="history-sabjis">
                    {menu.listOfSabjis?.slice(0, 3).map((sabji, idx) => (
                      <div key={idx} className="history-sabji">
                        {sabji.isSpecial && <span className="star">⭐</span>}
                        {sabji.name}
                      </div>
                    ))}
                    {menu.listOfSabjis?.length > 3 && (
                      <div className="history-more">+{menu.listOfSabjis.length - 3} more</div>
                    )}
                  </div>
                  <button
                    className="btn-load-history"
                    onClick={() => loadHistoryMenu(menu)}
                  >
                    Load This Menu
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="menu-form">
        <div className="form-section">
          <label className="form-label">Meal Type</label>
          <div className="meal-type-toggle">
            <button
              className={`toggle-btn ${mealType === 'lunch' ? 'toggle-active' : ''}`}
              onClick={() => setMealType('lunch')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              Lunch
            </button>
            <button
              className={`toggle-btn ${mealType === 'dinner' ? 'toggle-active' : ''}`}
              onClick={() => setMealType('dinner')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              Dinner
            </button>
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">Base Price (₹)</label>
          <input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
            className="price-input"
            min="0"
          />
        </div>

        <div className="form-section">
          <div className="section-header">
            <label className="form-label">Sabjis</label>
            <button className="btn-add-sabji" onClick={addSabji}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Sabji
            </button>
          </div>

          {sabjis.length === 0 ? (
            <div className="empty-sabjis">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <p>No sabjis added yet</p>
              <p className="empty-subtitle">Click "Add Sabji" to start building your menu</p>
            </div>
          ) : (
            <div className="sabjis-list">
              {sabjis.map((sabji, index) => (
                <div key={index} className="sabji-card">
                  <div className="sabji-card-header">
                    <span className="sabji-number">Sabji #{index + 1}</span>
                    <button
                      className="btn-remove"
                      onClick={() => removeSabji(index)}
                      title="Remove sabji"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>

                  <div className="sabji-form">
                    <div className="form-field">
                      <label className="field-label">Name</label>
                      <input
                        type="text"
                        value={sabji.name}
                        onChange={(e) => updateSabji(index, 'name', e.target.value)}
                        placeholder="e.g., Paneer Butter Masala"
                        className="field-input"
                      />
                    </div>

                    <div className="form-field">
                      <label className="field-label">Image</label>
                      <div className="image-upload-wrapper">
                        {sabji.imageUrl ? (
                          <div className="image-preview">
                            <img src={sabji.imageUrl} alt={sabji.name} />
                            <button
                              className="btn-change-image"
                              onClick={() => document.getElementById(`file-${index}`).click()}
                            >
                              Change Image
                            </button>
                          </div>
                        ) : (
                          <div className="upload-placeholder" onClick={() => document.getElementById(`file-${index}`).click()}>
                            {uploadingSabjiIndex === index ? (
                              <div className="uploading">Uploading...</div>
                            ) : (
                              <>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                  <polyline points="17 8 12 3 7 8"></polyline>
                                  <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                <span>Click to upload image</span>
                              </>
                            )}
                          </div>
                        )}
                        <input
                          id={`file-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(index, e.target.files[0])}
                          style={{ display: 'none' }}
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={sabji.isSpecial}
                          onChange={(e) => updateSabji(index, 'isSpecial', e.target.checked)}
                          className="checkbox-input"
                        />
                        <span className="checkbox-text">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                          Mark as Special
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            className="btn-publish"
            onClick={publishMenu}
            disabled={loading || sabjis.length === 0}
          >
            {loading ? (
              'Publishing...'
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Publish Menu
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishMenu;
