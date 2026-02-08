# WhatsApp Business API – How to Get Credentials

Use **Meta WhatsApp Cloud API** (no Twilio or other provider needed). You need a **Meta (Facebook) Developer** account and a **Business** (or test) app.

---

## 1. Create App & Enable WhatsApp

1. Go to **[Meta for Developers](https://developers.facebook.com/)** → **My Apps** → **Create App**.
2. Choose **Business** type → name your app → Create.
3. In the app dashboard, open **Add Products** (or **Products** in left menu).
4. Find **WhatsApp** → click **Set up**.
5. Choose **WhatsApp Business Platform** (Cloud API).

---

## 2. Get **Phone Number ID** (`WHATSAPP_PHONE_NUMBER_ID`)

1. In the app, go to **WhatsApp** → **API Setup** (or **Getting Started**).
2. You’ll see a **Phone numbers** section.
3. **Test number:** Meta gives a **test phone number** and a **Phone number ID** (long numeric ID, e.g. `123456789012345`). Copy that ID → use as `WHATSAPP_PHONE_NUMBER_ID`.
4. **Your own number:** To use your business number:
   - In **WhatsApp** → **API Setup**, add a phone number.
   - Verify it (SMS/voice code).
   - After verification, that number will have a **Phone number ID** shown there. Copy it → `WHATSAPP_PHONE_NUMBER_ID`.

---

## 3. Get **Access Token** (`WHATSAPP_ACCESS_TOKEN`)

1. Same page: **WhatsApp** → **API Setup** (or **Getting Started**).
2. Find **Temporary access token** (for testing):
   - Click **Generate** or copy the token shown.
   - Paste it in `.env` as `WHATSAPP_ACCESS_TOKEN`.
   - This token expires in about 24 hours; you’ll need to regenerate from the dashboard for testing.
3. **Production (permanent token):**
   - Go to **App Dashboard** → **Settings** → **Basic** → note your **App ID** and **App Secret**.
   - Create a **System User** in [Meta Business Settings](https://business.facebook.com/settings/) → **Users** → **System Users** → Add → give it access to your app.
   - Generate a token for that system user with `whatsapp_business_messaging` and `whatsapp_business_management` permissions.
   - Use that long-lived token as `WHATSAPP_ACCESS_TOKEN`.

---

## 4. **API Version** (`WHATSAPP_API_VERSION`)

- In **WhatsApp** → **API Setup**, the docs or URL often show the version (e.g. `v18.0`, `v19.0`).
- Use that in `.env`:  
  `WHATSAPP_API_VERSION=v18.0`  
  (or the version shown in your dashboard; default in this project is `v18.0`.)

---

## 5. Create Message Templates (Required for Sending)

WhatsApp only allows **template messages** for business-initiated chats (e.g. order confirmation).

1. Go to **Meta Business Manager** → **WhatsApp Manager** (or **Account Tools** → **WhatsApp Manager**).
2. Open your **WhatsApp Business Account** → **Message templates** → **Create template**.
3. Create two templates (names must match the backend):

   **Template 1 – Order success**  
   - Name: `order_success`  
   - Category: Utility or Marketing  
   - Language: English  
   - Body example:
     ```
     Your order is confirmed!
     Order ID: {{1}}
     Items: {{2}}
     Amount: {{3}}
     Delivery address: {{4}}
     ```

   **Template 2 – Order cancelled**  
   - Name: `order_cancelled`  
   - Category: Utility  
   - Language: English  
   - Body example:
     ```
     Your order has been cancelled.
     Order ID: {{1}}
     {{2}}
     ```

   **Template 3 – Order status update (admin)**  
   - Name: `order_status_update`  
   - Category: Utility  
   - Language: English  
   - Body example:
     ```
     Order status update.
     Order ID: {{1}}
     Status: {{2}}
     ```

4. Submit for approval. After approval, the backend can send these templates.

---

## 6. Add to `.env`

```env
WHATSAPP_ACCESS_TOKEN=<token from step 3>
WHATSAPP_PHONE_NUMBER_ID=<phone number ID from step 2>
WHATSAPP_API_VERSION=v18.0
```

---

## Quick Reference

| Variable                   | Where to get it |
|---------------------------|------------------|
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp → API Setup → Phone numbers → **Phone number ID** (numeric) |
| `WHATSAPP_ACCESS_TOKEN`    | Same page: **Temporary access token** (test) or System User token (production) |
| `WHATSAPP_API_VERSION`     | Use `v18.0` or the version shown in your WhatsApp API Setup / docs |

---

## Links

- [Meta for Developers](https://developers.facebook.com/)
- [WhatsApp Cloud API – Get Started](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates)
