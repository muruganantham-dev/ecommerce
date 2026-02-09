import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Offcanvas, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useToast } from '../../contexts/ToastContext';

const navItems = [
  { to: '/admin', end: true, label: 'Dashboard' },
  { to: '/admin/categories', end: false, label: 'Categories' },
  { to: '/admin/products', end: false, label: 'Products' },
  { to: '/admin/orders', end: false, label: 'Orders' },
  { to: '/admin/users', end: false, label: 'Users' },
  { to: '/admin/payments', end: false, label: 'Payments' },
  { to: '/admin/analytics', end: false, label: 'Analytics' },
];

export default function AdminLayout() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const { showToast } = useToast();

  const handleLogout = () => {
    showToast('Logged out successfully', 'primary');
    dispatch(logout());
    navigate('/admin/login');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="md" className="mb-3">
        <Container fluid>
          <Navbar.Toggle aria-controls="admin-nav" onClick={() => setShow(true)} />
          <Navbar.Brand as={Link} to="/admin">Admin</Navbar.Brand>
          <Navbar.Collapse id="admin-nav">
            <Nav className="me-auto">
              {navItems.map(({ to, end, label }) => (
                <Nav.Link as={NavLink} to={to} end={end} key={to}>{label}</Nav.Link>
              ))}
            </Nav>
            <Nav>
              <Navbar.Text className="me-2">{user?.name}</Navbar.Text>
              <Button size="sm" variant="outline-light" onClick={handleLogout}>Logout</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={() => setShow(false)} placement="start">
        <Offcanvas.Header closeButton><Offcanvas.Title>Admin</Offcanvas.Title></Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {navItems.map(({ to, end, label }) => (
              <Nav.Link as={NavLink} to={to} end={end} key={to} onClick={() => setShow(false)}>{label}</Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <Container fluid className="px-4">
        <Outlet />
      </Container>
    </>
  );
}
