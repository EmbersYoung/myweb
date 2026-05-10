'use client'

import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Fab from '@mui/material/Fab'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Alert from '@mui/material/Alert'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { zhCN } from 'date-fns/locale'

interface Habit {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  targetFrequency?: number
  createdAt: string
  records?: Array<{ completedAt: string }>
}

export default function HabitsPage() {
  const router = useRouter()
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#9c27b0',
    targetFrequency: 1,
  })

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits')
      const data = await response.json()
      if (response.ok) {
        setHabits(data.habits || [])
      } else {
        setError(data.error || '获取失败')
      }
    } catch (err) {
      setError('获取习惯列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (habit?: Habit) => {
    if (habit) {
      setEditingHabit(habit)
      setFormData({
        name: habit.name,
        description: habit.description || '',
        color: habit.color || '#9c27b0',
        targetFrequency: habit.targetFrequency || 1,
      })
    } else {
      setEditingHabit(null)
      setFormData({ name: '', description: '', color: '#9c27b0', targetFrequency: 1 })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingHabit(null)
    setError('')
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('请输入习惯名称')
      return
    }

    setError('')
    try {
      const url = editingHabit ? `/api/habits/${editingHabit.id}` : '/api/habits'
      const method = editingHabit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || '操作失败')
        return
      }

      fetchHabits()
      handleCloseDialog()
    } catch (err) {
      setError('操作失败')
    }
  }

  const handleCheckIn = async (habitId: string) => {
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId, action: 'checkIn' }),
      })

      if (response.ok) {
        fetchHabits()
      }
    } catch (err) {
      setError('打卡失败')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此习惯吗？')) return

    try {
      const response = await fetch(`/api/habits/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchHabits()
      }
    } catch (err) {
      setError('删除失败')
    }
  }

  const getHabitStats = (habit: Habit) => {
    const records = habit.records || []
    const todayRecords = records.filter(r => isToday(new Date(r.completedAt)))
    const totalDays = records.length
    
    let streak = 0
    const sortedRecords = [...records].sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    
    for (let i = 0; i < sortedRecords.length; i++) {
      const recordDate = new Date(sortedRecords[i].completedAt)
      const expectedDate = addDays(new Date(), -i)
      
      if (isToday(recordDate) || format(recordDate, 'yyyy-MM-dd') === format(expectedDate, 'yyyy-MM-dd')) {
        streak++
      } else {
        break
      }
    }

    return { todayRecords, totalDays, streak }
  }

  const addDays = (date: Date, days: number) => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography variant="h6" color="text.secondary">加载中...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ pb: 10 }}>
      {/* Back Button */}
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/')}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
              backgroundColor: 'primary.light',
            },
          }}
        >
          返回首页
        </Button>
      </Box>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 800, 
            fontSize: { xs: '2rem', md: '2.5rem' },
            mb: 1
          }}
        >
          习惯打卡
        </Typography>
        <Typography variant="body1" color="text.secondary">
          坚持好习惯，每天进步一点点
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      {/* Empty State */}
      {habits.length === 0 && (
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            borderRadius: 4,
            background: 'rgba(156, 39, 176, 0.05)',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <EmojiEventsIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            还没有习惯目标
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            创建一个习惯，开始你的自律之旅
          </Typography>
          <Button 
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2 }}
          >
            创建习惯
          </Button>
        </Paper>
      )}

      {/* Habit Cards */}
      <AnimatePresence>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {habits.map((habit, index) => {
            const stats = getHabitStats(habit)
            const isCompletedToday = stats.todayRecords.length > 0
            
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={habit.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      border: '2px solid',
                      borderColor: isCompletedToday ? 'success.main' : 'divider',
                      bgcolor: isCompletedToday ? 'success.light' : 'background.paper',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(156, 39, 176, 0.2)',
                      },
                    }}
                  >
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: habit.color || 'primary.main',
                          width: 48,
                          height: 48,
                        }}
                      >
                        {habit.name[0]?.toUpperCase() || 'H'}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {habit.name}
                        </Typography>
                        {habit.description && (
                          <Typography variant="body2" color="text.secondary">
                            {habit.description}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(habit)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(habit.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<TrendingUpIcon sx={{ fontSize: 18 }} />}
                        label={`${stats.streak} 天连续`}
                        size="small"
                        color={stats.streak >= 7 ? 'success' : 'default'}
                        sx={{ fontWeight: 600 }}
                      />
                      <Chip
                        label={`总计 ${stats.totalDays} 天`}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>

                    {/* Check-in Button */}
                    <Button
                      fullWidth
                      variant={isCompletedToday ? 'outlined' : 'contained'}
                      startIcon={isCompletedToday ? <CheckCircleIcon /> : undefined}
                      onClick={() => !isCompletedToday && handleCheckIn(habit.id)}
                      disabled={isCompletedToday}
                      sx={{
                        borderRadius: 2,
                        mt: 'auto',
                        fontWeight: 600,
                      }}
                    >
                      {isCompletedToday ? '今日已完成' : '今日打卡'}
                    </Button>
                  </Paper>
                </motion.div>
              </Grid>
            )
          })}
        </Grid>
      </AnimatePresence>

      {/* FAB */}
      {habits.length > 0 && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => handleOpenDialog()}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            boxShadow: '0 4px 20px rgba(156, 39, 176, 0.4)',
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem' }}>
          {editingHabit ? '编辑习惯' : '创建习惯'}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          
          <TextField
            fullWidth
            label="习惯名称"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
            autoFocus
          />
          <TextField
            fullWidth
            label="习惯描述"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="目标频率（天/周）"
            type="number"
            value={formData.targetFrequency}
            onChange={(e) => setFormData({ ...formData, targetFrequency: parseInt(e.target.value) })}
            margin="normal"
            slotProps={{
              htmlInput: { min: 1, max: 7 }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={handleCloseDialog} sx={{ borderRadius: 2 }}>
            取消
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ borderRadius: 2, minWidth: 100 }}
          >
            {editingHabit ? '保存' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}