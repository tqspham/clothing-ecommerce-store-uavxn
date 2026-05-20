'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CheckoutSteps } from '@/components/CheckoutSteps';
import { CartReview } from '@/components/CartReview';
import { ShippingForm, ShippingAddress } from '@/components/ShippingForm';
import { PaymentMethod } from '@/components/PaymentMethod';
import { OrderConfirmation } from '@/components/OrderConfirmation';

interface CartData {
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    imageUrl: string;
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

interface Order {
  orderNumber: string;
  orderDate: string;
  estimatedDelivery: string;
  total: number;
}

const steps = [
  { name: 'cart', label: 'Cart' },
  { name: 'shipping', label: 'Shipping' },
  { name: 'payment', label: 'Payment' },
  { name: 'confirmation', label: 'Confirmation' },
];

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [cart, setCart] = useState<CartData | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    async function fetchCheckoutData() {
      setIsLoading(true);
      try {
        const [cartRes, addressRes] = await Promise.all([
          fetch('/api/cart'),
          fetch('/api/addresses'),
        ]);

        if (cartRes.ok) {
          const cartData = await cartRes.json();
          setCart(cartData);
        }

        if (addressRes.ok) {
          const addressData = await addressRes.json();
          setSavedAddresses(addressData.addresses || []);
        }
      } catch (err) {
        console.error('Failed to fetch checkout data:', err);
        setError('Failed to load checkout data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCheckoutData();
  }, [session, router]);

  const handleShippingSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
    setCurrentStep(3);
  };

  const handleCheckout = async () => {
    if (!shippingAddress) {
      setError('Please select a shipping address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress,
          paymentMethod,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Checkout failed');
        return;
      }

      const data = await res.json();
      const orderDate = new Date().toLocaleDateString();
      const estimatedDelivery = new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      ).toLocaleDateString();

      setOrder({
        orderNumber: data.orderNumber,
        orderDate,
        estimatedDelivery,
        total: cart?.total || 0,
      });

      setCurrentStep(4);
    } catch (err) {
      setError('An error occurred during checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-(--color-border)" />
          ))}
        </div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-(--color-muted-text)">No cart data available</p>
      </div>
    );
  }

  if (currentStep === 4 && order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <OrderConfirmation
          orderNumber={order.orderNumber}
          orderDate={order.orderDate}
          estimatedDelivery={order.estimatedDelivery}
          total={order.total}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold text-(--color-text) mb-8">Checkout</h1>

      <CheckoutSteps currentStep={currentStep} steps={steps} />

      {error && (
        <div className="mb-6 bg-red-50 border border-(--color-danger) text-(--color-danger) p-4 rounded">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {currentStep === 1 && (
          <div>
            <CartReview
              items={cart.items}
              subtotal={cart.subtotal}
              tax={cart.tax}
              shipping={cart.shipping}
              total={cart.total}
            />
            <button
              onClick={() => setCurrentStep(2)}
              className="mt-6 w-full bg-(--color-primary) text-(--color-surface) py-3 font-bold text-lg hover:bg-gray-800 transition-colors"
            >
              Continue to Shipping
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <ShippingForm
            onSubmit={handleShippingSubmit}
            isLoading={isSubmitting}
            savedAddresses={savedAddresses}
          />
        )}

        {currentStep === 3 && (
          <div>
            <PaymentMethod
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
            />
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="mt-6 w-full bg-(--color-primary) text-(--color-surface) py-3 font-bold text-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
