# API Documentation

Base URL: `http://localhost:5000/api` (or your deployed backend URL).

## Authentication

Protected routes require header: `Authorization: Bearer <token>`.

---

### POST /auth/register

Register a new user.

**Body (JSON):**

| Field    | Type   | Required | Description |
|----------|--------|----------|-------------|
| name     | string | Yes      | User name   |
| email    | string | Yes      | Unique email|
| password | string | Yes      | Min 6 chars |
| phone    | string | No       | Phone       |

**Response:** `{ success, user: { _id, name, email, role }, token }`

---

### POST /auth/login

Login.

**Body:** `{ email, password }`

**Response:** `{ success, user, token }`

---

### GET /auth/me

Get current user (protected).

**Response:** `{ success, user }`

---

### PUT /auth/profile

Update profile (protected). Body: `{ name?, phone?, address? }`

**Response:** `{ success, user }`

---

## Products

### GET /products

List products. Query: `search`, `category`, `page`, `limit` (default 12).

**Response:** `{ success, products, page, pages, total }`

---

### GET /products/categories

List distinct categories.

**Response:** `{ success, categories: string[] }`

---

### GET /products/:id

Get single product.

**Response:** `{ success, product }`

---

## Orders (all protected)

### POST /orders

Create order (from cart).

**Body (JSON):**

```json
{
  "orderItems": [ { "product": "<productId>", "quantity": 2 } ],
  "shippingAddress": {
    "name": "John",
    "phone": "9876543210",
    "street": "123 Street",
    "city": "Mumbai",
    "state": "MH",
    "pincode": "400001"
  }
}
```

**Validation:** orderItems (array, min 1), orderItems.*.product (MongoId), orderItems.*.quantity (1–99), shippingAddress.name, phone, street, city, pincode (required).

**Response:** `{ success, order }`

---

### GET /orders

List current user's orders.

**Response:** `{ success, orders }`

---

### GET /orders/:id

Get order by ID (own orders only).

**Response:** `{ success, order }`

---

### PUT /orders/:id/cancel

Cancel order (only if not paid).

**Response:** `{ success, order }`

---

## Payments (protected)

### POST /payments/create-order

Create Razorpay order for given order ID.

**Body:** `{ orderId: "<orderId>" }` (orderId must be valid MongoDB ObjectId)

**Response:** `{ success, orderId (Razorpay), amount (paise), currency, keyId }`

---

### POST /payments/verify

Verify payment after Razorpay checkout.

**Body:** `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` (all required)

**Response:** `{ success, order }` — order is updated (isPaid, paymentResult) and WhatsApp sent if configured.

---

### POST /payments/notify-failure

Notify payment failure and trigger WhatsApp order failure template.

**Body (JSON):**

| Field          | Type   | Required | Description                    |
|----------------|--------|----------|--------------------------------|
| orderId        | string | Yes      | MongoDB order ID               |
| failureMessage | string | No       | Custom failure message (optional) |

**Response:** `{ success, whatsapp: "sent" | "failed" | "skipped" | "error", error? }`

---

## Health

### GET /api/health

**Response:** `{ status: "ok", timestamp }`

---

## Error responses

`{ success: false, message: "..." }` or validation `errors` array. HTTP status: 400 (validation/client), 401 (unauthorized), 403 (forbidden), 404 (not found), 429 (rate limit), 500 (server).
