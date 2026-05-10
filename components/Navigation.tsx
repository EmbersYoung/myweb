'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import AssignmentIcon from '@mui/icons-material/Assignment'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import BookIcon from '@mui/icons-material/Book'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import HomeIcon from '@mui/icons-material/Home'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useRouter } from 'next/navigation'
import { ThemeContext } from '@/components/ThemeRegistry'
import { FaTerminal } from 'react-icons/fa'

export default function Navigation() {
  const router = useRouter()
  const themeContext = React.useContext(ThemeContext)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  useEffect(() => {
    checkSession()
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      if (data.user) {
        setIsLoggedIn(true)
        setUser(data.user)
      }
    } catch (err) {
      setIsLoggedIn(false)
    }
  }

  const menuItems = [
    { text: '首页', icon: <HomeIcon />, path: '/' },
    { text: '待办事项', icon: <AssignmentIcon />, path: '/todos' },
    { text: '习惯打卡', icon: <FitnessCenterIcon />, path: '/habits' },
    { text: '日常记录', icon: <BookIcon />, path: '/journal' },
    { text: '设置', icon: <SettingsIcon />, path: '/settings' },
  ]

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleLogin = () => {
    router.push('/login')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setAnchorEl(null)
    router.push('/')
  }

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }

  const navItems = [
    { label: '关于', href: '#about' },
    { label: '技能', href: '#skills' },
    { label: '项目', href: '#projects' },
    { label: '联系', href: '#contact' },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const drawer = (
    <Box sx={{ width: 280 }} role="presentation">
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography
          variant="h6"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 700,
          }}
        >
          <FaTerminal />
          MyWeb
        </Typography>
      </Box>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  router.push(item.path)
                  setDrawerOpen(false)
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ '& .MuiTypography-root': { fontWeight: 600 } }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
        {isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: menuItems.length * 0.1 }}
          >
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary="登出"
                  sx={{ '& .MuiTypography-root': { fontWeight: 600 } }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        )}
      </List>
    </Box>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: scrolled ? 'background.paper' : 'transparent',
          boxShadow: scrolled ? 1 : 0,
          transition: 'all 0.3s ease',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h6"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                cursor: 'pointer',
              }}
              onClick={() => router.push('/')}
            >
              <FaTerminal style={{ fontSize: 20 }} />
              MyWeb
            </Typography>
          </motion.div>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navItems.map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  color="inherit"
                  onClick={() => scrollToSection(item.href)}
                  sx={{
                    fontWeight: 600,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: 0,
                      height: '2px',
                      backgroundColor: 'primary.main',
                      transition: 'all 0.3s ease',
                      transform: 'translateX(-50%)',
                    },
                    '&:hover::after': {
                      width: '100%',
                    },
                  }}
                >
                  {item.label}
                </Button>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                onClick={themeContext.toggleColorMode}
                color="inherit"
                sx={{ ml: 1 }}
              >
                {themeContext.mode === 'dark' ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon />
                )}
              </IconButton>
            </motion.div>
            {!isLoggedIn ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  color="inherit"
                  onClick={handleLogin}
                  sx={{ fontWeight: 600 }}
                >
                  登录
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                    onClick={handleUserMenuOpen}
                  >
                    {user?.avatarUrl ? (
                      <Avatar
                        src={user.avatarUrl}
                        alt={user.username || 'User'}
                        sx={{ width: 32, height: 32, border: '2px solid', borderColor: 'primary.main' }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: 'primary.main',
                          border: '2px solid',
                          borderColor: 'primary.light',
                        }}
                      >
                        {user?.username?.[0]?.toUpperCase() || <AccountCircleIcon />}
                      </Avatar>
                    )}
                    <Typography
                      sx={{
                        display: { xs: 'none', sm: 'block' },
                        fontWeight: 600,
                        fontSize: '0.9rem',
                      }}
                    >
                      {user?.username || '用户'}
                    </Typography>
                  </Box>
                </motion.div>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  sx={{
                    mt: 1,
                    '& .MuiPaper-root': {
                      minWidth: 180,
                      borderRadius: 2,
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleUserMenuClose()
                      router.push('/settings')
                    }}
                    sx={{ py: 1.5 }}
                  >
                    <SettingsIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    设置
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    登出
                  </MenuItem>
                </Menu>
              </>
            )}
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              sx={{ display: { xs: 'flex', md: 'none' } }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </Box>
  )
}