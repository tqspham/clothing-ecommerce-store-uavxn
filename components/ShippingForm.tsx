'use client';

import { useState } from 'react';

export interface ShippingAddress {
  id?: string;
  fullName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ShippingFormProps {
  onSubmit: (address: ShippingAddress) => void;
  isLoading: boolean;
  savedAddresses: ShippingAddress[];
}

export function ShippingForm({
  onSubmit,
  isLoading,
  savedAddresses,
}: ShippingFormProps) {
  const [form, setForm] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim())
      newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Invalid email address';
    if (!form.street.trim()) newErrors.street = 'Street address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.postalCode.trim())
      newErrors.postalCode = 'Postal code is required';
    if (!form.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(form);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-(--color-text)">Shipping Address</h2>

      {/* Saved Addresses */}
      {savedAddresses.length > 0 && (
        <div>
          <p className="mb-3 font-semibold text-(--color-text)">Quick select:</p>
          <div className="space-y-2">
            {savedAddresses.map((addr) => (
              <button
                key={addr.id}
                type="button"
                onClick={() => {
                  setForm({
                    fullName: addr.fullName,
                    email: addr.email,
                    street: addr.street,
                    city: addr.city,
                    state: addr.state,
                    postalCode: addr.postalCode,
                    country: addr.country,
                  });
                }}
                className="block w-full border border-(--color-border) bg-(--color-surface) p-3 text-left hover:border-(--color-primary) transition-colors"
              >
                <p className="font-semibold text-(--color-text)">
                  {addr.fullName}
                </p>
                <p className="text-sm text-(--color-muted-text)">
                  {addr.street}, {addr.city}, {addr.state} {addr.postalCode},
                  {addr.country}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-(--color-text)">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border border-(--color-border) bg-(--color-surface) px-3 py-2 text-(--color-text) placeholder-text-(--color-muted-text) focus:border-(--color-primary) focus:outline-none"
            placeholder="John Doe"
            disabled={isLoading}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-(--color-danger)">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-(--color-text)">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-(--color-border) bg-(--color-surface) px-3 py-2 text-(--color-text) placeholder-text-(--color-muted-text) focus:border-(--color-primary) focus:outline-none"
            placeholder="john@example.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-(--color-danger)">{errors.email}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-semibold text-(--color-text)">
            Street Address *
          </label>
          <input
            type="text"
            name="street"
            value={form.street}
            onChange={handleChange}
            className="w-full border border-(--color-border) bg-(--color-surface) px-3 py-2 text-(--color-text) placeholder-text-(--color-muted-text) focus:border-(--color-primary) focus:outline-none"
            placeholder="123 Main Street"
            disabled={isLoading}
          />
          {errors.street && (
            <p className="mt-1 text-sm text-(--color-danger)">{errors.street}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-(--color-text)">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full border border-(--color-border) bg-(--color-surface) px-3 py-2 text-(--color-text) placeholder-text-(--color-muted-text) focus:border-(--color-primary) focus:outline-none"
            placeholder="New York"
            disabled={isLoading}
          />
          {errors.city && (
            <p className="mt-1 text-sm text-(--color-danger)">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-(--color-text)">
            State *
          </label>
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            className="w-full border border-(--color-border) bg-(--color-surface) px-3 py-2 text-(--color-text) placeholder-text-(--color-muted-text) focus:border-(--color-primary) focus:outline-none"
            placeholder="NY"
            disabled={isLoading}
          />
          {errors.state && (
            <p className="mt-1 text-sm text-(--color-danger)">{errors.state}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-(--color-text)">
            Postal Code *
          </label>
          <input
            type="text"
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            className="w-full border border-(--color-border) bg-(--color-surface) px-3 py-2 text-(--color-text) placeholder-text-(--color-muted-text) focus:border-(--color-primary) focus:outline-none"
            placeholder="10001"
            disabled={isLoading}
          />
          {errors.postalCode && (
            <p className="mt-1 text-sm text-(--color-danger)">
              {errors.postalCode}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-(--color-text)">
            Country *
          </label>
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            className="w-full border border-(--color-border) bg-(--color-surface) px-3 py-2 text-(--color-text) placeholder-text-(--color-muted-text) focus:border-(--color-primary) focus:outline-none"
            placeholder="United States"
            disabled={isLoading}
          />
          {errors.country && (
            <p className="mt-1 text-sm text-(--color-danger)">
              {errors.country}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-(--color-primary) text-(--color-surface) py-3 font-bold text-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Processing...' : 'Continue to Payment'}
      </button>
    </form>
  );
}
