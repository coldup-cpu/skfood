import { createContext, useContext, useState, useEffect } from 'react';

const MealBuilderContext = createContext();

export const useMealBuilder = () => {
  const context = useContext(MealBuilderContext);
  if (!context) {
    throw new Error('useMealBuilder must be used within MealBuilderProvider');
  }
  return context;
};

export const MealBuilderProvider = ({ children }) => {
  const [mealType, setMealType] = useState('lunch');
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [selectedBase, setSelectedBase] = useState('roti');
  const [extraRotis, setExtraRotis] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);

  const BASE_PRICE = 120;
  const EXTRA_ROTI_PRICE = 5;
  const TAX_RATE = 0.05;
  const DELIVERY_FEE = 20;

  useEffect(() => {
    const saved = localStorage.getItem('mealBuilder');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setMealType(data.mealType || 'lunch');
        setSelectedDishes(data.selectedDishes || []);
        setSelectedBase(data.selectedBase || 'roti');
        setExtraRotis(data.extraRotis || 0);
        setQuantity(data.quantity || 1);
        setCurrentStep(data.currentStep || 0);
      } catch (error) {
        console.error('Failed to load saved meal builder data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const data = {
      mealType,
      selectedDishes,
      selectedBase,
      extraRotis,
      quantity,
      currentStep
    };
    localStorage.setItem('mealBuilder', JSON.stringify(data));
  }, [mealType, selectedDishes, selectedBase, extraRotis, quantity, currentStep]);

  const calculateSubtotal = () => {
    const baseAmount = BASE_PRICE;
    const extraRotisAmount = extraRotis * EXTRA_ROTI_PRICE;
    return (baseAmount + extraRotisAmount) * quantity;
  };

  const calculateDiscount = () => {
    if (quantity >= 3) {
      return calculateSubtotal() * 0.05;
    }
    return 0;
  };

  const calculateTax = () => {
    const afterDiscount = calculateSubtotal() - calculateDiscount();
    return afterDiscount * TAX_RATE;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax + DELIVERY_FEE;
  };

  const selectDish = (dish) => {
    if (selectedDishes.find(d => d.name === dish.name)) {
      setSelectedDishes(selectedDishes.filter(d => d.name !== dish.name));
    } else if (selectedDishes.length < 2) {
      setSelectedDishes([...selectedDishes, dish]);
    }
  };

  const resetBuilder = () => {
    setMealType('lunch');
    setSelectedDishes([]);
    setSelectedBase('roti');
    setExtraRotis(0);
    setQuantity(1);
    setCurrentStep(0);
    localStorage.removeItem('mealBuilder');
  };

  const value = {
    mealType,
    setMealType,
    selectedDishes,
    setSelectedDishes,
    selectDish,
    selectedBase,
    setSelectedBase,
    extraRotis,
    setExtraRotis,
    quantity,
    setQuantity,
    currentStep,
    setCurrentStep,
    BASE_PRICE,
    EXTRA_ROTI_PRICE,
    TAX_RATE,
    DELIVERY_FEE,
    calculateSubtotal,
    calculateDiscount,
    calculateTax,
    calculateTotal,
    resetBuilder
  };

  return (
    <MealBuilderContext.Provider value={value}>
      {children}
    </MealBuilderContext.Provider>
  );
};
