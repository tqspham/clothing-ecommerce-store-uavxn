'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        return;
      }

      router.push('/');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-(--color-text)">Sign In</h1>
        <p className="mt-2 text-(--color-muted-text)">
          Enter your credentials to access your account
        </p>
      </div>

      {error && (
        <div className="flex gap-3 bg-red-50 border border-(--color-danger) p-4 rounded">
          <AlertCircle size={20} className="text-(--color-danger) flex-shrink-0 mt-0.5" />
          <p className="text-(--color-danger)">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-(--color-text)">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-(--color-border) bg-(--color-surface) px-4 py-2 text-(--color-text) placeholder-text-(--color-muted-text) focus:border-(--color-primary) focus:outline-none"
            placeholder="you@example.com"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-(--color-text)">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-(--color-border) bg-(--color-surface) px-4 py-2 text-(--color-text) placeholder-text-(--color-muted-text) focus:border-(--color-primary) focus:outline-none"
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-(--color-primary) text-(--color-surface) py-2 font-bold text-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-(--color-text)">
        Don't have an account?{' '}
        <Link
          href="/signup"
          className="font-semibold text-(--color-accent) hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
