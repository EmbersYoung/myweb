import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ habits: [] })
    }

    const habits = await prisma.habit.findMany({
      where: { userId },
      include: { records: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ habits })
  } catch (error) {
    console.error('获取习惯错误:', error)
    return NextResponse.json({ habits: [] })
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
    const { name, description, icon, color, targetFrequency } = body

    if (!name) {
      return NextResponse.json({ error: '名称必填' }, { status: 400 })
    }

    const habit = await prisma.habit.create({
      data: {
        userId,
        name,
        description,
        icon,
        color,
        targetFrequency,
      },
    })

    return NextResponse.json({ habit })
  } catch (error) {
    console.error('创建习惯错误:', error)
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}