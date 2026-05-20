'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  colors: string[];
  sizes: string[];
}

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  colors,
  sizes,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/products/${id}`}>
      <div
        className="group cursor-pointer border border-(--color-border) bg-(--color-surface)"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-[4/5] w-full overflow-hidden bg-(--color-border)">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-4">
          <h3 className="line-clamp-2 text-(--color-text) font-semibold">
            {name}
          </h3>
          <p className="mt-2 text-lg font-bold text-(--color-primary)">
            ${price.toFixed(2)}
          </p>

          {isHovered && (
            <div className="mt-3 space-y-2 animate-fade-in">
              {sizes.length > 0 && (
                <div>
                  <p className="text-xs font-(--color-muted-text) mb-1">
                    Sizes:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {sizes.map((size) => (
                      <span
                        key={size}
                        className="inline-block border border-(--color-border) px-2 py-1 text-xs"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {colors.length > 0 && (
                <div>
                  <p className="text-xs text-(--color-muted-text) mb-1">
                    Colors:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <div
                        key={color}
                        className="h-4 w-4 border border-(--color-border)"
                        style={{
                          backgroundColor: color,
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
