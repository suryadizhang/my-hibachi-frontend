'use client'

import dynamic from 'next/dynamic'

// Dynamically import AdminPanel with no SSR to prevent localStorage issues
const AdminPanel = dynamic(() => import('../../components/AdminPanel'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh',
      fontSize: '18px'
    }}>
      Loading admin panel...
    </div>
  )
})

export default function AdminPage() {
  return <AdminPanel />;
}
