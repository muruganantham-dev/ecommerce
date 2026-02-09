import { useEffect, useState } from 'react';
import './AddToCartSuccessPopup.css';

export default function AddToCartSuccessPopup({ show, onClose }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!show) return;
    let t2;
    const t1 = setTimeout(() => {
      setClosing(true);
      t2 = setTimeout(() => onClose?.(), 250);
    }, 3000);
    return () => {
      clearTimeout(t1);
      if (t2) clearTimeout(t2);
    };
  }, [show, onClose]);

  useEffect(() => {
    if (show) {
      setClosing(false);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [show]);

  if (!show) return null;

  return (
    <div className={`add-to-cart-popup-overlay ${closing ? 'add-to-cart-popup-closing' : ''}`} onClick={onClose}>
      <div className="add-to-cart-popup-card" onClick={(e) => e.stopPropagation()}>
        <div className="add-to-cart-popup-tick-wrap">
          <svg className="add-to-cart-popup-tick" viewBox="0 0 52 52">
            <circle className="add-to-cart-popup-tick-circle" cx="26" cy="26" r="24" fill="none" strokeWidth="2" stroke="#10b981" />
            <path className="add-to-cart-popup-tick-path" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 26l8 8 16-20" />
          </svg>
        </div>
        <p className="add-to-cart-popup-msg">Added to Cart Successfully</p>
      </div>
    </div>
  );
}
