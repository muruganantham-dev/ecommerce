import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../redux/slices/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) navigate('/');
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 400 }}>
      <Card>
        <Card.Body>
          <h4 className="mb-3">Login</h4>
          {error && <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>{error}</Alert>}
          <p className="text-muted small mb-3">New here? <Link to="/register">Register</Link> first, then login with that email and password.</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
          <p className="mt-3 mb-0 text-center small">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}
