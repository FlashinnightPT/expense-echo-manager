
import { useState, useEffect } from 'react';

/**
 * A hook to manage the visibility of financial values across the application
 * It uses sessionStorage to persist the state between page navigations
 */
export function useFinancialValues() {
  const [showValues, setShowValues] = useState(false);

  // Initialize state from sessionStorage
  useEffect(() => {
    const savedPreference = sessionStorage.getItem('showFinancialValues');
    if (savedPreference !== null) {
      setShowValues(savedPreference === 'true');
    } else {
      // Default is to hide values if no preference is set
      sessionStorage.setItem('showFinancialValues', 'false');
    }
  }, []);

  // Function to toggle visibility
  const toggleShowValues = () => {
    const newValue = !showValues;
    setShowValues(newValue);
    sessionStorage.setItem('showFinancialValues', String(newValue));
  };

  return {
    showValues,
    toggleShowValues
  };
}
