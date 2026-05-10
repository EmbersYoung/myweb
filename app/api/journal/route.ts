import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ entries: [] })
    }

    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ entries })
  } catch (error) {
    console.error('获取记录错误:', error)
    return NextResponse.json({ entries: [] })
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
    const { title, content, mood, tags, weather, location } = body

    if (!content) {
      return NextResponse.json({ error: '内容必填' }, { status: 400 })
    }

    const entry = await prisma.journalEntry.create({
      data: {
        userId,
        title,
        content,
        mood: mood || 'neutral',
        tags: tags || [],
        weather,
        location,
      },
    })

    return NextResponse.json({ entry })
  } catch (error) {
    console.error('创建记录错误:', error)
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}