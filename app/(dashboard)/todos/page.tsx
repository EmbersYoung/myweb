'use client'

import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Checkbox from '@mui/material/Checkbox'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import Alert from '@mui/material/Alert'
import { format } from 'date-fns'

interface Todo {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  dueDate?: string
  createdAt: string
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  })
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '获取失败')
        return
      }

      setTodos(data.todos)
    } catch (err) {
      setError('获取待办事项失败')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (todo?: Todo) => {
    if (todo) {
      setEditingTodo(todo)
      setFormData({
        title: todo.title,
        description: todo.description || '',
        priority: todo.priority,
        dueDate: todo.dueDate ? format(new Date(todo.dueDate), 'yyyy-MM-dd') : '',
      })
    } else {
      setEditingTodo(null)
      setFormData({ title: '', description: '', priority: 'medium', dueDate: '' })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingTodo(null)
  }

  const handleSubmit = async () => {
    setError('')
    try {
      const url = editingTodo ? `/api/todos/${editingTodo.id}` : '/api/todos'
      const method = editingTodo ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '操作失败')
        return
      }

      fetchTodos()
      handleCloseDialog()
    } catch (err) {
      setError('操作失败')
    }
  }

  const handleToggleStatus = async (todo: Todo) => {
    try {
      const newStatus = todo.status === 'completed' ? 'pending' : 'completed'
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchTodos()
      }
    } catch (err) {
      setError('更新状态失败')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除吗？')) return

    try {
      const response = await fetch(`/api/todos/${id}`, { method: 'DELETE' })

      if (response.ok) {
        fetchTodos()
      }
    } catch (err) {
      setError('删除失败')
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true
    return todo.status === filter
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  if (loading) {
    return <Typography>加载中...</Typography>
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
        <Typography variant="h4" sx={{ fontSize: { xs: '1.75rem', md: '2rem' } }}>待办事项</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          新建
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>筛选</InputLabel>
          <Select value={filter} label="筛选" onChange={(e) => setFilter(e.target.value)}>
            <MenuItem value="all">全部</MenuItem>
            <MenuItem value="pending">待完成</MenuItem>
            <MenuItem value="completed">已完成</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredTodos.length === 0 ? (
        <Paper sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
          <Typography color="text.secondary">暂无待办事项</Typography>
        </Paper>
      ) : (
        <List sx={{ px: { xs: 0, sm: 0 } }}>
          {filteredTodos.map((todo) => (
            <ListItem
              key={todo.id}
              sx={{
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 2,
                opacity: todo.status === 'completed' ? 0.6 : 1,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                py: { xs: 2, sm: 1 },
              }}
              secondaryAction={
                <Box sx={{ display: 'flex', gap: 0.5, position: { xs: 'static', sm: 'absolute' }, right: { sm: 16 }, mt: { xs: 1, sm: 0 } }}>
                  <IconButton onClick={() => handleOpenDialog(todo)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(todo.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: { xs: 1, sm: 0 } }}>
                <Checkbox
                  checked={todo.status === 'completed'}
                  onChange={() => handleToggleStatus(todo)}
                />
                <ListItemText
                  primary={todo.title}
                  sx={{ '& .MuiListItemText-primary': { fontSize: { xs: '0.95rem', md: '1rem' } } }}
                />
              </Box>
              {todo.description && (
                <Typography variant="body2" color="text.secondary" sx={{ ml: { sm: 4 }, mb: { xs: 1, sm: 0.5 } }}>
                  {todo.description}
                </Typography>
              )}
              <Box sx={{ ml: { sm: 4 }, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={todo.priority}
                  color={getPriorityColor(todo.priority)}
                  size="small"
                />
                {todo.dueDate && (
                  <Chip
                    label={format(new Date(todo.dueDate), 'yyyy-MM-dd')}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingTodo ? '编辑待办' : '新建待办'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="标题"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="描述"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>优先级</InputLabel>
            <Select
              value={formData.priority}
              label="优先级"
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <MenuItem value="low">低</MenuItem>
              <MenuItem value="medium">中</MenuItem>
              <MenuItem value="high">高</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="截止日期"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            margin="normal"
            slotProps={{
              inputLabel: { shrink: true }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ width: { xs: '100%', sm: 'auto' } }}>取消</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            {editingTodo ? '保存' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}