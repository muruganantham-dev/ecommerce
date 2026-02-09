/**
 * Meta WhatsApp Business Cloud API - Template messages
 * Templates: order_success_template, order_failure_template (approve in Meta Business Manager)
 *
 * TEMPLATE PAYLOAD EXAMPLES:
 *
 * order_success_template (params: name, order_id, product_summary, amount, address):
 *   "Hi {{1}}, your order {{2}} is confirmed! Items: {{3}}. Total: {{4}}. Delivery: {{5}}. Thank you!"
 *
 * order_failure_template (params: name, order_id, product_summary, failure_message, support_contact):
 *   "Hi {{1}}, order {{2}} payment failed. Items: {{3}}. Reason: {{4}}. {{5}}"
 */

import axios from 'axios';

const getWhatsAppConfig = () => {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const version = process.env.WHATSAPP_API_VERSION || 'v18.0';
  if (!token || !phoneNumberId) return null;
  return { token, phoneNumberId, version };
};

const formatPhone = (phone) => {
  const cleaned = String(phone || '').replace(/\D/g, '');
  return cleaned.length === 10 ? `91${cleaned}` : cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
};

const formatProductSummary = (orderItems) => {
  if (!orderItems?.length) return 'N/A';
  return orderItems.map((i) => `${i.name} (x${i.quantity})`).join(', ');
};

const sendTemplate = async (to, templateName, languageCode, components = []) => {
  const config = getWhatsAppConfig();
  if (!config) {
    console.warn('[WhatsApp] Not configured. Skipping notification.');
    return { success: false, reason: 'not_configured' };
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
  try {
    const { data } = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data };
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message;
    console.error('[WhatsApp] API error:', msg);
    return { success: false, error: msg };
  }
};

/**
 * order_success_template params: {{name}}, {{order_id}}, {{product_summary}}, {{amount}}, {{address}}
 */
export const sendOrderSuccessWhatsApp = async (phone, order) => {
  const config = getWhatsAppConfig();
  if (!config) return { success: false, reason: 'not_configured' };

  const name = order.shippingAddress?.name || order.user?.name || 'Customer';
  const orderId = order._id?.toString?.() || String(order.id || order);
  const productSummary = formatProductSummary(order.orderItems);
  const amount = order.totalPrice != null ? `₹${order.totalPrice}` : 'N/A';
  const address = order.shippingAddress
    ? [order.shippingAddress.street, order.shippingAddress.city, order.shippingAddress.pincode]
        .filter(Boolean)
        .join(', ')
    : 'N/A';

  const result = await sendTemplate(
    order.shippingAddress?.phone || order.user?.phone || phone,
    process.env.WHATSAPP_ORDER_SUCCESS_TEMPLATE || 'order_success_template',
    'en',
    [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: String(name).substring(0, 100) },
          { type: 'text', text: orderId },
          { type: 'text', text: productSummary.substring(0, 500) },
          { type: 'text', text: amount },
          { type: 'text', text: address.substring(0, 500) },
        ],
      },
    ]
  );

  if (!result.success) {
    console.error('[WhatsApp] Order success failed:', result.error);
  }
  return result;
};

/**
 * order_failure_template params: {{name}}, {{order_id}}, {{product_summary}}, {{failure_message}}, {{support_contact}}
 */
export const sendOrderFailureWhatsApp = async (phone, order, failureMessage = 'Payment failed.') => {
  const config = getWhatsAppConfig();
  if (!config) return { success: false, reason: 'not_configured' };

  const name = order?.shippingAddress?.name || order?.user?.name || 'Customer';
  const orderId = order?._id?.toString?.() || order?.id || 'N/A';
  const productSummary = formatProductSummary(order?.orderItems);
  const supportContact = process.env.WHATSAPP_SUPPORT_NUMBER || 'Support: +91 9999999999';

  const result = await sendTemplate(
    order?.shippingAddress?.phone || order?.user?.phone || phone,
    process.env.WHATSAPP_ORDER_FAILURE_TEMPLATE || 'order_failure_template',
    'en',
    [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: String(name).substring(0, 100) },
          { type: 'text', text: String(orderId) },
          { type: 'text', text: productSummary.substring(0, 500) },
          { type: 'text', text: String(failureMessage).substring(0, 200) },
          { type: 'text', text: supportContact },
        ],
      },
    ]
  );

  if (!result.success) {
    console.error('[WhatsApp] Order failure notification failed:', result.error);
  }
  return result;
};

/**
 * order_cancelled - legacy template for user-initiated cancellation
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
  ]);
};

/**
 * order_status_update - shipped/delivered
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
  ]);
};
