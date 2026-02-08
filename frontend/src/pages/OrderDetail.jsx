import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, ListGroup, Button, Badge, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, cancelOrder } from '../redux/slices/orderSlice';
import LoadingSpinner from '../components/LoadingSpinner';

export default function OrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const order = useSelector((s) => s.orders.currentOrder);
  const loading = useSelector((s) => s.orders.loading);
  const error = useSelector((s) => s.orders.error);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const handleCancel = () => {
    if (window.confirm('Cancel this order?')) dispatch(cancelOrder(id));
  };

  if (loading && !order) return <LoadingSpinner />;
  if (error || !order) return <Alert variant="danger">{error || 'Order not found.'}</Alert>;

  const canCancel = !order.isPaid && order.status === 'pending';

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Order {order._id.slice(-8)}</h2>
        <Badge bg={order.status === 'cancelled' ? 'secondary' : order.status === 'delivered' ? 'success' : 'primary'}>{order.status}</Badge>
      </div>
      <Card className="mb-3">
        <Card.Header>Items</Card.Header>
        <ListGroup variant="flush">
          {order.orderItems?.map((i, idx) => (
            <ListGroup.Item key={idx}>{i.name} x{i.quantity} @ ₹{i.price} = ₹{i.quantity * i.price}</ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
      <Card className="mb-3">
        <Card.Header>Shipping</Card.Header>
        <Card.Body>
          {order.shippingAddress?.name}<br />
          {order.shippingAddress?.phone}<br />
          {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
        </Card.Body>
      </Card>
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between"><span>Items</span><span>₹{order.itemsPrice}</span></div>
          <div className="d-flex justify-content-between"><span>Tax</span><span>₹{order.taxPrice}</span></div>
          <div className="d-flex justify-content-between"><span>Shipping</span><span>₹{order.shippingPrice}</span></div>
          <div className="d-flex justify-content-between fw-bold"><span>Total</span><span>₹{order.totalPrice}</span></div>
          {order.isPaid && <p className="small text-muted mt-2">Paid on {new Date(order.paidAt).toLocaleString()}</p>}
        </Card.Body>
      </Card>
      {canCancel && <Button variant="outline-danger" onClick={handleCancel}>Cancel Order</Button>}
      <Button as={Link} to="/orders" variant="link" className="ms-2">Back to Orders</Button>
    </>
  );
}
