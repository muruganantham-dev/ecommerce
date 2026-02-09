import { createContext, useContext, useState, useCallback, useRef } from 'react';
import ToastItem from '../components/ToastItem';
import './ToastContext.css';

const ToastContext = createContext(null);

const DEDUPE_MS = 800;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const lastToastRef = useRef({ key: '', at: 0 });

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, variant = 'success') => {
    const key = `${variant}:${message}`;
    const now = Date.now();
    if (lastToastRef.current.key === key && now - lastToastRef.current.at < DEDUPE_MS) return;
    lastToastRef.current = { key, at: now };

    const id = `${now}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const value = {
    showToast,
    success: (msg) => showToast(msg, 'success'),
    error: (msg) => showToast(msg, 'danger'),
    warning: (msg) => showToast(msg, 'warning'),
    info: (msg) => showToast(msg, 'info'),
  };


  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-global-container">
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            message={t.message}
            variant={t.variant}
            onClose={() => removeToast(t.id)}
            delay={3000}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
