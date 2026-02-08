import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Badge, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../redux/slices/orderSlice';
import LoadingSpinner from '../components/LoadingSpinner';

export default function OrderHistory() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading && list.length === 0) return <LoadingSpinner />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <h2 className="mb-4">My Orders</h2>
      {list.length === 0 ? (
        <p className="text-muted">No orders yet. <Link to="/products">Start shopping</Link>.</p>
      ) : (
        <Table responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Paid</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o._id}>
                <td className="small">{o._id.slice(-8)}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>₹{o.totalPrice}</td>
                <td><Badge bg={o.status === 'cancelled' ? 'secondary' : o.status === 'delivered' ? 'success' : 'primary'}>{o.status}</Badge></td>
                <td>{o.isPaid ? 'Yes' : 'No'}</td>
                <td><Button as={Link} to={`/orders/${o._id}`} size="sm" variant="outline-primary">View</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
