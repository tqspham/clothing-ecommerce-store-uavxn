'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { ProductDetail } from '@/components/ProductDetail';
import { SizeColorSelector } from '@/components/SizeColorSelector';
import { QuantitySelector } from '@/components/QuantitySelector';
import { AddToCartButton } from '@/components/AddToCartButton';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  specification?: string;
}

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  const handleAddSuccess = () => {
    setMessage({ type: 'success', text: 'Added to cart!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddError = (error: string) => {
    setMessage({ type: 'error', text: error });
    setTimeout(() => setMessage(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 animate-pulse">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="aspect-[4/5] bg-(--color-border)" />
          <div className="space-y-4">
            <div className="h-8 bg-(--color-border)" />
            <div className="h-6 w-1/2 bg-(--color-border)" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <p className="text-(--color-muted-text)">Product not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductDetail product={product} />

        <div className="space-y-6">
          {message && (
            <div
              className={`flex gap-3 p-4 rounded ${
                message.type === 'success'
                  ? 'bg-green-50 border border-(--color-success)'
                  : 'bg-red-50 border border-(--color-danger)'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle
                  size={20}
                  className="text-(--color-success) flex-shrink-0 mt-0.5"
                />
              ) : (
                <AlertCircle
                  size={20}
                  className="text-(--color-danger) flex-shrink-0 mt-0.5"
                />
              )}
              <p
                className={`${
                  message.type === 'success'
                    ? 'text-(--color-success)'
                    : 'text-(--color-danger)'
                }`}
              >
                {message.text}
              </p>
            </div>
          )}

          <SizeColorSelector
            sizes={product.sizes}
            colors={product.colors}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            onSizeChange={setSelectedSize}
            onColorChange={setSelectedColor}
          />

          <QuantitySelector
            quantity={quantity}
            maxAvailable={10}
            onQuantityChange={setQuantity}
          />

          <AddToCartButton
            productId={product.id}
            size={selectedSize || ''}
            color={selectedColor || ''}
            quantity={quantity}
            isLoading={isLoading}
            onSuccess={handleAddSuccess}
            onError={handleAddError}
          />
        </div>
      </div>
    </div>
  );
}
