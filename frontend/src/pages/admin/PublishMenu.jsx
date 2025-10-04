import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Button, Card, Badge, Input, Modal } from '../../components/UI';
import '../../components/UIComponents.css';
import './PublishMenu.css';

const PublishMenu = () => {
  const [mealType, setMealType] = useState('lunch');
  const [basePrice, setBasePrice] = useState(120);
  const [sabjis, setSabjis] = useState([]);
  const [menuHistory, setMenuHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingSabjiIndex, setUploadingSabjiIndex] = useState(null);
  const [showHistorySection, setShowHistorySection] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newSabji, setNewSabji] = useState({ name: '', imageUrl: '', isSpecial: false });
  const [saveAsNewHistory, setSaveAsNewHistory] = useState(true);

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

  const openModal = () => {
    setNewSabji({ name: '', imageUrl: '', isSpecial: false });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewSabji({ name: '', imageUrl: '', isSpecial: false });
  };

  const addSabji = () => {
    if (!newSabji.name.trim()) {
      alert('Please enter sabji name');
      return;
    }
    setSabjis([...sabjis, { ...newSabji }]);
    closeModal();
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

  const handleModalImageUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('imageFile', file);

    try {
      setUploadingSabjiIndex(-1);
      const response = await adminAPI.uploadImage(formData);
      setNewSabji({ ...newSabji, imageUrl: response.data.url });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingSabjiIndex(null);
    }
  };

  const toggleSpecial = (index) => {
    const updatedSabjis = [...sabjis];
    updatedSabjis[index].isSpecial = !updatedSabjis[index].isSpecial;
    setSabjis(updatedSabjis);
  };

  const loadHistoryMenu = (menu) => {
    setMealType(menu.mealType);
    setBasePrice(menu.basePrice);
    setSabjis(menu.listOfSabjis || []);
    setShowHistorySection(false);
    setSaveAsNewHistory(false);
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
      isNewMeal: saveAsNewHistory,
    };

    try {
      setLoading(true);
      await adminAPI.createMenu(menuData);
      alert('Menu published successfully!');
      setSabjis([]);
      fetchMenuHistory();
      setSaveAsNewHistory(true);
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
        <h1 className="page-title">Publish Menu</h1>
      </div>

      <div className="menu-form">
        <Card className="history-section">
          <div className="section-header">
            <h2 className="section-title">Quick Start</h2>
            <Button 
              variant="secondary"
              onClick={() => setShowHistorySection(!showHistorySection)}
            >
              {showHistorySection ? 'Hide History' : 'Load from History'}
            </Button>
          </div>
          <p className="history-description">
            Save time by loading a previous menu and making adjustments as needed.
          </p>
          
          {showHistorySection && (
            <div className="history-grid">
              {menuHistory.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-message">No menu history available</p>
                </div>
              ) : (
                menuHistory.map((menu, index) => (
                  <Card key={index} className="history-card">
                    <div className="history-card-header">
                      <div className="history-meal-info">
                        <span className="history-meal-type">{menu.mealType}</span>
                        <span className="history-date">
                          {new Date(menu.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <span className="history-price">₹{menu.basePrice}</span>
                    </div>
                    <div className="history-sabjis">
                      {menu.listOfSabjis?.slice(0, 3).map((sabji, idx) => (
                        <Badge key={idx} variant="secondary" size="sm">
                          {sabji.name}
                          {sabji.isSpecial && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                          )}
                        </Badge>
                      ))}
                      {menu.listOfSabjis?.length > 3 && (
                        <Badge variant="primary" size="sm">
                          +{menu.listOfSabjis.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <Button 
                      variant="primary"
                      size="sm"
                      onClick={() => loadHistoryMenu(menu)}
                      className="btn-load-history"
                    >
                      Load this Menu
                    </Button>
                  </Card>
                ))
              )}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="section-title">Meal Type</h2>
          <div className="meal-type-toggle">
            <Button
              variant={mealType === 'lunch' ? 'primary' : 'secondary'}
              onClick={() => setMealType('lunch')}
              className="toggle-btn"
            >
              Lunch (12-3 PM)
            </Button>
            <Button
              variant={mealType === 'dinner' ? 'primary' : 'secondary'}
              onClick={() => setMealType('dinner')}
              className="toggle-btn"
            >
              Dinner (7-10 PM)
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="section-title">Base Price</h2>
          <Input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
            prefix="₹"
            min="0"
          />
          <p className="price-helper-text">Includes 2 sabjis + base + raita + salad</p>
        </Card>

        <Card>
          <div className="section-header">
            <h2 className="section-title">Today's Sabjis</h2>
            <Button 
              variant="primary"
              onClick={openModal}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              }
            >
              Add Sabji
            </Button>
          </div>

          {sabjis.length === 0 ? (
            <div className="empty-state">
              <p className="empty-message">No sabjis added yet</p>
            </div>
          ) : (
            <div className="sabjis-grid">
              {sabjis.map((sabji, index) => (
                <div key={index} className="sabji-item">
                  <div className="sabji-image-wrapper">
                    {sabji.imageUrl ? (
                      <img src={sabji.imageUrl} alt={sabji.name} className="sabji-image" />
                    ) : (
                      <div className="sabji-image-placeholder">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="sabji-details">
                    <div className="sabji-name-row">
                      <span className="sabji-name">{sabji.name}</span>
                      {sabji.isSpecial && (
                        <Badge 
                          variant="warning" 
                          size="sm"
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
                  </div>
                  <div className="sabji-actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSpecial(index)}
                      className={sabji.isSpecial ? 'starred' : ''}
                      icon={
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={sabji.isSpecial ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSabji(index)}
                      icon={
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {sabjis.length > 0 && (
            <div className="sabjis-summary">
              <span className="summary-text">
                {sabjis.length} sabji{sabjis.length !== 1 ? 's' : ''} added
                {sabjis.length < 2 && '. Add more to complete the menu.'}
              </span>
            </div>
          )}
        </Card>

        <Card className="publish-options-section">
          <h2 className="section-title">Publish Options</h2>
          <label className="publish-checkbox-label">
            <input
              type="checkbox"
              checked={saveAsNewHistory}
              onChange={(e) => setSaveAsNewHistory(e.target.checked)}
              className="publish-checkbox"
            />
            <span>Save this menu to history for future use</span>
          </label>
          <p className="publish-helper-text">
            When enabled, this menu will be saved and can be quickly loaded later.
          </p>
        </Card>

        <Card className="publish-section">
          <Button 
            variant={sabjis.length === 0 ? 'secondary' : 'success'}
            size="lg"
            onClick={publishMenu}
            disabled={loading || sabjis.length === 0}
            loading={loading}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <circle cx="11" cy="11" r="2"></circle>
              </svg>
            }
            className="btn-publish"
          >
            {sabjis.length === 0 ? 'Add Sabjis to Publish' : `Publish Menu`}
          </Button>
        </Card>
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title="Add New Sabji"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={addSabji} 
              disabled={uploadingSabjiIndex === -1}
              loading={uploadingSabjiIndex === -1}
            >
              Add Sabji
            </Button>
          </>
        }
      >
        <div className="modal-fields">
          <Input
            label="Sabji Name"
            type="text"
            value={newSabji.name}
            onChange={(e) => setNewSabji({ ...newSabji, name: e.target.value })}
            placeholder="e.g., Aloo Gobi"
            required
          />

          <div className="modal-field">
            <label className="modal-label">Image URL (Optional)</label>
            <div className="modal-image-input-group">
              <Input
                type="text"
                value={newSabji.imageUrl}
                onChange={(e) => setNewSabji({ ...newSabji, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              <Button
                variant="secondary"
                onClick={() => document.getElementById('modal-file-input').click()}
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                }
              />
              <input
                id="modal-file-input"
                type="file"
                accept="image/*"
                onChange={(e) => handleModalImageUpload(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </div>
            <p className="modal-helper-text">Leave empty for default image</p>
          </div>

          <div className="modal-field">
            <label className="modal-checkbox-label">
              <input
                type="checkbox"
                checked={newSabji.isSpecial}
                onChange={(e) => setNewSabji({ ...newSabji, isSpecial: e.target.checked })}
                className="modal-checkbox"
              />
              <span>Mark as Today's Special</span>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PublishMenu;