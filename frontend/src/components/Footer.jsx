import { Container } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer
      className="text-white py-4 mt-auto"
      style={{ background: 'var(--nav-gradient)', borderTop: '1px solid rgba(255,255,255,0.1)' }}
    >
      <Container className="text-center small text-white text-opacity-90">
        &copy; {new Date().getFullYear()} E-Commerce Store. All rights reserved.
      </Container>
    </footer>
  );
}
