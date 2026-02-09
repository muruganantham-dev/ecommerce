/**
 * Load Razorpay script and return checkout handler
 */
const loadScript = (src) =>
  new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Razorpay script failed to load'));
    document.body.appendChild(script);
  });

/**
 * Hide/remove Razorpay modal overlay from DOM
 */
export const hideRazorpayModal = () => {
  const hide = (el) => {
    if (el && el.parentNode) {
      el.style.display = 'none';
      el.style.visibility = 'hidden';
      el.style.opacity = '0';
    }
  };
  const selectors = [
    '.razorpay-container',
    '.razorpay-modal',
    '[id^="razorpay"]',
    '[class*="razorpay"]',
    'iframe[src*="razorpay"]',
  ];
  selectors.forEach((sel) => {
    try {
      document.querySelectorAll(sel).forEach(hide);
    } catch (_) {}
  });
  document.querySelectorAll('iframe').forEach((iframe) => {
    if (iframe.src && iframe.src.includes('razorpay')) {
      hide(iframe.parentElement || iframe);
    }
  });
  document.body.style.overflow = '';
};

export const openRazorpayCheckout = async (options) => {
  await loadScript('https://checkout.razorpay.com/v1/checkout.js');
  const Razorpay = window.Razorpay;
  return new Promise((resolve) => {
    const onFailure = options.onFailure || (() => {});
    let handled = false;

    const handleFailure = () => {
      if (handled) return;
      handled = true;
      onFailure();
      resolve({ success: false });
    };

    const rzp = new Razorpay({
      key: options.keyId,
      amount: options.amount,
      currency: options.currency || 'INR',
      order_id: options.orderId,
      name: options.name || 'E-Commerce Store',
      description: options.description || 'Order Payment',
      handler: (res) => {
        if (handled) return;
        resolve({ success: true, ...res });
      },
      modal: {
        ondismiss: handleFailure,
      },
    });

    rzp.on('payment.failed', () => {
      handleFailure();
    });

    rzp.open();
  });
};
