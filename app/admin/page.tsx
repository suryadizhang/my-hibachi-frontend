'use client'

import dynamic from 'next/dynamic'

// Dynamically import the new optimized AdminDashboard
const AdminDashboard = dynamic(() => import('../../components/admin/AdminDashboard'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      background: '#f8f9fa'
    }}>
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p style={{ fontSize: '18px', color: '#6c757d' }}>
        Loading optimized admin dashboard...
      </p>
    </div>
  )
})

export default function AdminPage() {
  return <AdminDashboard />;
}
