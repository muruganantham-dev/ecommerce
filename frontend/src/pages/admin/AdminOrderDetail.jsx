import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, ListGroup, Button, Form, Badge } from 'react-bootstrap';
import LoadingButton from '../../components/LoadingButton';
import api from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrderStatus } from '../../redux/slices/adminSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api.get(`/admin/orders/${id}`)
      .then((r) => {
        setOrder(r.data.order);
        setStatus(r.data.order?.status || '');
      })
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (status === order?.status) return;
    setUpdating(true);
    const result = await dispatch(updateOrderStatus({ id, status }));
    setUpdating(false);
    if (updateOrderStatus.fulfilled.match(result)) setOrder(result.payload);
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return <p className="text-danger">Order not found.</p>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Order {order._id?.slice(-8)}</h4>
        <Badge bg="secondary">{order.status}</Badge>
        <Button variant="outline-secondary" size="sm" onClick={() => navigate('/admin/orders')}>Back</Button>
      </div>
      <div className="row">
        <div className="col-md-8">
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
              {order.shippingAddress?.name}, {order.shippingAddress?.phone}<br />
              {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="mb-3">
            <Card.Header>Update Status</Card.Header>
            <Card.Body>
              <Form onSubmit={handleUpdateStatus}>
                <Form.Select value={status} onChange={(e) => setStatus(e.target.value)} className="mb-2">
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Form.Select>
                <LoadingButton type="submit" size="sm" loading={updating} loadingText="Updating..." disabled={status === order.status}>
                  Update (sends WhatsApp)
                </LoadingButton>
              </Form>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <p className="mb-1">Items: ₹{order.itemsPrice}</p>
              <p className="mb-1">Tax: ₹{order.taxPrice}</p>
              <p className="mb-1">Shipping: ₹{order.shippingPrice}</p>
              <p className="fw-bold">Total: ₹{order.totalPrice}</p>
              {order.isPaid && <p className="small text-muted">Paid on {order.paidAt ? new Date(order.paidAt).toLocaleString() : '-'}</p>}
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}
