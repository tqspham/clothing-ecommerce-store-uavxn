'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { User, LogOut, ChevronDown } from 'lucide-react';

interface AccountMenuProps {
  isAuthenticated: boolean;
  userName: string | null;
}

export function AccountMenu({ isAuthenticated, userName }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: true, redirectUrl: '/login' });
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-2 text-(--color-primary) hover:text-(--color-accent)"
      >
        <User size={24} />
        <ChevronDown size={16} className={`transition-transform ${
          open ? 'rotate-180' : ''
        }`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-(--color-surface) border border-(--color-border) shadow-lg">
          {isAuthenticated ? (
            <>
              <div className="border-b border-(--color-border) px-4 py-2">
                <p className="text-sm text-(--color-muted-text)">Signed in as</p>
                <p className="truncate font-semibold text-(--color-text)">
                  {userName}
                </p>
              </div>
              <Link
                href="/account"
                className="block px-4 py-2 text-(--color-text) hover:bg-(--color-border)"
              >
                My Account
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-(--color-danger) hover:bg-(--color-border)"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block px-4 py-2 text-(--color-text) hover:bg-(--color-border)"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block px-4 py-2 text-(--color-text) hover:bg-(--color-border)"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
