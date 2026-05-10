'use client'

import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function HabitsPage() {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits')
      const data = await response.json()
      if (response.ok) {
        setHabits(data.habits)
      }
    } catch (err) {
      setError('获取习惯失败')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Typography>加载中...</Typography>

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">习惯打卡</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          新建习惯
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {habits.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">暂无习惯目标</Typography>
          <Button variant="outlined" sx={{ mt: 2 }}>创建第一个习惯</Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {habits.map((habit: any) => (
            <Grid size={{ xs: 12, md: 6 }} key={habit.id}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">{habit.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {habit.description || '暂无描述'}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button startIcon={<CheckCircleIcon />}>今日打卡</Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}