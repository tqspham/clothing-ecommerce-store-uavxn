interface CartSummaryProps {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  isCheckoutDisabled: boolean;
}

export function CartSummary({
  subtotal,
  tax,
  shipping,
  total,
  isCheckoutDisabled,
}: CartSummaryProps) {
  return (
    <div className="border-t border-(--color-border) pt-6">
      <div className="space-y-2">
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
        <div className="border-t border-(--color-border) pt-2">
          <div className="flex justify-between font-bold text-lg text-(--color-primary)">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <a
        href={isCheckoutDisabled ? '#' : '/checkout'}
        className={`mt-6 block w-full py-3 text-center font-bold text-lg transition-colors ${
          isCheckoutDisabled
            ? 'bg-(--color-border) text-(--color-muted-text) cursor-not-allowed'
            : 'bg-(--color-primary) text-(--color-surface) hover:bg-gray-800'
        }`}
      >
        Proceed to Checkout
      </a>
    </div>
  );
}
