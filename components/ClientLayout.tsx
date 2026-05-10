'use client'

import React from 'react'
import Navigation from '@/components/Navigation'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import { usePathname } from 'next/navigation'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <>
      <Navigation />
      <Box sx={{ pt: isHomePage ? 0 : 8 }}>
        {isHomePage ? (
          <Box sx={{ width: '100%', overflow: 'hidden' }}>{children}</Box>
        ) : (
          <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>{children}</Box>
          </Container>
        )}
      </Box>
    </>
  )
}