import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Card, Alert } from 'react-bootstrap';
import LoadingButton from '../components/LoadingButton';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../redux/slices/authSlice';
import { useToast } from '../contexts/ToastContext';
import '../styles/form-validation.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { loading, error } = useSelector((s) => s.auth);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!EMAIL_REGEX.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    if (!validate()) return;
    const result = await dispatch(register({ name, email, password, phone }));
    if (register.fulfilled.match(result)) {
      showToast('Registered Successfully', 'primary');
      setTimeout(() => navigate('/'), 400);
    }
  };

  const handleBlur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  return (
    <div className="mx-auto" style={{ maxWidth: 400 }}>
      <Card>
        <Card.Body>
          <h4 className="mb-3">Register</h4>
          {error && <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((er) => ({ ...er, name: null })); }}
                onBlur={handleBlur('name')}
                isInvalid={touched.name && errors.name}
              />
              {touched.name && errors.name && (
                <Form.Text className="form-validation-error">{errors.name}</Form.Text>
              )}
            </Form.Group>
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
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((er) => ({ ...er, password: null, confirmPassword: null })); }}
                onBlur={handleBlur('password')}
                isInvalid={touched.password && errors.password}
              />
              {touched.password && errors.password && (
                <Form.Text className="form-validation-error">{errors.password}</Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors((er) => ({ ...er, confirmPassword: null })); }}
                onBlur={handleBlur('confirmPassword')}
                isInvalid={touched.confirmPassword && errors.confirmPassword}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Form.Text className="form-validation-error">{errors.confirmPassword}</Form.Text>
              )}
            </Form.Group>
            <LoadingButton type="submit" variant="primary" className="w-100 rounded-pill px-4" loading={loading} loadingText="Creating account...">
              Register
            </LoadingButton>
          </Form>
          <p className="mt-3 mb-0 text-center small">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}
