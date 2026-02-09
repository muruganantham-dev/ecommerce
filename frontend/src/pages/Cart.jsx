import { Link } from 'react-router-dom';
import { Table, Button, Form, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, selectCartItems, selectCartTotal } from '../redux/slices/cartSlice';

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">Your cart is empty.</p>
        <Button as={Link} to="/products" variant="primary">Continue Shopping</Button>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-4">Shopping Cart</h2>
      <Table responsive>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.product}>
              <td>{i.name}</td>
              <td>₹{i.price}</td>
              <td>
                <Form.Select
                  style={{ width: 80 }}
                  value={i.quantity}
                  onChange={(e) => dispatch(updateQuantity({ productId: i.product, quantity: e.target.value }))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </Form.Select>
              </td>
              <td>₹{i.price * i.quantity}</td>
              <td>
                <Button size="sm" variant="outline-danger" onClick={() => dispatch(removeFromCart(i.product))}>Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Row>
        <Col md={6}></Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <h5>Total: ₹{total}</h5>
              <Button as={Link} to="/checkout" variant="primary" className="w-100 btn-no-animate">Proceed to Checkout</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
