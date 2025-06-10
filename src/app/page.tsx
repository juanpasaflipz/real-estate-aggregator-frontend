'use client';

import Link from 'next/link';
import { Search, Home, TrendingUp, Shield } from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative py-32 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Encuentra tu hogar ideal en México
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Busca entre miles de propiedades de múltiples fuentes en un solo lugar.
            Casas, departamentos, terrenos y más.
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Por qué elegir MexiCasa?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Miles de propiedades
              </h3>
              <p className="text-muted-foreground">
                Accede a un amplio catálogo de propiedades de diferentes portales inmobiliarios.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Precios actualizados
              </h3>
              <p className="text-muted-foreground">
                Información de precios y características actualizadas diariamente.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Búsqueda segura
              </h3>
              <p className="text-muted-foreground">
                Filtra y compara propiedades de manera segura y confiable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para encontrar tu próximo hogar?
          </h2>
          <p className="text-muted-foreground mb-8">
            Comienza tu búsqueda ahora y descubre las mejores ofertas del mercado.
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Explorar propiedades
          </Link>
        </div>
      </section>
    </div>
  );
}
