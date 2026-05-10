'use client'

import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
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
import IconButton from '@mui/material/IconButton'
import Checkbox from '@mui/material/Checkbox'
import Fab from '@mui/material/Fab'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import { format, isToday, isTomorrow, addDays } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
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
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
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

      setTodos(data.todos || [])
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
    setError('')
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('请输入标题')
      return
    }

    setError('')
    setSubmitting(true)
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

      if (editingTodo) {
        setTodos(prevTodos => 
          prevTodos.map(t => 
            t.id === editingTodo.id ? data.todo : t
          )
        )
      } else {
        setTodos(prevTodos => [data.todo, ...prevTodos])
      }
      
      handleCloseDialog()
    } catch (err) {
      setError('操作失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (todo: Todo) => {
    const newStatus = todo.status === 'completed' ? 'pending' : 'completed'
    
    setTodos(prevTodos => 
      prevTodos.map(t => 
        t.id === todo.id ? { ...t, status: newStatus } : t
      )
    )
    
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        setTodos(prevTodos => 
          prevTodos.map(t => 
            t.id === todo.id ? { ...t, status: todo.status } : t
          )
        )
        setError('更新状态失败')
      }
    } catch (err) {
      setTodos(prevTodos => 
        prevTodos.map(t => 
          t.id === todo.id ? { ...t, status: todo.status } : t
        )
      )
      setError('更新状态失败')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除吗？')) return
    
    setTodos(prevTodos => prevTodos.filter(t => t.id !== id))
    
    try {
      const response = await fetch(`/api/todos/${id}`, { method: 'DELETE' })

      if (!response.ok) {
        fetchTodos()
        setError('删除失败')
      }
    } catch (err) {
      fetchTodos()
      setError('删除失败')
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true
    if (filter === 'active') return todo.status === 'pending'
    if (filter === 'completed') return todo.status === 'completed'
    return true
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#9c27b0'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '高'
      case 'medium': return '中'
      case 'low': return '低'
      default: return priority
    }
  }

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isToday(date)) return '今天'
    if (isTomorrow(date)) return '明天'
    return format(date, 'M月d日', { locale: zhCN })
  }

  const pendingTodos = filteredTodos.filter(t => t.status === 'pending')
  const completedTodos = filteredTodos.filter(t => t.status === 'completed')

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
          待办事项
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {pendingTodos.length} 个任务待完成
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      {/* Filter Tabs */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {['all', 'active', 'completed'].map((filterValue) => (
          <Chip
            key={filterValue}
            label={filterValue === 'all' ? '全部' : filterValue === 'active' ? '待完成' : '已完成'}
            onClick={() => setFilter(filterValue)}
            variant={filter === filterValue ? 'filled' : 'outlined'}
            color={filter === filterValue ? 'primary' : 'default'}
            sx={{ fontWeight: 600 }}
          />
        ))}
      </Box>

      {/* Empty State */}
      {filteredTodos.length === 0 && (
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
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {filter === 'completed' ? '还没有完成的任务' : '暂无待办事项'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            点击下方按钮添加新任务
          </Typography>
        </Paper>
      )}

      {/* Todo Cards - Pending */}
      {pendingTodos.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {filter !== 'completed' && (
            <Typography variant="overline" color="text.secondary" sx={{ mb: 2, fontWeight: 700 }}>
              待完成
            </Typography>
          )}
          <AnimatePresence>
            {pendingTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Paper
                  sx={{
                    mb: 2,
                    p: 3,
                    borderRadius: 3,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      boxShadow: '0 4px 20px rgba(156, 39, 176, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <IconButton
                      onClick={() => handleToggleStatus(todo)}
                      sx={{
                        mt: -0.5,
                        color: 'primary.main',
                        '&:hover': { bgcolor: 'primary.light' }
                      }}
                    >
                      <RadioButtonUncheckedIcon sx={{ fontSize: 28 }} />
                    </IconButton>
                    
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          mb: 0.5,
                          wordBreak: 'break-word'
                        }}
                      >
                        {todo.title}
                      </Typography>
                      
                      {todo.description && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ mb: 1.5, lineHeight: 1.6 }}
                        >
                          {todo.description}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                        <Chip
                          icon={<PriorityHighIcon sx={{ fontSize: 16 }} />}
                          label={getPriorityLabel(todo.priority)}
                          size="small"
                          sx={{
                            bgcolor: `${getPriorityColor(todo.priority)}15`,
                            color: getPriorityColor(todo.priority),
                            fontWeight: 600,
                            border: `1px solid ${getPriorityColor(todo.priority)}40`
                          }}
                        />
                        
                        {todo.dueDate && (
                          <Chip
                            icon={<CalendarTodayIcon sx={{ fontSize: 16 }} />}
                            label={formatDateLabel(todo.dueDate)}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 0.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <IconButton
                        onClick={() => handleOpenDialog(todo)}
                        size="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(todo.id)}
                        size="small"
                        sx={{ color: 'error.main' }}
                        disabled={deleting === todo.id}
                      >
                        {deleting === todo.id ? (
                          <Box sx={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid', borderColor: 'error.main', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <DeleteIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      )}

      {/* Divider */}
      {pendingTodos.length > 0 && completedTodos.length > 0 && filter === 'all' && (
        <Divider sx={{ my: 3 }} />
      )}

      {/* Todo Cards - Completed */}
      {completedTodos.length > 0 && filter !== 'active' && (
        <Box>
          {filter === 'all' && (
            <Typography variant="overline" color="text.secondary" sx={{ mb: 2, fontWeight: 700 }}>
              已完成 ({completedTodos.length})
            </Typography>
          )}
          <AnimatePresence>
            {completedTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Paper
                  sx={{
                    mb: 2,
                    p: 3,
                    borderRadius: 3,
                    opacity: 0.7,
                    bgcolor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <IconButton
                      onClick={() => handleToggleStatus(todo)}
                      sx={{
                        mt: -0.5,
                        color: 'success.main'
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 28 }} />
                    </IconButton>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          textDecoration: 'line-through',
                          opacity: 0.6
                        }}
                      >
                        {todo.title}
                      </Typography>
                    </Box>

                    <IconButton
                      onClick={() => handleDelete(todo.id)}
                      size="small"
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      )}

      {/* FAB Button */}
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

      {/* Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem' }}>
          {editingTodo ? '编辑任务' : '新建任务'}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          
          <TextField
            fullWidth
            label="任务标题"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            required
            autoFocus
          />
          <TextField
            fullWidth
            label="任务描述"
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
              <MenuItem value="high">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef4444' }} />
                  高优先级
                </Box>
              </MenuItem>
              <MenuItem value="medium">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                  中优先级
                </Box>
              </MenuItem>
              <MenuItem value="low">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#10b981' }} />
                  低优先级
                </Box>
              </MenuItem>
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
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ borderRadius: 2 }}
          >
            取消
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={submitting}
            sx={{ borderRadius: 2, minWidth: 100 }}
          >
            {submitting ? '处理中...' : editingTodo ? '保存' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}