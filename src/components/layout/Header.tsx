'use client';

import Link from 'next/link';
import { Home, Heart, Menu } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">MexiCasa</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/properties"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Propiedades
            </Link>
            <Link
              href="/favorites"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Favoritos
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Acerca de
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/favorites"
              className="relative p-2 hover:bg-accent rounded-md transition-colors"
            >
              <Heart className="h-5 w-5" />
              <span className="sr-only">Favoritos</span>
            </Link>

            <button
              className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link
                href="/properties"
                className="text-sm font-medium transition-colors hover:text-primary px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Propiedades
              </Link>
              <Link
                href="/favorites"
                className="text-sm font-medium transition-colors hover:text-primary px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Favoritos
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium transition-colors hover:text-primary px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Acerca de
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}