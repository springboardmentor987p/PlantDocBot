import { useState, useCallback } from "react";

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = "default", action }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, description, variant, action }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000); // Toast disappears after 3 seconds
  }, []);

  return { toasts, toast };
};
