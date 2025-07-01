'use client'

import CustomNavbar from '../components/Navbar'

export default function ClientLayout({ children }) {
  return (
    <>
      <CustomNavbar />
      <main className="main-content">
        {children}
      </main>
    </>
  )
}
