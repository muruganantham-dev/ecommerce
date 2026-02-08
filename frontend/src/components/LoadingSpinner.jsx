import { Spinner } from 'react-bootstrap';

export default function LoadingSpinner({ size = 'md' }) {
  return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" role="status" size={size}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
