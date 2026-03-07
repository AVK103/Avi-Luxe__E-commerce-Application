import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);
const DEFAULT_DURATION = 3200;

const normalizeToast = (payload, options) => {
  if (typeof payload === "string") {
    return {
      title: options?.title || "",
      message: payload,
      type: options?.type || "info",
      duration: Number(options?.duration) || DEFAULT_DURATION,
    };
  }

  return {
    title: payload?.title || "",
    message: payload?.message || "Notification",
    type: payload?.type || "info",
    duration: Number(payload?.duration) || DEFAULT_DURATION,
  };
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timeoutRefs = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
    const timeoutId = timeoutRefs.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (payload, options) => {
      const normalized = normalizeToast(payload, options);
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const toast = { id, ...normalized };

      setToasts((prev) => [toast, ...prev].slice(0, 4));

      const timeoutId = setTimeout(() => {
        removeToast(id);
      }, toast.duration);

      timeoutRefs.current.set(id, timeoutId);
      return id;
    },
    [removeToast]
  );

  const clearToasts = useCallback(() => {
    timeoutRefs.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutRefs.current.clear();
    setToasts([]);
  }, []);

  useEffect(() => () => clearToasts(), [clearToasts]);

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      removeToast,
      clearToasts,
    }),
    [toasts, showToast, removeToast, clearToasts]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export default ToastContext;
