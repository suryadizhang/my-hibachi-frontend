'use client'

import CustomNavbar from './Navbar'

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
