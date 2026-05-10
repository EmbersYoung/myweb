'use client'

import React, { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'

export default function DebugPage() {
  const [email, setEmail] = useState('test@example.com')
  const [username, setUsername] = useState('testuser')
  const [password, setPassword] = useState('password123')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const testRegister = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      })

      const data = await response.json()
      console.log('Response:', { status: response.status, data })

      setResult({
        status: response.status,
        data,
      })

      if (!response.ok) {
        setError(data.error || '注册失败')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('网络请求失败')
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      console.log('Session test:', { status: response.status, data })

      setResult({
        status: response.status,
        data,
        test: 'connection',
      })
    } catch (err) {
      console.error('Error:', err)
      setError('连接失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        注册功能诊断
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          测试注册
        </Typography>

        <TextField
          fullWidth
          label="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="密码"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={testRegister}
            disabled={loading}
          >
            {loading ? '测试中...' : '测试注册'}
          </Button>
          <Button
            variant="outlined"
            onClick={testConnection}
            disabled={loading}
          >
            测试连接
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            测试结果
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            HTTP Status: {result.status}
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 1,
              overflow: 'auto',
            }}
          >
            <pre>{JSON.stringify(result.data, null, 2)}</pre>
          </Box>
        </Paper>
      )}

      <Box sx={{ mt: 3 }}>
        <Button variant="outlined" href="/">
          返回首页
        </Button>
      </Box>
    </Box>
  )
}