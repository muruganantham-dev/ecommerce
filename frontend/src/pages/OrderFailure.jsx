import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './OrderFailure.css';

export default function OrderFailure() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const errorMsg = state?.error || 'Payment Failed. Please try again.';

  return (
    <div className="order-failure-page">
      <div className="order-failure-card">
        <div className="order-failure-icon-wrap">
          <svg className="order-failure-icon" viewBox="0 0 52 52" aria-hidden="true">
            <circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="2" />
            <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M16 16l20 20M36 16L16 36" />
          </svg>
        </div>
        <h1 className="order-failure-title">Payment Failed</h1>
        <p className="order-failure-msg">{errorMsg}</p>
        <div className="order-failure-actions">
          <Button onClick={() => navigate('/checkout')} variant="danger" className="order-failure-btn order-failure-btn-primary">
            Retry Payment
          </Button>
          <Button as={Link} to="/cart" variant="outline-danger" className="order-failure-btn">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
