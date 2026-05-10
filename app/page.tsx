'use client'

import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaEnvelope,
  FaRocket,
  FaArrowUp,
  FaHeart
} from 'react-icons/fa'
import AssignmentIcon from '@mui/icons-material/Assignment'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import BookIcon from '@mui/icons-material/Book'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.08) 0%, rgba(124, 77, 255, 0.08) 100%)',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '5rem', lg: '6rem' },
            fontWeight: 900,
            mb: 2,
            background: 'linear-gradient(135deg, #9c27b0 0%, #7c4dff 50%, #ba68c8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}
        >
          你好，我是开发者
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.2rem', md: '1.8rem' },
            mb: 4,
            color: 'text.secondary',
            fontFamily: 'monospace',
          }}
        >
          全栈开发者 | 热爱编程 | 终身学习者
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<FaRocket />}
            sx={{
              background: 'linear-gradient(135deg, #9c27b0 0%, #7c4dff 100%)',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              boxShadow: '0 4px 20px rgba(156, 39, 176, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #7c4dff 0%, #9c27b0 100%)',
              },
            }}
          >
            查看项目
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push('/todos')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderWidth: 2,
            }}
          >
            开始使用
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {[
            { icon: FaGithub, label: 'GitHub', href: 'https://github.com' },
            { icon: FaLinkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
            { icon: FaTwitter, label: 'Twitter', href: 'https://twitter.com' },
            { icon: FaEnvelope, label: 'Email', href: 'mailto:your@email.com' },
          ].map((item) => (
            <IconButton
              key={item.label}
              size="large"
              component="a"
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'text.secondary',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  color: 'primary.main',
                  backgroundColor: 'action.hover',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <item.icon size={28} />
            </IconButton>
          ))}
        </Box>

        <IconButton
          sx={{ 
            position: 'absolute', 
            bottom: 30,
            color: 'text.secondary',
            animation: 'bounce 2s infinite',
          }}
          onClick={() => {
            const element = document.getElementById('about')
            element?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <KeyboardArrowDownIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Box>

      {/* About Section */}
      <Box id="about" sx={{ py: 12, px: { xs: 2, md: 8 } }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3.5rem' },
              fontWeight: 800,
              mb: 6,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #9c27b0 0%, #7c4dff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            关于我
          </Typography>
          
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 6 },
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, #9c27b0, #7c4dff, #ba68c8)',
              },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 700,
                mb: 3,
                color: 'primary.main',
              }}
            >
              {'<开发者 />'}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 2,
                color: 'text.secondary',
                mb: 3,
              }}
            >
              我是一名热爱技术的全栈开发者，专注于构建优雅、高效的Web应用。
              喜欢探索新技术，解决复杂问题，并将想法转化为现实。
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {['创意', '激情', '专业', '持续学习'].map((item) => (
                <Chip
                  key={item}
                  label={item}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.15) 0%, rgba(124, 77, 255, 0.15) 100%)',
                    border: '1px solid',
                    borderColor: 'primary.main',
                    fontWeight: 600,
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Skills Section */}
      <Box sx={{ py: 12, px: { xs: 2, md: 8 }, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3.5rem' },
              fontWeight: 800,
              mb: 6,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #9c27b0 0%, #7c4dff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            技术栈
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { name: 'TypeScript', color: '#3178C6', level: 95 },
              { name: 'React', color: '#61DAFB', level: 90 },
              { name: 'Next.js', color: '#000000', level: 88 },
              { name: 'Node.js', color: '#339933', level: 85 },
              { name: 'Python', color: '#3776AB', level: 80 },
              { name: 'Tailwind', color: '#06B6D4', level: 90 },
            ].map((skill) => (
              <Paper
                key={skill.name}
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: skill.color,
                  borderRadius: 3,
                  minWidth: 150,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 0 30px ${skill.color}20`,
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: skill.color }}>
                  {skill.name}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {skill.level}% 熟练度
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Projects Section */}
      <Box sx={{ py: 12, px: { xs: 2, md: 8 } }} id="projects">
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3.5rem' },
              fontWeight: 800,
              mb: 6,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #9c27b0 0%, #7c4dff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            我的项目
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {[
              {
                title: '待办事项管理',
                description: '高效的任务管理系统',
                icon: AssignmentIcon,
                tech: ['TypeScript', 'React', 'Prisma'],
                color: '#9c27b0',
                href: '/todos',
              },
              {
                title: '习惯打卡',
                description: '养成好习惯的利器',
                icon: FitnessCenterIcon,
                tech: ['Next.js', 'Chart.js'],
                color: '#ba68c8',
                href: '/habits',
              },
              {
                title: '日常记录',
                description: '记录生活点滴',
                icon: BookIcon,
                tech: ['React', 'Tailwind'],
                color: '#7c4dff',
                href: '/journal',
              },
            ].map((project) => (
              <Paper
                key={project.title}
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid',
                  borderColor: project.color,
                  borderRadius: 4,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: `0 10px 40px ${project.color}30`,
                    transform: 'scale(1.05)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: `linear-gradient(90deg, ${project.color}, transparent)`,
                  },
                }}
                onClick={() => router.push(project.href)}
              >
                <project.icon sx={{ fontSize: 56, color: project.color, mb: 3 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }} gutterBottom>
                  {project.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
                  {project.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {project.tech.map((tech) => (
                    <Chip
                      key={tech}
                      label={tech}
                      size="small"
                      sx={{
                        background: `${project.color}15`,
                        border: '1px solid',
                        borderColor: `${project.color}40`,
                        color: project.color,
                        fontWeight: 600,
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{ py: 12, px: { xs: 2, md: 8 }, backgroundColor: 'background.default' }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3.5rem' },
              fontWeight: 800,
              mb: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #9c27b0 0%, #7c4dff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            联系我
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 6, fontSize: '1.2rem' }}>
            有任何问题或建议？欢迎随时联系我
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            {[
              { icon: FaGithub, label: 'GitHub', href: 'https://github.com', color: '#333' },
              { icon: FaLinkedin, label: 'LinkedIn', href: 'https://linkedin.com', color: '#0077B5' },
              { icon: FaTwitter, label: 'Twitter', href: 'https://twitter.com', color: '#1DA1F2' },
              { icon: FaEnvelope, label: 'Email', href: 'mailto:your@email.com', color: '#9c27b0' },
            ].map((item) => (
              <Paper
                key={item.label}
                elevation={0}
                component="a"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  textDecoration: 'none',
                  border: '1px solid',
                  borderColor: item.color,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  minWidth: 150,
                  '&:hover': {
                    boxShadow: `0 10px 30px ${item.color}20`,
                    background: `${item.color}10`,
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <item.icon size={28} style={{ color: item.color }} />
                <Typography sx={{ fontWeight: 600 }}>{item.label}</Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          textAlign: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
          background: 'rgba(255, 255, 255, 0.02)',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} MyWeb. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Built with Next.js, React, TypeScript & <Box component="span" sx={{ color: '#9c27b0' }}>♥</Box>
        </Typography>
      </Box>
    </Box>
  )
}