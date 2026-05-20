interface CartReviewItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  imageUrl: string;
}

interface CartReviewProps {
  items: CartReviewItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export function CartReview({
  items,
  subtotal,
  tax,
  shipping,
  total,
}: CartReviewProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-(--color-text)">Order Review</h2>

      {/* Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 border-b border-(--color-border) pb-4">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden bg-(--color-border)">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-(--color-text)">{item.name}</h3>
              <p className="text-sm text-(--color-muted-text)">
                {item.size} / {item.color}
              </p>
              <p className="text-sm text-(--color-text)">
                Qty: {item.quantity}
              </p>
            </div>
            <p className="font-semibold text-(--color-primary)">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="border-t border-(--color-border) pt-4 space-y-2">
        <div className="flex justify-between text-(--color-text)">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-(--color-text)">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-(--color-text)">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="border-t border-(--color-border) pt-2 flex justify-between font-bold text-lg text-(--color-primary)">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
