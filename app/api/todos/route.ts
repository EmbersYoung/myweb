import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const todos = await prisma.todo.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        createdAt: true,
      },
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ todos })
  } catch (error) {
    console.error('获取待办错误:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, priority, dueDate } = body

    if (!title) {
      return NextResponse.json({ error: '标题必填' }, { status: 400 })
    }

    const todo = await prisma.todo.create({
      data: {
        userId,
        title,
        description,
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    return NextResponse.json({ todo })
  } catch (error) {
    console.error('创建待办错误:', error)
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}