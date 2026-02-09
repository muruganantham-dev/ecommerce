import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductPrice from '../components/ProductPrice';
import AddToCartSuccessPopup from '../components/AddToCartSuccessPopup';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const product = useSelector((s) => s.products.selectedProduct);
  const loading = useSelector((s) => s.products.loading);
  const error = useSelector((s) => s.products.error);
  const [qty, setQty] = useState(1);
  const [showCartPopup, setShowCartPopup] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ product: product._id, name: product.name, price: product.price, image: product.image, quantity: qty }));
    setShowCartPopup(true);
  };

  const handleCartPopupClose = () => {
    setShowCartPopup(false);
    navigate('/cart');
  };

  if (loading && !product) return <LoadingSpinner />;
  if (error || !product) return <Alert variant="danger">{error || 'Product not found.'}</Alert>;

  return (
    <Card>
      <div className="row g-0">
        <div className="col-md-4">
          <Card.Img src={product.image || 'https://via.placeholder.com/400x300'} alt={product.name} className="img-fluid rounded-start" style={{ objectFit: 'cover', height: '100%' }} />
        </div>
        <div className="col-md-8">
          <Card.Body>
            {product.category && (
              <span className="product-category-badge mb-2 d-inline-block">{product.category}</span>
            )}
            <Card.Title>{product.name}</Card.Title>
            <Card.Text className="text-muted">{product.description}</Card.Text>
            <ProductPrice product={product} variant="detail" />
            <p className="small">Stock: {product.stock}</p>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Select style={{ width: 100 }} value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {[...Array(Math.min(10, product.stock || 1))].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" onClick={handleAddToCart} disabled={!product.stock}>
              Add to Cart
            </Button>
          </Card.Body>
        </div>
      </div>
      <AddToCartSuccessPopup show={showCartPopup} onClose={handleCartPopupClose} />
    </Card>
  );
}
