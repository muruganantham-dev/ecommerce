import { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useToast } from '../contexts/ToastContext';
import { selectCartCount } from '../redux/slices/cartSlice';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((s) => s.auth);
  const cartCount = useSelector(selectCartCount);
  const { showToast } = useToast();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    showToast('Logged out successfully', 'primary');
    dispatch(logout());
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    'nav-link px-3 py-2 rounded-pill mx-1 transition-smooth ' + (isActive ? 'bg-white bg-opacity-25 text-white fw-semibold' : 'text-white text-opacity-90');

  const navbarClass = 'mb-0 py-2 sticky-top transition-smooth' + (scrolled ? ' navbar-scrolled' : '');

  return (
    <Navbar
      expand="md"
      className={navbarClass}
      style={{
        background: 'var(--nav-gradient)',
        borderBottom: scrolled ? 'none' : '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center text-white fw-bold fs-5"
        >
          <span className="me-2">🛒</span>
          E-Commerce
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbar-nav"
          className="border-0 text-white"
          style={{ boxShadow: 'none' }}
        />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end className={navLinkClass}>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/products" className={navLinkClass}>
              Products
            </Nav.Link>
            <Nav.Link as={NavLink} to="/cart" className={navLinkClass}>
              Cart
              {cartCount > 0 && (
                <Badge
                  bg="warning"
                  text="dark"
                  className="ms-1 rounded-pill px-2"
                  style={{ fontSize: '0.7rem' }}
                >
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
          <Nav>
            {token ? (
              <>
                <Nav.Link as={NavLink} to="/orders" className={navLinkClass}>
                  Orders
                </Nav.Link>
                {user?.role === 'admin' && (
                  <Nav.Link as={NavLink} to="/admin" className={navLinkClass}>
                    Admin
                  </Nav.Link>
                )}
                <Nav.Link
                  onClick={handleLogout}
                  className="text-white text-opacity-90 px-3 py-2 rounded-pill mx-1 transition-smooth"
                  style={{ cursor: 'pointer' }}
                >
                  Logout
                </Nav.Link>
                <span className="nav-link text-white text-opacity-75 px-2 small">
                  {user?.name}
                </span>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" className={navLinkClass}>
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register" className={navLinkClass}>
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
