'use client';

import { Trash2, Plus } from 'lucide-react';

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface SavedAddressesProps {
  addresses: Address[];
  onDelete: (addressId: string) => void;
}

export function SavedAddresses({ addresses, onDelete }: SavedAddressesProps) {
  return (
    <div className="space-y-4">
      {addresses.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-(--color-muted-text) mb-4">
            No saved addresses yet
          </p>
          <button className="inline-flex items-center gap-2 bg-(--color-primary) text-(--color-surface) px-4 py-2 font-semibold hover:bg-gray-800 transition-colors">
            <Plus size={18} />
            Add Address
          </button>
        </div>
      ) : (
        addresses.map((address) => (
          <div
            key={address.id}
            className="flex items-start justify-between border border-(--color-border) bg-(--color-surface) p-4"
          >
            <div>
              <p className="font-semibold text-(--color-text)">{address.name}</p>
              <p className="mt-1 text-sm text-(--color-text)">
                {address.street}
              </p>
              <p className="text-sm text-(--color-text)">
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p className="text-sm text-(--color-text)">{address.country}</p>
            </div>
            <button
              onClick={() => onDelete(address.id)}
              className="p-2 text-(--color-danger) hover:bg-(--color-border) transition-colors"
              title="Delete address"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
