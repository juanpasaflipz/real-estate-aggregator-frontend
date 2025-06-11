'use client';

import { useEffect, useState } from 'react';

export default function PropertiesDebugPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Direct fetch without any libraries
    fetch('/api/properties?limit=5')
      .then(res => res.json())
      .then(data => {
        console.log('API Response:', data);
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('API Error:', err);
        setError(err.toString());
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Properties Debug</h1>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {data && (
        <div>
          <p className="mb-4">Found {data.meta?.total || 0} properties</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data?.map((property: any) => (
              <div key={property.id} className="border rounded-lg p-4">
                <h2 className="font-semibold">{property.title}</h2>
                <p className="text-gray-600">${property.price.toLocaleString()} {property.currency}</p>
                <p className="text-sm">{property.location.city}, {property.location.state}</p>
                <p className="text-sm">{property.features.bedrooms} bedrooms, {property.features.bathrooms} bathrooms</p>
              </div>
            ))}
          </div>
          <details className="mt-8">
            <summary className="cursor-pointer text-blue-600">View Raw Data</summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-xs">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}