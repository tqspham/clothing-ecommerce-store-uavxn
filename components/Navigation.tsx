'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

export function Navigation() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <>
      <button
        className="mb-4 inline-flex items-center rounded-md p-2 text-(--color-secondary) hover:bg-(--color-border) md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } border-t border-(--color-border) py-4 md:block md:border-t-0 md:py-0`}
      >
        <div className="flex flex-col gap-2 md:flex-row md:gap-8">
          <Link
            href="/"
            className="px-3 py-2 text-(--color-text) hover:text-(--color-accent)"
          >
            All Products
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/?category=${category.id}`}
              className="px-3 py-2 text-(--color-text) hover:text-(--color-accent)"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
