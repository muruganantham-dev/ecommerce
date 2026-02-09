import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

export default function Home() {
  return (
    <>
      <section className="hero-section mb-5" style={{ background: 'url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop) center/cover' }}>
        <div className="hero-overlay" />
        <Container className="hero-content text-center py-5">
          <h1 className="display-4 fw-bold mb-3" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>
            Welcome to E-Commerce Store
          </h1>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: '540px', opacity: 0.95 }}>
            Shop the latest products with secure payments and instant WhatsApp updates.
          </p>
          <Button
            as={Link}
            to="/products"
            size="lg"
            className="btn-gradient-cta btn-icon btn-icon-right px-4 py-3 rounded-pill"
          >
            Browse Products
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="btn-icon-svg">
              <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
            </svg>
          </Button>
        </Container>
      </section>

      <Container className="py-4">
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="card card-modern border-0 p-4 h-100">
              <div className="mb-2" style={{ fontSize: '2rem' }}>🔒</div>
              <h5 className="fw-bold text-dark">Secure Payment</h5>
              <p className="text-muted small mb-0">Razorpay powered checkout</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card card-modern border-0 p-4 h-100">
              <div className="mb-2" style={{ fontSize: '2rem' }}>📱</div>
              <h5 className="fw-bold text-dark">WhatsApp Alerts</h5>
              <p className="text-muted small mb-0">Order updates on your phone</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card card-modern border-0 p-4 h-100">
              <div className="mb-2" style={{ fontSize: '2rem' }}>🚚</div>
              <h5 className="fw-bold text-dark">Fast Delivery</h5>
              <p className="text-muted small mb-0">Track your orders easily</p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
