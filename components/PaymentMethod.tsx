'use client';

interface PaymentMethodProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const paymentMethods = [
  { id: 'credit-card', label: 'Credit Card' },
  { id: 'debit-card', label: 'Debit Card' },
  { id: 'paypal', label: 'PayPal' },
];

export function PaymentMethod({
  selectedMethod,
  onMethodChange,
}: PaymentMethodProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-(--color-text)">Payment Method</h2>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <label key={method.id} className="flex items-center gap-3 p-4 border border-(--color-border) cursor-pointer hover:bg-(--color-border) transition-colors">
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={(e) => onMethodChange(e.target.value)}
              className="h-4 w-4"
            />
            <span className="font-semibold text-(--color-text)">
              {method.label}
            </span>
          </label>
        ))}
      </div>

      <div className="border-t border-(--color-border) pt-4">
        <p className="text-sm text-(--color-muted-text)">
          Payment processing is handled securely. No payment details are stored.
        </p>
      </div>
    </div>
  );
}
