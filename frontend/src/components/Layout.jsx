import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Header />
      <main className="py-4 min-vh-100">
        <Container><Outlet /></Container>
      </main>
      <Footer />
    </>
  );
}
