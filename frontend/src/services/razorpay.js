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

export const openRazorpayCheckout = async (options) => {
  await loadScript('https://checkout.razorpay.com/v1/checkout.js');
  const Razorpay = window.Razorpay;
  return new Promise((resolve, reject) => {
    const rzp = new Razorpay({
      key: options.keyId,
      amount: options.amount,
      currency: options.currency || 'INR',
      order_id: options.orderId,
      name: options.name || 'E-Commerce Store',
      description: options.description || 'Order Payment',
      handler: (res) => resolve(res),
      modal: { ondismiss: () => reject(new Error('Payment closed')) },
    });
    rzp.open();
  });
};
