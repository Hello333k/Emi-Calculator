import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState({ message: '', visible: false });
  
  const showToast = useCallback((message) => {
    setToast({ message, visible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  return { toast, showToast, hideToast };
}

export default useToast;
