import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

interface OrderConfirmationProps {
  orderNumber: string;
  orderDate: string;
  estimatedDelivery: string;
  total: number;
}

export function OrderConfirmation({
  orderNumber,
  orderDate,
  estimatedDelivery,
  total,
}: OrderConfirmationProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-12">
      <div className="text-center">
        <CheckCircle
          size={64}
          className="mx-auto text-(--color-success) mb-4"
        />
        <h1 className="text-4xl font-bold text-(--color-text)">Order Confirmed!</h1>
        <p className="mt-2 text-(--color-muted-text)">
          Thank you for your purchase
        </p>
      </div>

      <div className="space-y-4 border border-(--color-border) bg-(--color-surface) p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-(--color-muted-text)">Order Number</p>
            <p className="font-bold text-lg text-(--color-primary)">
              {orderNumber}
            </p>
          </div>
          <div>
            <p className="text-sm text-(--color-muted-text)">Order Total</p>
            <p className="font-bold text-lg text-(--color-primary)">
              ${total.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-(--color-muted-text)">Order Date</p>
            <p className="font-semibold text-(--color-text)">{orderDate}</p>
          </div>
          <div>
            <p className="text-sm text-(--color-muted-text)">Estimated Delivery</p>
            <p className="font-semibold text-(--color-text)">
              {estimatedDelivery}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-(--color-text)">
          A confirmation email has been sent to your registered email address.
        </p>
        <p className="text-(--color-text)">
          You can track your order from your account page.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/account"
          className="flex-1 bg-(--color-primary) text-(--color-surface) py-3 text-center font-semibold hover:bg-gray-800 transition-colors"
        >
          View Orders
        </Link>
        <Link
          href="/"
          className="flex-1 border border-(--color-primary) bg-(--color-surface) text-(--color-primary) py-3 text-center font-semibold hover:bg-(--color-border) transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
