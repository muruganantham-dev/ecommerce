import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Button } from 'react-bootstrap';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminUserOrders() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/admin/users/${id}`),
      api.get(`/admin/users/${id}/orders`),
    ])
      .then(([u, o]) => {
        setUser(u.data.user);
        setOrders(o.data.orders || []);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <p className="text-danger">User not found.</p>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Orders for {user.name}</h4>
        <Button variant="outline-secondary" size="sm" onClick={() => navigate('/admin/users')}>Back to Users</Button>
      </div>
      <Card>
        <Card.Body className="p-0">
          <Table responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="small">{o._id?.slice(-8)}</td>
                  <td>₹{o.totalPrice}</td>
                  <td>{o.status}</td>
                  <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-'}</td>
                  <td><Button size="sm" variant="link" onClick={() => navigate(`/admin/orders/${o._id}`)}>View</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
          {orders.length === 0 && <p className="text-center text-muted py-3 mb-0">No orders.</p>}
        </Card.Body>
      </Card>
    </>
  );
}
