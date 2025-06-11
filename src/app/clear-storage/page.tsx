'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClearStoragePage() {
  const router = useRouter();

  useEffect(() => {
    // Clear all localStorage
    localStorage.clear();
    
    // Clear sessionStorage too
    sessionStorage.clear();
    
    // Redirect to properties page after clearing
    setTimeout(() => {
      router.push('/properties');
    }, 1000);
  }, [router]);

  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Clearing Storage...</h1>
      <p>Redirecting to properties page...</p>
    </div>
  );
}