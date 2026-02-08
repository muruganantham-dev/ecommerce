import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Table, Badge, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from '../../redux/slices/adminSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { dashboard, loading, error } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading && !dashboard) return <LoadingSpinner />;
  if (error) return <div className="text-danger">{error}</div>;

  const stats = dashboard?.stats || {};
  const recent = stats.recentOrders || [];

  return (
    <>
      <h4 className="mb-4">Dashboard</h4>
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title className="small text-muted">Total Users</Card.Title>
              <h3>{stats.totalUsers ?? 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title className="small text-muted">Total Orders</Card.Title>
              <h3>{stats.totalOrders ?? 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title className="small text-muted">Total Revenue</Card.Title>
              <h3>₹{stats.totalRevenue ?? 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title className="small text-muted">Recent</Card.Title>
              <h3>{recent.length} orders</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>Recent Orders</span>
          <Link to="/admin/orders">View all</Link>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o._id}>
                  <td className="small">{o._id?.slice(-8)}</td>
                  <td>{o.user?.name}</td>
                  <td>₹{o.totalPrice}</td>
                  <td><Badge bg="secondary">{o.status}</Badge></td>
                  <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-'}</td>
                  <td><Link to={`/admin/orders/${o._id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </Table>
          {recent.length === 0 && <p className="text-center text-muted py-3 mb-0">No orders yet.</p>}
        </Card.Body>
      </Card>
    </>
  );
}
