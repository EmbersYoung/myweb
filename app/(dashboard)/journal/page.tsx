'use client'

import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'
import AddIcon from '@mui/icons-material/Add'

export default function JournalPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/journal')
      const data = await response.json()
      if (response.ok) {
        setEntries(data.entries)
      }
    } catch (err) {
      setError('获取记录失败')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Typography>加载中...</Typography>

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">日常记录</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          新建记录
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {entries.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">暂无记录</Typography>
          <Button variant="outlined" sx={{ mt: 2 }}>写下第一条记录</Button>
        </Paper>
      ) : (
        <Box>
          {entries.map((entry: any) => (
            <Paper key={entry.id} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">{entry.title || '无标题'}</Typography>
              <Typography variant="body1">{entry.content}</Typography>
            </Paper>
          ))}
        </Box>
      )}
    </>
  )
}