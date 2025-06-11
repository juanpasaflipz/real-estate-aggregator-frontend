'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PropertyGrid } from '@/components/property/PropertyGrid';

export default function PropertiesQueryPage() {
  const [filters] = useState({ limit: 20, page: 1 });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['properties-test', filters],
    queryFn: async () => {
      const response = await fetch('/api/properties?limit=20');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    }
  });

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Error</h1>
        <p className="text-red-500">Error: {error?.message}</p>
      </div>
    );
  }

  const properties = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Properties (React Query)</h1>
      <p className="mb-4">Found {data?.meta?.total || 0} properties</p>
      <PropertyGrid properties={properties} isLoading={isLoading} />
    </div>
  );
}