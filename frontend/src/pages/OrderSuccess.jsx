import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, clearCurrentOrder } from '../redux/slices/orderSlice';

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
    return <div className="text-center py-5">Loading order details...</div>;
  }

  return (
    <div className="text-center py-4">
      <Card className="mx-auto" style={{ maxWidth: 500 }}>
        <Card.Body>
          <div className="text-success mb-3 fs-1">✓</div>
          <h4>Order Placed Successfully</h4>
          <p className="text-muted">Order ID: <strong>{order._id}</strong></p>
          <p>Amount paid: ₹{order.totalPrice}. You will receive a WhatsApp confirmation shortly.</p>
          <Button as={Link} to={`/orders/${order._id}`} variant="primary" className="me-2">View Order</Button>
          <Button as={Link} to="/products" variant="outline-primary">Continue Shopping</Button>
        </Card.Body>
      </Card>
    </div>
  );
}
