import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Row, Col, Alert, ListGroup } from 'react-bootstrap';
import LoadingButton from '../components/LoadingButton';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import { openRazorpayCheckout, hideRazorpayModal } from '../services/razorpay';
import { createOrder, clearOrderError } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';
import { selectCartItems, selectCartTotal } from '../redux/slices/cartSlice';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const user = useSelector((s) => s.auth.user);
  const { loading, error, currentOrder } = useSelector((s) => s.orders);
  const [paymentRedirecting, setPaymentRedirecting] = useState(false);
  const [shipping, setShipping] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (cartItems.length === 0 && !currentOrder) navigate('/cart');
  }, [cartItems.length, currentOrder, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    dispatch(clearOrderError());
    const orderData = {
      orderItems: cartItems.map((i) => ({ product: i.product, quantity: i.quantity })),
      shippingAddress: shipping,
    };
    const result = await dispatch(createOrder(orderData));
    const order = result.payload;
    if (result.error || !order) return;
    const orderId = order?._id ?? order?.id;
    if (!orderId) {
      navigate('/order-failure', { state: { error: 'Order was created but could not start payment. Please try again from Orders.' } });
      return;
    }
    try {
      const { data } = await api.post('/payments/create-order', { orderId });
      const payment = await openRazorpayCheckout({
        keyId: data.keyId,
        orderId: data.orderId,
        amount: data.amount,
        currency: data.currency,
        onFailure: () => {
          setPaymentRedirecting(true);
          hideRazorpayModal();
          api.post('/payments/notify-failure', { orderId: order._id, failureMessage: 'Payment failed or cancelled.' }).catch(() => {});
          setTimeout(() => {
            navigate('/order-failure', {
              state: { error: 'Payment Failed. Please try again.' },
            });
          }, 3000);
        },
      });
      if (payment.success) {
        const verify = await api.post('/payments/verify', {
          razorpay_order_id: payment.razorpay_order_id,
          razorpay_payment_id: payment.razorpay_payment_id,
          razorpay_signature: payment.razorpay_signature,
        });
        if (verify.data.success) {
          dispatch(clearCart());
          navigate(`/order-success/${order._id}`);
        } else {
          setPaymentRedirecting(true);
          hideRazorpayModal();
          api.post('/payments/notify-failure', { orderId: order._id, failureMessage: 'Payment verification failed.' }).catch(() => {});
          setTimeout(() => {
            navigate('/order-failure', {
              state: { error: 'Payment verification failed. Please try again.' },
            });
          }, 3000);
        }
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (Array.isArray(err.response?.data?.errors) ? err.response.data.errors[0] : null) ||
        err.message;
      setPaymentRedirecting(true);
      hideRazorpayModal();
      api.post('/payments/notify-failure', { orderId: order._id, failureMessage: msg || 'Payment failed.' }).catch(() => {});
      setTimeout(() => {
        navigate('/order-failure', {
          state: { error: typeof msg === 'string' && msg ? msg : 'Payment Failed. Please try again.' },
        });
      }, 3000);
    }
  };

  if (cartItems.length === 0 && !currentOrder) return null;

  return (
    <>
      <h2 className="mb-4">Checkout</h2>
      {paymentRedirecting && (
        <Alert variant="warning" className="d-flex align-items-center gap-2">
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          Payment failed. Redirecting...
        </Alert>
      )}
      {error && (
        <Alert variant="danger" onClose={() => dispatch(clearOrderError())} dismissible>
          {error}
        </Alert>
      )}
      <Form onSubmit={handlePlaceOrder}>
        <Row>
          <Col md={8}>
            <Card className="mb-4 checkout-shipping-card">
              <Card.Header>Shipping Address</Card.Header>
              <Card.Body>
                <Form.Group className="mb-2">
                  <Form.Label>Name</Form.Label>
                  <Form.Control required value={shipping.name} onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Phone (for WhatsApp)</Form.Label>
                  <Form.Control required type="tel" value={shipping.phone} onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))} placeholder="10-digit mobile" />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Address</Form.Label>
                  <Form.Control required value={shipping.street} onChange={(e) => setShipping((s) => ({ ...s, street: e.target.value }))} placeholder="Street, building" />
                </Form.Group>
                <Row>
                  <Col><Form.Group className="mb-2"><Form.Label>City</Form.Label><Form.Control required value={shipping.city} onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))} /></Form.Group></Col>
                  <Col><Form.Group className="mb-2"><Form.Label>State</Form.Label><Form.Control value={shipping.state} onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value }))} /></Form.Group></Col>
                  <Col><Form.Group className="mb-2"><Form.Label>Pincode</Form.Label><Form.Control required value={shipping.pincode} onChange={(e) => setShipping((s) => ({ ...s, pincode: e.target.value }))} /></Form.Group></Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header>Order Summary</Card.Header>
              <ListGroup variant="flush" className="order-summary-list">
                {cartItems.map((i) => (
                  <ListGroup.Item key={i.product} className="d-flex justify-content-between align-items-center">
                    <span className="text-start">{i.name} x{i.quantity}</span>
                    <span className="text-end order-summary-price">₹{i.price * i.quantity}</span>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span>Subtotal</span>
                  <span className="text-end order-summary-price">₹{cartTotal}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center fw-bold">
                  <span>Total</span>
                  <span className="text-end order-summary-price">₹{cartTotal + (cartTotal > 500 ? 0 : 40) + Math.round(cartTotal * 0.05)}</span>
                </ListGroup.Item>
              </ListGroup>
              <Card.Footer>
                <LoadingButton type="submit" variant="primary" className="w-100 btn-no-animate" loading={loading} loadingText="Creating order...">
                  Place Order
                </LoadingButton>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Form>
    </>
  );
}
