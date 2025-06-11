'use client';

export default function PropertiesStaticPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Properties (Static)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold">Test Property 1</h2>
          <p className="text-gray-600">$1,000,000 MXN</p>
          <p className="text-sm">3 bedrooms, 2 bathrooms</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold">Test Property 2</h2>
          <p className="text-gray-600">$2,000,000 MXN</p>
          <p className="text-sm">4 bedrooms, 3 bathrooms</p>
        </div>
      </div>
    </div>
  );
}