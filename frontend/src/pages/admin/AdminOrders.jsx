import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Badge, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../redux/slices/adminSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const dispatch = useDispatch();
  const { orders, ordersPage, ordersPages, ordersTotal, loading, error } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchOrders({ page, limit: 15, status: status || undefined }));
  }, [dispatch, page, status]);

  if (loading && orders.length === 0) return <LoadingSpinner />;

  return (
    <>
      <h4 className="mb-4">Orders</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <Row className="mb-3">
        <Col md={3}>
          <Form.Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </Col>
      </Row>
      <Table responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Paid</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td className="small">{o._id?.slice(-8)}</td>
              <td>{o.user?.name}</td>
              <td>₹{o.totalPrice}</td>
              <td><Badge bg={o.status === 'cancelled' ? 'secondary' : o.status === 'delivered' ? 'success' : 'primary'}>{o.status}</Badge></td>
              <td>{o.isPaid ? 'Yes' : 'No'}</td>
              <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-'}</td>
              <td><Button size="sm" as={Link} to={`/admin/orders/${o._id}`}>View</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
      {orders.length === 0 && <p className="text-muted">No orders.</p>}
      {ordersPages > 1 && (
        <div className="d-flex gap-2 align-items-center">
          <Button size="sm" variant="outline-primary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <span>Page {ordersPage} of {ordersPages} ({ordersTotal} total)</span>
          <Button size="sm" variant="outline-primary" disabled={page >= ordersPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}
    </>
  );
}
