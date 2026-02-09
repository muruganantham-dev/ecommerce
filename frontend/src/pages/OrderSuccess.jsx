import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, clearCurrentOrder } from '../redux/slices/orderSlice';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const order = useSelector((s) => s.orders.currentOrder);
  const loading = useSelector((s) => s.orders.loading);

  useEffect(() => {
    dispatch(fetchOrderById(id));
    return () => dispatch(clearCurrentOrder());
  }, [dispatch, id]);

  if (loading || !order) {
    return (
      <div className="order-success-page">
        <div className="order-success-loading">Loading order details...</div>
      </div>
    );
  }

  const total = order.totalPrice ?? 0;

  return (
    <div className="order-success-page">
      <div className="order-success-confetti" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <span key={i} className="order-success-confetti-dot" style={{ '--i': i, '--x': `${15 + (i % 4) * 25}%`, '--y': `${10 + (i % 3) * 35}%` }} />
        ))}
      </div>
      <div className="order-success-card">
        <div className="order-success-icon-wrap">
          <svg className="order-success-icon" viewBox="0 0 52 52">
            <circle className="order-success-icon-circle" cx="26" cy="26" r="24" fill="none" strokeWidth="2" stroke="currentColor" />
            <path className="order-success-icon-path" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 26l8 8 16-20" />
          </svg>
        </div>
        <h1 className="order-success-title">Payment Successful</h1>
        <p className="order-success-sub">Your order has been placed successfully.</p>
        <div className="order-success-details">
          <div className="order-success-row">
            <span className="order-success-label">Order ID</span>
            <span className="order-success-value">{order._id}</span>
          </div>
          <div className="order-success-row">
            <span className="order-success-label">Amount Paid</span>
            <span className="order-success-value">₹{total}</span>
          </div>
        </div>
        <p className="order-success-note">You will receive a WhatsApp confirmation shortly.</p>
        <div className="order-success-actions">
          <Button as={Link} to="/products" variant="success" className="order-success-btn order-success-btn-primary">
            Continue Shopping
          </Button>
          <Button as={Link} to={`/orders/${order._id}`} variant="outline-success" className="order-success-btn">
            View Orders
          </Button>
        </div>
      </div>
    </div>
  );
}
