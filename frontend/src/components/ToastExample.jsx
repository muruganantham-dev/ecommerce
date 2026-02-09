import { useToast } from '../contexts/ToastContext';

export default function ToastExample() {
  const { success, error, warning, info, showToast } = useToast();

  return (
    <div className="d-flex flex-wrap gap-2 p-3">
      <button type="button" className="btn btn-success rounded-pill" onClick={() => success('Operation completed!')}>
        Success
      </button>
      <button type="button" className="btn btn-danger rounded-pill" onClick={() => error('Something went wrong.')}>
        Error
      </button>
      <button type="button" className="btn btn-warning rounded-pill" onClick={() => warning('Please check your input.')}>
        Warning
      </button>
      <button type="button" className="btn btn-info rounded-pill" onClick={() => info('Here is some information.')}>
        Info
      </button>
      <button type="button" className="btn btn-primary rounded-pill" onClick={() => showToast('Custom message', 'success')}>
        showToast(msg, variant)
      </button>
    </div>
  );
}
