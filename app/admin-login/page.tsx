'use client';

import dynamic from 'next/dynamic';

// Dynamic import for the AdminLogin component
const AdminLogin = dynamic(() => import('../../components/AdminLogin'), {
  ssr: false,
  loading: () => <div className="text-center p-8">Loading admin login...</div>
});

export default function AdminLoginPage() {
  return <AdminLogin />;
}
