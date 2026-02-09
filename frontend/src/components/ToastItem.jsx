import { useEffect } from 'react';
import { Toast } from 'react-bootstrap';

const ICONS = {
  success: (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  ),
  danger: (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  ),
  warning: (
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  ),
  info: (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  ),
  primary: (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  ),
};

const LABELS = {
  success: 'Success',
  danger: 'Error',
  warning: 'Warning',
  info: 'Info',
  primary: 'Success',
};

export default function ToastItem({ message, variant, onClose, delay = 3000, hideLabel = false }) {
  useEffect(() => {
    const t = setTimeout(onClose, delay);
    return () => clearTimeout(t);
  }, [delay, onClose]);

  const v = variant;
  const icon = ICONS[variant] ?? ICONS.info;

  if (hideLabel || variant === 'primary') {
    return (
      <Toast className={`toast-item toast-item-${v}`} onClose={onClose}>
        <Toast.Body className="toast-item-body d-flex align-items-center gap-2">
          <svg className="toast-item-icon flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            {icon}
          </svg>
          <span className="flex-grow-1">{message}</span>
          <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close" />
        </Toast.Body>
      </Toast>
    );
  }

  const label = LABELS[variant] ?? 'Info';
  return (
    <Toast className={`toast-item toast-item-${v}`} onClose={onClose}>
      <Toast.Header closeButton className="toast-item-header">
        <svg className="toast-item-icon me-2" viewBox="0 0 24 24" fill="currentColor">
          {icon}
        </svg>
        <strong className="me-auto">{label}</strong>
      </Toast.Header>
      <Toast.Body className="toast-item-body">{message}</Toast.Body>
    </Toast>
  );
}
