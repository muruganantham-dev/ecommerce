import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Badge, Form, Row, Col, Spinner, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  deleteProduct,
  toggleProductActive,
  clearAdminError,
} from '../../redux/slices/adminSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const dispatch = useDispatch();
  const { products, productsPage, productsPages, productsTotal, loading, error } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: 15, search: search || undefined }));
  }, [dispatch, page, search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await dispatch(deleteProduct(deleteId));
    setDeleteId(null);
  };

  if (loading && products.length === 0) return <LoadingSpinner />;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Products</h4>
        <Button as={Link} to="/admin/products/new" variant="primary">Add Product</Button>
      </div>
      {error && (
        <div className="alert alert-danger alert-dismissible py-2">
          {error}
          <Button variant="link" className="btn-close" onClick={() => dispatch(clearAdminError())} aria-label="Close" />
        </div>
      )}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </Col>
      </Row>
      <Table responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>
                <img src={p.image || 'https://via.placeholder.com/50'} alt="" style={{ width: 50, height: 50, objectFit: 'cover' }} />
              </td>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>{p.category || '-'}</td>
              <td>
                <Badge bg={p.isActive ? 'success' : 'secondary'}>{p.isActive ? 'Active' : 'Inactive'}</Badge>
              </td>
              <td>
                <Button size="sm" variant="outline-primary" as={Link} to={`/admin/products/${p._id}/edit`} className="me-1">Edit</Button>
                <Button size="sm" variant="outline-warning" className="me-1" onClick={() => dispatch(toggleProductActive(p._id))}>Toggle</Button>
                <Button size="sm" variant="outline-danger" onClick={() => setDeleteId(p._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {products.length === 0 && <p className="text-muted">No products.</p>}
      {productsPages > 1 && (
        <div className="d-flex gap-2 align-items-center">
          <Button size="sm" variant="outline-primary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <span>Page {productsPage} of {productsPages} ({productsTotal} total)</span>
          <Button size="sm" variant="outline-primary" disabled={page >= productsPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}

      <Modal show={!!deleteId} onHide={() => setDeleteId(null)}>
        <Modal.Header closeButton><Modal.Title>Delete Product</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
