# MERN E-Commerce Application

Full-stack e-commerce with **Razorpay** payment and **Meta WhatsApp Business API** notifications.

## Tech Stack

- **Frontend:** React 18, Redux Toolkit, Bootstrap 5, Vite
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Integrations:** Razorpay, Meta WhatsApp Business API

## Project Structure

```
ecommerce/
├── backend/          # Express API
│   ├── config/       # DB connection
│   ├── controllers/
│   ├── middleware/   # auth, errorHandler
│   ├── models/       # User, Product, Order, Payment
│   ├── routes/
│   ├── services/     # razorpayService, whatsappService
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/         # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/    # store, slices
│   │   ├── services/ # api, razorpay
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── API.md
│   └── DATABASE_SCHEMA.md
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Razorpay account
- Meta WhatsApp Business API (optional, for notifications)

### 1. Backend

```bash
cd ecommerce/backend
npm install
cp .env.example .env
# Edit .env with your values (see ENV configuration below)
npm run dev
```

Server runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd ecommerce/frontend
npm install
# Optional: create .env with VITE_API_URL=http://localhost:5000/api if not using Vite proxy
npm run dev
```

App runs at `http://localhost:3000`. Vite proxy forwards `/api` to backend.

### 3. Database

Ensure MongoDB is running. The app will create the database and collections on first use. To seed sample products:

```bash
cd backend && node scripts/seedProducts.js
```

### 4. Admin Panel

- **URL:** `http://localhost:3000/admin` (login at `/admin/login`).
- **First admin:** Register a user from the store, then set role in MongoDB:
  ```js
  db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
  ```
- Admin can manage products (CRUD, image upload, toggle active), orders (view, update status with WhatsApp), users (block/unblock, delete, view orders), payments (view), and view analytics (sales chart, top products, revenue).

## ENV Configuration

### Backend (`.env` in `backend/`)

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default 5000) |
| `MONGODB_URI` | MongoDB connection string (e.g. `mongodb://localhost:27017/ecommerce`) |
| `JWT_SECRET` | Secret for JWT signing (use a strong random string in production) |
| `JWT_EXPIRE` | Token expiry (e.g. `7d`) |
| `RAZORPAY_KEY_ID` | From [Razorpay Dashboard](https://dashboard.razorpay.com) → API Keys |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key |
| `WHATSAPP_ACCESS_TOKEN` | Meta WhatsApp Business API access token |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Business phone number ID |
| `WHATSAPP_API_VERSION` | Optional; default `v18.0` |
| `CLIENT_URL` | Frontend URL for CORS (e.g. `http://localhost:3000`) |

### Frontend (optional `.env` in `frontend/`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base URL (e.g. `http://localhost:5000/api`). If omitted, use relative `/api` with proxy. |

## API Documentation

See [docs/API.md](docs/API.md) for full REST API reference.

## Database Schema

See [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) for collections and fields.

## WhatsApp Templates

The backend sends template messages. You must create and get approved in Meta Business Manager:

1. **order_success** – Body parameters: `order_id`, `items_summary`, `amount`, `delivery_address`
2. **order_cancelled** – Body parameters: `order_id`, `confirmation_message`

If WhatsApp env vars are missing, the app still runs; notifications are skipped and a warning is logged.

## Security & Practices

- JWT for protected routes; token in `Authorization: Bearer <token>`
- Passwords hashed with bcrypt
- Input validation via express-validator
- API rate limiting (100 req/15 min per IP)
- Razorpay signature verified before marking order paid
- No secrets in frontend; Razorpay key ID is public

## Scripts

- **Backend:** `npm run dev` (watch mode), `npm start`
- **Frontend:** `npm run dev`, `npm run build`, `npm run preview`
