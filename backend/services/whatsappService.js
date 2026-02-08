/**
 * Meta WhatsApp Business API - Template messages
 * Ensure templates are approved in Meta Business Manager for order_success & order_cancelled
 */

const getWhatsAppConfig = () => {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const version = process.env.WHATSAPP_API_VERSION || 'v18.0';
  if (!token || !phoneNumberId) return null;
  return { token, phoneNumberId, version };
};

const formatPhone = (phone) => {
  const cleaned = String(phone).replace(/\D/g, '');
  return cleaned.length === 10 ? `91${cleaned}` : cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
};

/**
 * Send template message via WhatsApp Cloud API
 */
const sendTemplate = async (to, templateName, languageCode, components = []) => {
  const config = getWhatsAppConfig();
  if (!config) {
    console.warn('WhatsApp not configured. Skipping notification.');
    return;
  }
  const url = `https://graph.facebook.com/${config.version}/${config.phoneNumberId}/messages`;
  const body = {
    messaging_product: 'whatsapp',
    to: formatPhone(to),
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode },
      components: components.length ? components : undefined,
    },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WhatsApp API: ${res.status} - ${err}`);
  }
  return res.json();
};

/**
 * Order success - use template "order_success" with params: order_id, items_summary, amount, delivery_address
 * Fallback: use a simple text template name if you have different template names in Meta
 */
export const sendOrderSuccessWhatsApp = async (phone, order) => {
  const orderId = order._id?.toString?.() || String(order.id || order);
  const itemsSummary = order.orderItems?.map((i) => `${i.name} x${i.quantity}`).join(', ') || 'N/A';
  const amount = order.totalPrice != null ? `₹${order.totalPrice}` : 'N/A';
  const address = order.shippingAddress
    ? [order.shippingAddress.street, order.shippingAddress.city, order.shippingAddress.pincode].filter(Boolean).join(', ')
    : 'N/A';
  return sendTemplate(order.shippingAddress?.phone || phone, 'order_success', 'en', [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: orderId },
        { type: 'text', text: itemsSummary.substring(0, 200) },
        { type: 'text', text: amount },
        { type: 'text', text: address.substring(0, 200) },
      ],
    },
  ]).catch((e) => {
    console.error('WhatsApp order success failed:', e.message);
  });
};

/**
 * Order cancelled - use template "order_cancelled" with params: order_id, confirmation_message
 */
export const sendOrderCancelledWhatsApp = async (phone, orderId) => {
  return sendTemplate(phone, 'order_cancelled', 'en', [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: String(orderId) },
        { type: 'text', text: 'Your order has been cancelled successfully.' },
      ],
    },
  ]).catch((e) => {
    console.error('WhatsApp order cancelled failed:', e.message);
  });
};

/**
 * Order status update (shipped/delivered) - template "order_status_update" with params: order_id, status
 */
export const sendOrderStatusWhatsApp = async (phone, orderId, status) => {
  return sendTemplate(phone, 'order_status_update', 'en', [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: String(orderId) },
        { type: 'text', text: status },
      ],
    },
  ]).catch((e) => {
    console.error('WhatsApp order status failed:', e.message);
  });
};
