import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Row, Col, Form, Card, Button, Alert, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductPrice from '../components/ProductPrice';
import AddToCartSuccessPopup from '../components/AddToCartSuccessPopup';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const dispatch = useDispatch();
  const { list, categories, loading, error, pages, total } = useSelector((s) => s.products);

  // Only fetch categories once when not already loaded (avoids duplicate requests + rate limit)
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    const params = { page, limit: 12 };
    if (search) params.search = search;
    if (category) params.category = category;
    setSearchParams(params, { replace: true });
    dispatch(fetchProducts(params));
  }, [dispatch, page, search, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const params = { page: 1 };
    if (search) params.search = search;
    if (category) params.category = category;
    setSearchParams(params);
    dispatch(fetchProducts(params));
  };

  if (loading && list.length === 0) return <LoadingSpinner />;

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h2 className="fw-bold mb-0 text-gradient">Products</h2>
        <Form onSubmit={handleSearch} className="d-flex flex-wrap gap-2">
          <InputGroup className="rounded-modern shadow-sm" style={{ minWidth: 200, maxWidth: 360 }}>
            <Form.Control
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Form.Select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              style={{ width: 'auto', maxWidth: 140 }}
            >
              <option value="">All categories</option>
              {(categories || []).map((c) => {
                const name = typeof c === 'object' ? c.name : c;
                const id = typeof c === 'object' ? c._id : c;
                return <option key={id} value={name}>{name}</option>;
              })}
            </Form.Select>
            <Button type="submit" className="btn-gradient-primary px-3">
              Search
            </Button>
          </InputGroup>
        </Form>
      </div>

      {error && <Alert variant="danger" className="rounded-modern">{error}</Alert>}

      <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
        {list.map((p) => (
          <Col key={p._id}>
            <Card className="card-product">
              <div className="card-img-wrap position-relative">
                {((p.mrp != null && p.mrp > p.price) || (p.discount > 0 && p.price > 0)) && <span className="ribbon-sale">Sale</span>}
                <Card.Img
                  variant="top"
                  src={p.image || 'https://via.placeholder.com/300x220?text=Product'}
                  alt={p.name}
                />
              </div>
              <Card.Body className="d-flex flex-column">
                {p.category && (
                  <span className="product-category-badge mb-2">{p.category}</span>
                )}
                <Card.Title className="fw-bold text-dark small mb-2" style={{ minHeight: '2.5rem' }}>
                  {p.name}
                </Card.Title>
                <Card.Text className="text-muted small flex-grow-1 mb-3" style={{ fontSize: '0.85rem' }}>
                  {p.description ? (p.description.slice(0, 60) + (p.description.length > 60 ? '...' : '')) : 'No description'}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <ProductPrice product={p} variant="compact" />
                  <Button
                    size="sm"
                    className="btn-add-cart"
                    onClick={() => {
                      dispatch(addToCart({ product: p._id, name: p.name, price: p.price, image: p.image }));
                      setShowCartPopup(true);
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {list.length === 0 && !loading && (
        <div className="text-center py-5">
          <p className="text-muted mb-3">No products found.</p>
          <Button as={Link} to="/products" variant="outline-primary" className="rounded-pill">
            Clear filters
          </Button>
        </div>
      )}

      <AddToCartSuccessPopup show={showCartPopup} onClose={() => setShowCartPopup(false)} />

      {pages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-5 flex-wrap">
          <Button
            variant="outline-primary"
            className="rounded-pill px-4"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="text-muted fw-medium">
            Page {page} of {pages} <span className="text-dark">({total} items)</span>
          </span>
          <Button
            variant="outline-primary"
            className="rounded-pill px-4"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}
