# MyWeb - 个人主页系统

一个基于 Next.js + Supabase 的个人主页系统，包含待办事项、习惯打卡、日常记录等功能。

## 功能特性

- ✅ 待办事项管理（创建、编辑、删除、优先级、截止日期）
- ✅ 习惯打卡（每日打卡、连续天数统计、可视化图表）
- ✅ 日常记录（日记、备忘录、心情、标签）
- ✅ 数据导入导出（JSON格式）
- ✅ 深色模式切换
- ✅ PWA支持
- ✅ Material Design UI

## 技术栈

- **前端**: Next.js 16, React 19, Material UI, Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: Neon PostgreSQL (Serverless)
- **ORM**: Prisma
- **认证**: 自定义认证 (bcryptjs + cookies)
- **部署**: Vercel

## 快速开始

### 1. 配置环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

在 `.env.local` 中配置数据库连接：

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. 安装依赖

```bash
npm install
```

### 3. 初始化数据库

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
myweb/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证相关页面
│   ├── (dashboard)/       # 主功能区
│   ├── api/               # API路由
│   ├── layout.tsx         # 全局布局
│   └── page.tsx           # 首页
├── components/            # React组件
│   └── ThemeRegistry.tsx  # Material UI主题
├── lib/                   # 工具库
│   ├── db.ts             # Prisma客户端
│   └── supabase.ts       # Supabase客户端
├── prisma/                # Prisma配置
│   └── schema.prisma     # 数据库模型
├── types/                 # TypeScript类型定义
├── .env.example          # 环境变量模板
├── DESIGN.md             # 详细设计文档
└── README.md             # 项目说明
```

## 数据库模型

- **Users**: 用户表（id, email, username, passwordHash）
- **Todos**: 待办事项（title, status, priority, dueDate）
- **Habits**: 习惯目标（name, icon, targetFrequency）
- **HabitRecords**: 打卡记录（habitId, completedAt）
- **JournalEntries**: 日常记录（content, mood, tags）

## API接口

- `/api/auth/*` - 认证接口（注册、登录、登出）
- `/api/todos/*` - 待办事项CRUD
- `/api/habits/*` - 习惯打卡管理
- `/api/journal/*` - 日常记录管理
- `/api/export/*` - 数据导入导出

## 部署到 Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel

# 配置环境变量（在 Vercel Dashboard）
# 然后生产部署
vercel --prod
```

## 开发进度

✅ Phase 1: 项目初始化
- Next.js 项目创建
- Material UI 主题配置
- 深色模式支持
- 基础页面框架

🚧 Phase 2-6: 核心功能开发
- 用户认证
- 待办事项管理
- 习惯打卡
- 日常记录
- 数据导入导出

## 环境要求

- Node.js 18+
- npm 9+
- Neon PostgreSQL 数据库（免费）
- Vercel 账号（免费）

## 许可证

MIT