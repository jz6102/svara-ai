"use client"; // This must be a client component to use hooks

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the authentication status is determined
    if (isLoggedIn !== null) { 
      if (isLoggedIn) {
        // If logged in, go to the dashboard
        router.push('/dashboard');
      } else {
        // If not logged in, go to the login page
        router.push('/login');
      }
    }
  }, [isLoggedIn, router]);

  // Display a loading message while the redirect is happening
  return (
    <div className="flex items-center justify-center h-screen">
      <p>Loading...</p>
    </div>
  );
}