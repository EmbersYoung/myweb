'use client'

import React, { useState, useMemo } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import useMediaQuery from '@mui/material/useMediaQuery'

export const ThemeContext = React.createContext<{
  toggleColorMode: () => void
  mode: 'light' | 'dark'
}>({
  toggleColorMode: () => {},
  mode: 'dark',
})

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = useState<'light' | 'dark'>('dark')

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
      mode,
    }),
    [mode]
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#9c27b0',
            light: '#ba68c8',
            dark: '#7b1fa2',
          },
          secondary: {
            main: '#7c4dff',
            light: '#b388ff',
            dark: '#651fff',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#1a0a2e',
            paper: mode === 'light' ? '#ffffff' : '#240f42',
          },
          text: {
            primary: mode === 'light' ? '#171717' : '#e1bee7',
            secondary: mode === 'light' ? '#666666' : '#b39ddb',
          },
          divider: mode === 'light' ? '#e0e0e0' : '#4a2c6a',
        },
        typography: {
          fontFamily:
            '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
          h1: {
            fontWeight: 900,
            letterSpacing: '-0.02em',
          },
          h2: {
            fontWeight: 800,
            letterSpacing: '-0.01em',
          },
          h3: {
            fontWeight: 700,
          },
          h4: {
            fontWeight: 700,
          },
          h5: {
            fontWeight: 700,
          },
          h6: {
            fontWeight: 700,
            letterSpacing: '-0.01em',
          },
          body1: {
            lineHeight: 1.6,
          },
          body2: {
            lineHeight: 1.6,
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 12,
                padding: '8px 24px',
              },
              contained: {
                boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(156, 39, 176, 0.4)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                borderRadius: 16,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                boxShadow: 'none',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                border: mode === 'dark' ? '1px solid rgba(156, 39, 176, 0.2)' : 'none',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 32px rgba(156, 39, 176, 0.25)',
                  transform: 'translateY(-2px)',
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 12,
                  '&:hover fieldset': {
                    borderColor: '#9c27b0',
                  },
                },
              },
            },
          },
        },
      }),
    [mode]
  )

  return (
    <ThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}