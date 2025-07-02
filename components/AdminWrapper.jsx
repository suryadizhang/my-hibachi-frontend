'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPanel from './AdminPanel';

function AdminWrapper() {
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking, true = auth, false = not auth
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem('adminToken');
      if (token) {
        // Verify token is valid (basic check - not expired)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (payload.exp && payload.exp > currentTime) {
            setIsAuthenticated(true);
          } else {
            // Token expired
            localStorage.removeItem('adminToken');
            setIsAuthenticated(false);
          }
        } catch (err) {
          // Invalid token
          console.error('Token validation error:', err);
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/admin-login');
    }
  }, [isAuthenticated, router]);

  // Show loading while checking authentication
  if (!isClient || isAuthenticated === null) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px'
      }}>
        Loading admin panel...
      </div>
    );
  }

  // Redirect happening, show loading
  if (isAuthenticated === false) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px'
      }}>
        Redirecting to login...
      </div>
    );
  }

  // User is authenticated, show admin panel
  return <AdminPanel />;
}

export default AdminWrapper;
