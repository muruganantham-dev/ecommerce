import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import LoadingButton from '../../components/LoadingButton';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../redux/slices/authSlice';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessDenied, setAccessDenied] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token && user?.role === 'admin') navigate('/admin', { replace: true });
  }, [token, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setAccessDenied(false);
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result) && result.payload?.user?.role === 'admin') {
      navigate('/admin', { replace: true });
    } else if (login.fulfilled.match(result)) {
      setAccessDenied(true);
      dispatch({ type: 'auth/logout' });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card style={{ width: 400 }}>
        <Card.Body>
          <h4 className="mb-3">Admin Login</h4>
          {error && <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>{error}</Alert>}
          {accessDenied && <Alert variant="warning">Access denied. Admin only.</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <LoadingButton type="submit" variant="primary" className="w-100" loading={loading} loadingText="Signing in...">
              Login
            </LoadingButton>
          </Form>
          <p className="mt-3 mb-0 text-center small">
            <a href="/">Back to Store</a>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}
