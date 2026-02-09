import { Button, Spinner } from 'react-bootstrap';

export default function LoadingButton({
  loading = false,
  loadingText = 'Processing...',
  children,
  disabled,
  className = '',
  ...props
}) {
  return (
    <Button
      className={className}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Spinner as="span" animation="border" size="sm" className="me-2" style={{ verticalAlign: '-0.2em' }} />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
