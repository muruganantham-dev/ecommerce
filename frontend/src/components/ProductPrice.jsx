/**
 * Reusable ProductPrice component: MRP (strikethrough), offer price (highlighted), discount badge.
 * Discount is computed dynamically when mrp > price; otherwise uses product.discount.
 * @param {Object} props
 * @param {Object} [props.product] - Product object { mrp, price, discount }
 * @param {number} [props.mrp] - MRP (optional if passing product)
 * @param {number} [props.price] - Selling / offer price (optional if passing product)
 * @param {number} [props.discount] - Discount percentage 0–100 (optional; computed from mrp & price when possible)
 * @param {'compact'|'detail'} [props.variant] - compact for cards, detail for product detail page
 */
export default function ProductPrice({ product, mrp: mrpProp, price: priceProp, discount: discountProp, variant = 'compact' }) {
  const price = priceProp ?? product?.price ?? 0;
  const storedMrp = mrpProp ?? product?.mrp ?? null;
  const storedDiscount = discountProp ?? product?.discount ?? 0;

  // Derive MRP: use stored mrp, or when discount % is set, compute from price
  const displayMrp =
    storedMrp != null && storedMrp > 0
      ? storedMrp
      : storedDiscount > 0
        ? Math.round(price / (1 - storedDiscount / 100))
        : price;

  // Dynamic discount %: when we have effective MRP > price, compute; else use stored
  const discountPercent =
    displayMrp > price
      ? Math.round(((displayMrp - price) / displayMrp) * 100)
      : (storedDiscount > 0 ? Math.round(Number(storedDiscount)) : 0);

  const hasDiscount = discountPercent > 0 && displayMrp > price;

  return (
    <div className={`product-price product-price--${variant}`}>
      {hasDiscount && (
        <span className="product-price__badge" aria-label={`${discountPercent}% off`}>
          {discountPercent}% OFF
        </span>
      )}
      <div className="product-price__row">
        {hasDiscount && (
          <span className="product-price__mrp" aria-label="Maximum retail price">
            ₹{displayMrp.toLocaleString('en-IN')}
          </span>
        )}
        <span className="product-price__offer" aria-label="Offer price">
          ₹{price.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  );
}
