import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function testDatabase() {
  console.log('=== 数据库连接测试开始 ===\n')
  
  try {
    // 测试连接
    console.log('1. 测试数据库连接...')
    await prisma.$connect()
    console.log('✓ 数据库连接成功\n')
    
    // 测试查询
    console.log('2. 测试查询 users 表...')
    const users = await prisma.user.findMany()
    console.log(`✓ 查询成功，当前有 ${users.length} 个用户\n`)
    
    // 测试创建表结构
    console.log('3. 检查表结构...')
    const userCount = await prisma.user.count()
    console.log(`✓ users 表存在，记录数: ${userCount}\n`)
    
    console.log('=== 所有测试通过 ===')
    return { success: true, message: '数据库连接正常' }
    
  } catch (error) {
    console.error('\n=== 数据库连接失败 ===')
    console.error('错误类型:', error?.constructor?.name)
    console.error('错误信息:', error instanceof Error ? error.message : String(error))
    
    if (error instanceof Error) {
      console.error('\n错误详情:')
      console.error('- Name:', error.name)
      console.error('- Message:', error.message)
      
      if (error.message.includes('Prisma Client')) {
        console.error('\n💡 解决方案:')
        console.error('运行: npx prisma generate')
      } else if (error.message.includes('Can\'t reach database')) {
        console.error('\n💡 解决方案:')
        console.error('1. 检查 .env.local 文件中的 DATABASE_URL')
        console.error('2. 确认 Supabase 数据库正常运行')
        console.error('3. 检查网络连接')
      } else if (error.message.includes('Table') || error.message.includes('does not exist')) {
        console.error('\n💡 解决方案:')
        console.error('运行: npx prisma db push')
      }
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      type: error?.constructor?.name
    }
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()
  .then(result => {
    console.log('\n最终结果:', JSON.stringify(result, null, 2))
    process.exit(result.success ? 0 : 1)
  })
  .catch(error => {
    console.error('未知错误:', error)
    process.exit(1)
  })