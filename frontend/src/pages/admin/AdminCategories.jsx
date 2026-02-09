import { useEffect, useState } from 'react';
import { Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import LoadingButton from '../../components/LoadingButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  clearAdminError,
} from '../../redux/slices/adminSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const emptyForm = { name: '', slug: '', description: '', isActive: 'true', order: '0' };

export default function AdminCategories() {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      isActive: cat.isActive !== false ? 'true' : 'false',
      order: String(cat.order ?? 0),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAdminError());
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description.trim(),
      isActive: form.isActive,
      order: Number(form.order) || 0,
    };
    if (editingId) {
      const result = await dispatch(updateCategory({ id: editingId, ...payload }));
      if (updateCategory.fulfilled.match(result)) setShowModal(false);
    } else {
      const result = await dispatch(createCategory(payload));
      if (createCategory.fulfilled.match(result)) setShowModal(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await dispatch(deleteCategory(deleteId));
    setDeleteId(null);
  };

  if (loading && (!categories || categories.length === 0)) return <LoadingSpinner />;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Categories</h4>
        <Button variant="primary" onClick={openCreate}>Add Category</Button>
      </div>
      {error && (
        <div className="alert alert-danger alert-dismissible py-2">
          {error}
          <Button variant="link" className="btn-close" onClick={() => dispatch(clearAdminError())} aria-label="Close" />
        </div>
      )}
      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Description</th>
            <th>Order</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(categories || []).map((c) => (
            <tr key={c._id}>
              <td className="fw-medium">{c.name}</td>
              <td className="text-muted small">{c.slug || '-'}</td>
              <td className="small text-muted" style={{ maxWidth: 200 }}>{c.description ? (c.description.slice(0, 50) + (c.description.length > 50 ? '...' : '')) : '-'}</td>
              <td>{c.order ?? 0}</td>
              <td>
                <Badge bg={c.isActive !== false ? 'success' : 'secondary'}>{c.isActive !== false ? 'Active' : 'Inactive'}</Badge>
              </td>
              <td>
                <Button size="sm" variant="outline-primary" className="me-1" onClick={() => openEdit(c)}>Edit</Button>
                <Button size="sm" variant="outline-danger" onClick={() => setDeleteId(c._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {(!categories || categories.length === 0) && !loading && (
        <p className="text-muted">No categories yet. Add one to assign to products.</p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit Category' : 'Add Category'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Electronics"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Slug (optional)</Form.Label>
              <Form.Control
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="e.g. electronics"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </Form.Group>
            <div className="d-flex gap-3">
              <Form.Group className="mb-2">
                <Form.Label>Order</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Active</Form.Label>
                <Form.Check
                  type="switch"
                  checked={form.isActive === 'true'}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked ? 'true' : 'false' }))}
                />
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <LoadingButton variant="primary" type="submit" loading={loading} loadingText="Saving...">Save</LoadingButton>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={!!deleteId} onHide={() => setDeleteId(null)}>
        <Modal.Header closeButton><Modal.Title>Delete Category</Modal.Title></Modal.Header>
        <Modal.Body>Remove this category? Products using it will keep the category name but it will no longer appear in the category list.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <LoadingButton variant="danger" onClick={handleDelete} loading={loading} loadingText="Deleting...">Delete</LoadingButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}
