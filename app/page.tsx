'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ProductGrid } from '@/components/ProductGrid';
import { FilterSidebar } from '@/components/FilterSidebar';
import { SortDropdown } from '@/components/SortDropdown';
import { HeroSection } from '@/components/HeroSection';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  colors: string[];
  sizes: string[];
}

interface Category {
  id: string;
  name: string;
}

interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: { min: number; max: number };
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState('popularity');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: { min: 0, max: 1000 },
  });

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchParams.get('search'))
          params.append('search', searchParams.get('search')!);
        if (searchParams.get('category'))
          params.append('category', searchParams.get('category')!);
        if (filters.categories.length > 0)
          params.append('categories', filters.categories.join(','));
        if (filters.sizes.length > 0)
          params.append('sizes', filters.sizes.join(','));
        if (filters.colors.length > 0)
          params.append('colors', filters.colors.join(','));
        params.append('minPrice', filters.priceRange.min.toString());
        params.append('maxPrice', filters.priceRange.max.toString());
        params.append('sort', sort);

        const res = await fetch(`/api/products?${params}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [searchParams, filters, sort]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }

    fetchCategories();
  }, []);

  const heroCategory = categories[0] || {
    id: '',
    name: 'Featured Collection',
  };

  return (
    <div>
      <HeroSection
        imageUrl="https://picsum.photos/1200/600"
        categoryName={heroCategory.name}
        categoryId={heroCategory.id}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <FilterSidebar
            categories={categories}
            sizes={['XS', 'S', 'M', 'L', 'XL', 'XXL']}
            colors={[
              '#000000',
              '#FFFFFF',
              '#EF4444',
              '#3B82F6',
              '#10B981',
            ]}
            priceRange={{ min: 0, max: 1000 }}
            onFilterChange={setFilters}
          />

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-(--color-text)">
                Products
              </h2>
              <SortDropdown
                currentSort={sort}
                onSortChange={setSort}
              />
            </div>

            <ProductGrid products={products} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
