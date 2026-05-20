'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AccountHeader } from '@/components/AccountHeader';
import { OrderHistory } from '@/components/OrderHistory';
import { SavedAddresses } from '@/components/SavedAddresses';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  itemCount: number;
  total: number;
}

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function AccountPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    async function fetchAccountData() {
      setIsLoading(true);
      try {
        const [ordersRes, addressesRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/addresses'),
        ]);

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData.orders || []);
        }

        if (addressesRes.ok) {
          const addressesData = await addressesRes.json();
          setAddresses(addressesData.addresses || []);
        }
      } catch (error) {
        console.error('Failed to fetch account data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAccountData();
  }, [session, router]);

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const res = await fetch('/api/addresses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId }),
      });

      if (res.ok) {
        setAddresses(addresses.filter((addr) => addr.id !== addressId));
      }
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <AccountHeader
        email={session.user.email || ''}
      />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-2xl font-bold text-(--color-text)">
            Order History
          </h2>
          <OrderHistory orders={orders} isLoading={isLoading} />
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-(--color-text)">
            Saved Addresses
          </h2>
          <SavedAddresses
            addresses={addresses}
            onDelete={handleDeleteAddress}
          />
        </div>
      </div>
    </div>
  );
}
