import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import LoadingButton from '../../components/LoadingButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProduct,
  createProduct,
  updateProduct,
  clearProduct,
  clearAdminError,
} from '../../redux/slices/adminSlice';
import adminApi from '../../services/adminApi';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((s) => s.admin);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    mrp: '',
    discount: '0',
    category: '',
    stock: '0',
    isActive: 'true',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    adminApi.getCategories().then((r) => setCategories(r.data.categories || []));
  }, []);

  useEffect(() => {
    if (isEdit) dispatch(fetchProduct(id));
    else dispatch(clearProduct());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (product && isEdit) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: String(product.price ?? ''),
        mrp: product.mrp != null && product.mrp !== '' ? String(product.mrp) : '',
        discount: String(product.discount ?? '0'),
        category: product.category || '',
        stock: String(product.stock ?? '0'),
        isActive: product.isActive !== false ? 'true' : 'false',
      });
      setImagePreview(product.image || '');
    }
  }, [product, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAdminError());
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('mrp', form.mrp);
    formData.append('discount', form.discount);
    formData.append('category', form.category);
    formData.append('stock', form.stock);
    formData.append('isActive', form.isActive);
    if (imageFile) formData.append('image', imageFile);
    if (isEdit) {
      const result = await dispatch(updateProduct({ id, formData }));
      if (updateProduct.fulfilled.match(result)) navigate('/admin/products');
    } else {
      const result = await dispatch(createProduct(formData));
      if (createProduct.fulfilled.match(result)) navigate('/admin/products');
    }
  };

  if (isEdit && loading && !product) return <LoadingSpinner />;

  return (
    <>
      <h4 className="mb-4">{isEdit ? 'Edit Product' : 'Add Product'}</h4>
      {error && <Alert variant="danger" dismissible onClose={() => dispatch(clearAdminError())}>{error}</Alert>}
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Name *</Form.Label>
              <Form.Control name="name" required value={form.name} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={2} name="description" value={form.description} onChange={handleChange} />
            </Form.Group>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>MRP (optional)</Form.Label>
                  <Form.Control type="number" step="0.01" min="0" name="mrp" placeholder="Max retail price" value={form.mrp} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>Offer price *</Form.Label>
                  <Form.Control type="number" step="0.01" min="0" name="price" required value={form.price} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>Discount %</Form.Label>
                  <Form.Control type="number" min="0" max="100" name="discount" value={form.discount} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control type="number" min="0" name="stock" value={form.stock} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-2">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={form.category} onChange={handleChange}>
                <option value="">-- Select category --</option>
                {(categories || []).map((c) => (
                  <option key={c._id || c} value={typeof c === 'object' ? c.name : c}>
                    {typeof c === 'object' ? c.name : c}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
              {imagePreview && <img src={imagePreview} alt="" className="mt-2" style={{ maxHeight: 120 }} />}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check type="switch" name="isActive" label="Active" checked={form.isActive === 'true'} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked ? 'true' : 'false' }))} />
            </Form.Group>
            <LoadingButton type="submit" variant="primary" loading={loading} loadingText="Saving...">Save</LoadingButton>
            <Button type="button" variant="secondary" className="ms-2" onClick={() => navigate('/admin/products')}>Cancel</Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
