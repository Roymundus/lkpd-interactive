import { useState, useEffect } from 'react';

export const useAutoSave = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch (error) {
      console.error('Gagal memuat dari LocalStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Gagal menyimpan ke LocalStorage:', error);
    }
  }, [key, value]);

  const clearDraft = () => {
    localStorage.removeItem(key);
    setValue(initialValue);
  };

  return [value, setValue, clearDraft];
};