'use client';

import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  colors: string[];
  sizes: string[];
}

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-(--color-border) aspect-[4/5]"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full py-12 text-center">
        <p className="text-(--color-muted-text) text-lg">
          No products found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          imageUrl={product.imageUrl}
          colors={product.colors}
          sizes={product.sizes}
        />
      ))}
    </div>
  );
}
