'use client';

import { useState, useEffect } from 'react';
import { PropertyGrid } from '@/components/property/PropertyGrid';

export default function PropertiesSimplePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setProperties(data.data || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Properties (Simple)</h1>
      <PropertyGrid properties={properties} isLoading={loading} />
    </div>
  );
}