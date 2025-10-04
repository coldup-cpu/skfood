import { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [selectedSabjis, setSelectedSabjis] = useState([]);
  const [selectedBase, setSelectedBase] = useState('roti');
  const [extraRoti, setExtraRoti] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedOrder = localStorage.getItem('skfood_order');
    if (savedOrder) {
      try {
        const orderData = JSON.parse(savedOrder);
        setSelectedSabjis(orderData.selectedSabjis || []);
        setSelectedBase(orderData.selectedBase || 'roti');
        setExtraRoti(orderData.extraRoti || 0);
        setQuantity(orderData.quantity || 1);
        setAddress(orderData.address || null);
        setSpecialInstructions(orderData.specialInstructions || '');
        setCurrentStep(orderData.currentStep || 1);
      } catch (error) {
        console.error('Error loading saved order:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const orderData = {
      selectedSabjis,
      selectedBase,
      extraRoti,
      quantity,
      address,
      specialInstructions,
      currentStep
    };
    localStorage.setItem('skfood_order', JSON.stringify(orderData));
  }, [selectedSabjis, selectedBase, extraRoti, quantity, address, specialInstructions, currentStep]);

  const selectSabji = (sabji) => {
    setSelectedSabjis(prev => {
      const isSelected = prev.some(s => s.name === sabji.name);
      
      if (isSelected) {
        // Remove sabji
        return prev.filter(s => s.name !== sabji.name);
      } else if (prev.length < 2) {
        // Add sabji (max 2)
        return [...prev, sabji];
      }
      
      return prev;
    });
  };

  const selectBase = (base) => {
    setSelectedBase(base);
  };

  const updateExtraRoti = (count) => {
    setExtraRoti(Math.max(0, Math.min(3, count)));
  };

  const updateQuantity = (qty) => {
    setQuantity(Math.max(1, Math.min(5, qty)));
  };

  const updateAddress = (newAddress) => {
    setAddress(newAddress);
  };

  const updateSpecialInstructions = (instructions) => {
    setSpecialInstructions(instructions);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(3, prev + 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const goToStep = (step) => {
    setCurrentStep(Math.max(1, Math.min(3, step)));
  };

  const calculatePrice = () => {
    const basePrice = 120; // Rs.120 base thali
    const hasSpecialSabji = selectedSabjis.some(sabji => sabji.isSpecial);
    const specialPrice = hasSpecialSabji ? 20 : 0; // Rs.20 for special sabji
    const extraRotiPrice = extraRoti * 5; // Rs.5 per extra roti
    
    const perThaliPrice = basePrice + specialPrice + extraRotiPrice;
    const subtotal = perThaliPrice * quantity;
    
    // Bulk discount: 5% off for 3+ thalis
    const discount = quantity >= 3 ? subtotal * 0.05 : 0;
    
    // Tax: 5% of (subtotal - discount)
    const tax = (subtotal - discount) * 0.05;
    
    // Delivery fee: Rs.20 flat
    const deliveryFee = 20;
    
    const total = subtotal - discount + tax + deliveryFee;
    
    return {
      perThaliPrice,
      subtotal,
      discount,
      tax,
      deliveryFee,
      total: Math.round(total),
      hasSpecialSabji
    };
  };

  const resetOrder = () => {
    setSelectedSabjis([]);
    setSelectedBase('roti');
    setExtraRoti(0);
    setQuantity(1);
    setAddress(null);
    setSpecialInstructions('');
    setCurrentStep(1);
    localStorage.removeItem('skfood_order');
  };

  const getOrderData = () => {
    const pricing = calculatePrice();
    return {
      sabjisSelected: selectedSabjis.map(s => s.name),
      base: selectedBase,
      extraRoti,
      quantity,
      address,
      specialInstructions,
      isSpecial: pricing.hasSpecialSabji,
      totalPrice: pricing.total,
      pricing
    };
  };

  const value = {
    selectedSabjis,
    selectedBase,
    extraRoti,
    quantity,
    address,
    specialInstructions,
    currentStep,
    selectSabji,
    selectBase,
    updateExtraRoti,
    updateQuantity,
    updateAddress,
    updateSpecialInstructions,
    nextStep,
    prevStep,
    goToStep,
    calculatePrice,
    resetOrder,
    getOrderData
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};