import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const logs: string[] = []
  logs.push(`[${new Date().toISOString()}] 注册请求开始`)
  
  try {
    const body = await request.json()
    logs.push(`请求body: ${JSON.stringify(body)}`)
    
    const { email, username, password } = body

    if (!email || !username || !password) {
      logs.push('缺少必填字段')
      return NextResponse.json(
        { 
          success: false,
          error: '请提供所有必填字段', 
          logs 
        },
        { status: 400 }
      )
    }

    logs.push('检查用户是否存在...')
    
    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      })
      logs.push(`查询结果: ${existingUser ? JSON.stringify({ id: existingUser.id, email: existingUser.email }) : 'null'}`)

      if (existingUser) {
        logs.push('用户已存在')
        return NextResponse.json(
          { 
            success: false,
            error: '用户已存在', 
            logs 
          },
          { status: 400 }
        )
      }
    } catch (dbError) {
      logs.push(`数据库查询错误: ${dbError instanceof Error ? dbError.message : String(dbError)}`)
      return NextResponse.json(
        { 
          success: false,
          error: '数据库查询失败', 
          logs,
          dbError: dbError instanceof Error ? {
            name: dbError.name,
            message: dbError.message,
            stack: dbError.stack
          } : String(dbError)
        },
        { status: 500 }
      )
    }

    logs.push('加密密码...')
    const passwordHash = await bcrypt.hash(password, 10)
    logs.push('密码加密完成')

    logs.push('创建用户...')
    try {
      const user = await prisma.user.create({
        data: {
          email,
          username,
          passwordHash,
        },
      })
      logs.push(`用户创建成功: ${user.id}`)

      return NextResponse.json({
        success: true,
        message: '注册成功',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        logs
      })
    } catch (createError) {
      logs.push(`用户创建错误: ${createError instanceof Error ? createError.message : String(createError)}`)
      return NextResponse.json(
        { 
          success: false,
          error: '用户创建失败', 
          logs,
          createError: createError instanceof Error ? {
            name: createError.name,
            message: createError.message,
            stack: createError.stack
          } : String(createError)
        },
        { status: 500 }
      )
    }
  } catch (error) {
    logs.push(`请求处理错误: ${error instanceof Error ? error.message : String(error)}`)
    return NextResponse.json(
      { 
        success: false,
        error: '请求处理失败', 
        logs,
        errorDetails: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : String(error)
      },
      { status: 500 }
    )
  }
}