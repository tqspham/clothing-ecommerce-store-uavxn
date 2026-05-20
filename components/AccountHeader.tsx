'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

interface AccountHeaderProps {
  email: string;
  onLogout?: () => void;
}

export function AccountHeader({ email, onLogout }: AccountHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    if (onLogout) onLogout();
    await signOut({ redirect: true, redirectUrl: '/login' });
  };

  return (
    <div className="flex items-center justify-between border-b border-(--color-border) pb-6">
      <div>
        <h1 className="text-3xl font-bold text-(--color-text)">
          My Account
        </h1>
        <p className="mt-1 text-(--color-muted-text)">Welcome back, {email}</p>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-(--color-danger) text-(--color-surface) px-6 py-2 font-semibold hover:bg-red-700 transition-colors"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}
