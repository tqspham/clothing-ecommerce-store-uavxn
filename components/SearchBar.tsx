'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/?search=${encodeURIComponent(query)}`);
      }
    },
    [query, router]
  );

  return (
    <form onSubmit={handleSearch} className="flex items-center">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-(--color-border) bg-(--color-surface) px-4 py-2 text-(--color-text) placeholder-text-(--color-muted-text) focus:border-(--color-primary) focus:outline-none"
        />
        <button
          type="submit"
          className="absolute right-3 top-2.5 text-(--color-secondary) hover:text-(--color-primary)"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
}
