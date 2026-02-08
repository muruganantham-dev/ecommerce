# Database Schema (MongoDB)

Database name: as in `MONGODB_URI` (e.g. `ecommerce`).

---

## Users

**Collection:** `users`

| Field     | Type   | Required | Description                    |
|-----------|--------|----------|--------------------------------|
| _id       | ObjectId | Auto   |                                |
| name      | String | Yes      |                                |
| email     | String | Yes      | Unique, lowercase              |
| password  | String | Yes      | Hashed (bcrypt), min 6 chars   |
| phone     | String | No       |                                |
| address   | Object | No       | { street, city, state, pincode }|
| role      | String | Yes      | `user` \| `admin`, default `user` |
| createdAt | Date   | Auto     |                                |
| updatedAt | Date   | Auto     |                                |

---

## Products

**Collection:** `products`

| Field       | Type    | Required | Description        |
|-------------|---------|----------|--------------------|
| _id         | ObjectId| Auto     |                    |
| name        | String  | Yes      |                    |
| description | String  | No       |                    |
| price       | Number  | Yes      | Min 0              |
| image       | String  | No       | URL                |
| category    | String  | No       | Indexed            |
| stock       | Number  | No       | Default 0, min 0   |
| isActive    | Boolean | No       | Default true       |
| createdAt   | Date    | Auto     |                    |
| updatedAt   | Date    | Auto     |                    |

---

## Orders

**Collection:** `orders`

| Field          | Type     | Required | Description |
|----------------|----------|----------|-------------|
| _id            | ObjectId | Auto     |             |
| user           | ObjectId | Yes      | ref: User    |
| orderItems     | Array    | Yes      | See below    |
| shippingAddress| Object   | Yes      | name, phone, street, city, state, pincode |
| paymentMethod  | String   | No       | Default `razorpay` |
| paymentResult  | Object   | No       | razorpay_order_id, razorpay_payment_id, razorpay_signature |
| itemsPrice     | Number   | Yes      |             |
| taxPrice       | Number   | No       | Default 0   |
| shippingPrice  | Number   | No       | Default 0   |
| totalPrice     | Number   | Yes      |             |
| isPaid         | Boolean  | No       | Default false |
| paidAt         | Date     | No       |             |
| isDelivered    | Boolean  | No       | Default false |
| deliveredAt    | Date     | No       |             |
| status         | String   | No       | `pending`, `confirmed`, `cancelled`, `delivered` |
| createdAt      | Date     | Auto     |             |
| updatedAt      | Date     | Auto     |             |

**orderItems[]:**

| Field    | Type    | Required |
|----------|---------|----------|
| product  | ObjectId| Yes (ref: Product) |
| name     | String  | Yes      |
| quantity | Number  | Yes      |
| price    | Number  | Yes      |
| image    | String  | No       |

---

## Payments

**Collection:** `payments`

| Field               | Type     | Required | Description |
|---------------------|----------|----------|-------------|
| _id                 | ObjectId | Auto     |             |
| order               | ObjectId | Yes      | ref: Order  |
| user                | ObjectId | Yes      | ref: User   |
| razorpay_order_id   | String   | Yes      |             |
| razorpay_payment_id  | String   | No       | Set on verify |
| razorpay_signature   | String   | No       | Set on verify |
| amount              | Number   | Yes      |             |
| currency            | String   | No       | Default INR |
| status              | String   | No       | `created`, `captured`, `failed` |
| createdAt           | Date     | Auto     |             |
| updatedAt           | Date     | Auto     |             |
