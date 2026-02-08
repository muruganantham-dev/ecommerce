import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Badge, Form, Row, Col, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, blockUser, unblockUser, deleteUser, clearAdminError } from '../../redux/slices/adminSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const dispatch = useDispatch();
  const { users, usersPage, usersPages, usersTotal, loading, error } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchUsers({ page, limit: 15, search: search || undefined }));
  }, [dispatch, page, search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await dispatch(deleteUser(deleteId));
    setDeleteId(null);
  };

  if (loading && users.length === 0) return <LoadingSpinner />;

  return (
    <>
      <h4 className="mb-4">Users</h4>
      {error && (
        <div className="alert alert-danger alert-dismissible d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <Button variant="link" className="btn-close" onClick={() => dispatch(clearAdminError())} aria-label="Close" />
        </div>
      )}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control placeholder="Search by name or email" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </Col>
      </Row>
      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone || '-'}</td>
              <td><Badge bg={u.isBlocked ? 'danger' : 'success'}>{u.isBlocked ? 'Blocked' : 'Active'}</Badge></td>
              <td>
                <Button size="sm" as={Link} to={`/admin/users/${u._id}/orders`} variant="outline-primary" className="me-1">Orders</Button>
                {u.isBlocked ? (
                  <Button size="sm" variant="outline-success" onClick={() => dispatch(unblockUser(u._id))}>Unblock</Button>
                ) : (
                  <Button size="sm" variant="outline-warning" className="me-1" onClick={() => dispatch(blockUser(u._id))}>Block</Button>
                )}
                <Button size="sm" variant="outline-danger" onClick={() => setDeleteId(u._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {users.length === 0 && <p className="text-muted">No users.</p>}
      {usersPages > 1 && (
        <div className="d-flex gap-2 align-items-center">
          <Button size="sm" variant="outline-primary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <span>Page {usersPage} of {usersPages} ({usersTotal} total)</span>
          <Button size="sm" variant="outline-primary" disabled={page >= usersPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}

      <Modal show={!!deleteId} onHide={() => setDeleteId(null)}>
        <Modal.Header closeButton><Modal.Title>Delete User</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure? This cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
