import { useEffect, useState } from 'react';
import { Table, Button, Badge, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayments } from '../../redux/slices/adminSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminPayments() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const dispatch = useDispatch();
  const { payments, paymentsPage, paymentsPages, paymentsTotal, loading, error } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchPayments({ page, limit: 15, status: status || undefined }));
  }, [dispatch, page, status]);

  if (loading && payments.length === 0) return <LoadingSpinner />;

  return (
    <>
      <h4 className="mb-4">Payments</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <Row className="mb-3">
        <Col md={3}>
          <Form.Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="created">Created</option>
            <option value="captured">Captured</option>
            <option value="failed">Failed</option>
          </Form.Select>
        </Col>
      </Row>
      <Table responsive>
        <thead>
          <tr>
            <th>Razorpay Order ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id}>
              <td className="small">{p.razorpay_order_id}</td>
              <td>{p.user?.name}</td>
              <td>₹{p.amount}</td>
              <td><Badge bg={p.status === 'captured' ? 'success' : p.status === 'failed' ? 'danger' : 'secondary'}>{p.status}</Badge></td>
              <td>{p.createdAt ? new Date(p.createdAt).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {payments.length === 0 && <p className="text-muted">No payments.</p>}
      {paymentsPages > 1 && (
        <div className="d-flex gap-2 align-items-center">
          <Button size="sm" variant="outline-primary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <span>Page {paymentsPage} of {paymentsPages} ({paymentsTotal} total)</span>
          <Button size="sm" variant="outline-primary" disabled={page >= paymentsPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}
      <p className="small text-muted mt-3">Refund management: handle via Razorpay Dashboard or implement refund API as needed.</p>
    </>
  );
}
