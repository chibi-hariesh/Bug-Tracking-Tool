import React from 'react'
import Header from './Header'

const Manager_Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main style={{ minHeight: '82vh', paddingTop: '80px' }} >
        {children}
      </main>

    </div>
  )
}

export default Manager_Layout