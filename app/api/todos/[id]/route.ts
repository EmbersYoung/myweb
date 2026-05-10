import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, description, status, priority, dueDate } = body

    const todo = await prisma.todo.update({
      where: {
        id,
        userId,
      },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        completedAt: status === 'completed' ? new Date() : null,
      },
    })

    return NextResponse.json({ todo })
  } catch (error) {
    console.error('更新待办错误:', error)
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const { id } = await params
    
    await prisma.todo.delete({
      where: {
        id,
        userId,
      },
    })

    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除待办错误:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}