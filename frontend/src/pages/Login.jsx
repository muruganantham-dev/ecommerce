import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Card, Alert } from 'react-bootstrap';
import LoadingButton from '../components/LoadingButton';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../redux/slices/authSlice';
import { useToast } from '../contexts/ToastContext';
import '../styles/form-validation.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { loading, error } = useSelector((s) => s.auth);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!EMAIL_REGEX.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setTouched({ email: true, password: true });
    if (!validate()) return;
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      showToast('Login Successful', 'primary');
      setTimeout(() => navigate('/'), 400);
    }
  };

  const handleBlur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

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
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((er) => ({ ...er, email: null })); }}
                onBlur={handleBlur('email')}
                isInvalid={touched.email && errors.email}
              />
              {touched.email && errors.email && (
                <Form.Text className="form-validation-error">{errors.email}</Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((er) => ({ ...er, password: null })); }}
                onBlur={handleBlur('password')}
                isInvalid={touched.password && errors.password}
              />
              {touched.password && errors.password && (
                <Form.Text className="form-validation-error">{errors.password}</Form.Text>
              )}
            </Form.Group>
            <LoadingButton type="submit" variant="primary" className="w-100 rounded-pill px-4" loading={loading} loadingText="Signing in...">
              Login
            </LoadingButton>
          </Form>
          <p className="mt-3 mb-0 text-center small">
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}
