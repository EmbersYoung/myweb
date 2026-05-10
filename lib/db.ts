import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = 
  globalForPrisma.prisma || 
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// 测试连接（仅在开发环境）
if (process.env.NODE_ENV === 'development') {
  prisma.$connect()
    .then(() => console.log('✓ Prisma Client 连接成功'))
    .catch((error) => console.error('✗ Prisma Client 连接失败:', error))
}