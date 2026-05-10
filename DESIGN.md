# MyWeb - 个人主页系统设计文档

## 1. 项目概述

### 1.1 项目目标
创建一个个人主页系统，包含：
- 用户注册登录功能
- 待办事项管理
- 习惯打卡记录
- 日常记录（日记/备忘录）
- 数据导入导出（JSON格式）
- 持久化存储
- Vercel部署

### 1.2 技术栈选型

#### 前端
- **框架**: Next.js 14 (React)
  - 理由: Vercel原生支持，SSR/SSG支持，性能优秀
- **UI库**: Tailwind CSS + shadcn/ui
  - 理由: 现代化UI，响应式设计，组件丰富
- **状态管理**: React Context / Zustand
- **表单验证**: React Hook Form + Zod

#### 后端
- **API**: Next.js API Routes (Serverless Functions)
- **数据库**: Supabase PostgreSQL (Vercel兼容)
  - 理由: 免费、开箱即用、自带API、支持实时订阅
- **ORM**: Prisma
  - 理由: 类型安全、迁移管理、查询简便
- **认证**: NextAuth.js / Supabase Auth
  - 理由: 安全、支持多种认证方式

#### 部署
- **平台**: Vercel
- **数据库**: Supabase Cloud
- **域名**: `.vercel.app` (免费)

## 2. 系统架构

### 2.1 架构图
```
┌─────────────────┐
│   用户浏览器     │
└─────────────────┘
         ↓
┌─────────────────┐
│  Next.js App    │
│  (Vercel部署)   │
│                 │
│ ┌─────────────┐ │
│ │ Frontend    │ │
│ │ (React)     │ │
│ └─────────────┘ │
│ ┌─────────────┐ │
│ │ API Routes  │ │
│ │ (Serverless)│ │
│ └─────────────┘ │
└─────────────────┘
         ↓
┌─────────────────┐
│  Supabase       │
│  (PostgreSQL)   │
│                 │
│ - Auth          │
│ - Database      │
│ - Storage       │
└─────────────────┘
```

### 2.2 目录结构
```
myweb/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证相关页面
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/       # 主功能区（需登录）
│   │   ├── todos/         # 待办事项
│   │   ├── habits/        # 习惯打卡
│   │   ├── journal/       # 日常记录
│   │   └── settings/      # 设置（导入导出）
│   ├── api/               # API路由
│   │   ├── auth/
│   │   ├── todos/
│   │   ├── habits/
│   │   ├── journal/
│   │   └── export/
│   ├── layout.tsx         # 全局布局
│   └── page.tsx           # 首页/登录页
├── components/            # React组件
│   ├── ui/               # shadcn/ui组件
│   ├── auth/             # 认证组件
│   ├── todos/            # 待办事项组件
│   ├── habits/           # 习惯打卡组件
│   └── journal/          # 日常记录组件
├── lib/                   # 工具库
│   ├── db.ts             # 数据库连接
│   ├── auth.ts           # 认证逻辑
│   └── export.ts         # 导入导出逻辑
├── prisma/                # Prisma配置
│   ├── schema.prisma     # 数据库模型
│   └── migrations/       # 数据库迁移
├── public/                # 静态资源
├── styles/                # 全局样式
├── types/                 # TypeScript类型定义
├── .env.local            # 环境变量（本地）
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── DESIGN.md             # 设计文档
```

## 3. 数据库设计

### 3.1 数据表设计

#### 用户表 (users)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 待办事项表 (todos)
```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 习惯表 (habits)
```sql
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),           -- 习惯图标
  color VARCHAR(20),          -- 显示颜色
  target_frequency INT,       -- 目标频率（每周次数）
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 习惯打卡记录表 (habit_records)
```sql
CREATE TABLE habit_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  completed_at TIMESTAMP NOT NULL,  -- 完成时间
  note TEXT,                         -- 备注
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 日常记录表 (journal_entries)
```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200),
  content TEXT NOT NULL,
  mood ENUM('happy', 'neutral', 'sad', 'angry', 'anxious') DEFAULT 'neutral',
  tags VARCHAR(100)[],       -- 标签数组
  weather VARCHAR(50),       -- 天气记录
  location VARCHAR(100),     -- 地点
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 Prisma Schema
```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String         @id @default(uuid())
  email         String         @unique
  username      String         @unique
  passwordHash  String
  avatarUrl     String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  todos         Todo[]
  habits        Habit[]
  journalEntries JournalEntry[]
  
  @@map("users")
}

model Todo {
  id            String        @id @default(uuid())
  userId        String
  title         String
  description   String?
  status        TodoStatus    @default(pending)
  priority      TodoPriority  @default(medium)
  dueDate       DateTime?
  completedAt   DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("todos")
}

enum TodoStatus {
  pending
  completed
  cancelled
}

enum TodoPriority {
  low
  medium
  high
}

model Habit {
  id               String        @id @default(uuid())
  userId           String
  name             String
  description      String?
  icon             String?
  color            String?
  targetFrequency  Int?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  user             User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  records          HabitRecord[]
  
  @@map("habits")
}

model HabitRecord {
  id          String    @id @default(uuid())
  habitId     String
  userId      String
  completedAt DateTime
  note        String?
  createdAt   DateTime  @default(now())
  habit       Habit     @relation(fields: [habitId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("habit_records")
}

model JournalEntry {
  id        String      @id @default(uuid())
  userId    String
  title     String?
  content   String
  mood      Mood        @default(neutral)
  tags      String[]
  weather   String?
  location  String?
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("journal_entries")
}

enum Mood {
  happy
  neutral
  sad
  angry
  anxious
}
```

## 4. 功能模块设计

### 4.1 用户认证模块

#### 功能
- 注册：邮箱+用户名+密码
- 登录：邮箱+密码
- 登出：清除session
- 密码加密：bcrypt
- Session管理：JWT / Session Cookie

#### 页面
- `/login` - 登录页
- `/register` - 注册页
- `/` - 首页（未登录跳转登录页）

### 4.2 待办事项模块

#### 功能
- 创建待办事项
- 编辑待办事项
- 删除待办事项
- 标记完成/取消
- 设置优先级（低/中/高）
- 设置截止日期
- 状态筛选（全部/待完成/已完成）
- 优先级排序

#### 页面
- `/todos` - 待办事项列表页
- 组件：TodoList、TodoItem、TodoForm、TodoFilter

### 4.3 习惯打卡模块

#### 功能
- 创建习惯目标
- 每日/每周打卡
- 查看打卡记录
- 统计连续打卡天数
- 习惯完成率统计
- 可视化展示（图表）

#### 页面
- `/habits` - 习惯列表页
- 组件：HabitList、HabitCard、HabitCalendar、HabitStats

### 4.4 日常记录模块

#### 功能
- 创建日记/备忘录
- 编辑/删除记录
- 设置心情状态
- 添加标签
- 记录天气/地点
- 搜索记录
- 时间线展示

#### 页面
- `/journal` - 日常记录列表页
- 组件：JournalList、JournalEntry、JournalForm、JournalTimeline

### 4.5 数据导入导出模块

#### 功能
- 导出所有数据为JSON文件
- 导入JSON文件恢复数据
- 选择性导出（只导出某个模块）
- 数据格式验证

#### 页面
- `/settings` - 设置页
- 组件：ExportButton、ImportButton、DataPreview

## 5. API接口设计

### 5.1 认证接口
```
POST   /api/auth/register     - 用户注册
POST   /api/auth/login        - 用户登录
POST   /api/auth/logout       - 用户登出
GET    /api/auth/session      - 获取当前用户session
```

### 5.2 待办事项接口
```
GET    /api/todos             - 获取所有待办事项
POST   /api/todos             - 创建待办事项
PUT    /api/todos/:id         - 更新待办事项
DELETE /api/todos/:id         - 删除待办事项
PATCH  /api/todos/:id/status  - 更新状态
```

### 5.3 习惯打卡接口
```
GET    /api/habits            - 获取所有习惯
POST   /api/habits            - 创建习惯
PUT    /api/habits/:id        - 更新习惯
DELETE /api/habits/:id        - 删除习惯
POST   /api/habits/:id/check  - 打卡记录
GET    /api/habits/:id/stats  - 统计数据
```

### 5.4 日常记录接口
```
GET    /api/journal           - 获取所有记录
POST   /api/journal           - 创建记录
PUT    /api/journal/:id       - 更新记录
DELETE /api/journal/:id       - 删除记录
GET    /api/journal/search    - 搜索记录
```

### 5.5 导入导出接口
```
GET    /api/export/all        - 导出所有数据
GET    /api/export/todos      - 导出待办事项
GET    /api/export/habits     - 导出习惯数据
GET    /api/export/journal    - 导出日常记录
POST   /api/import            - 导入数据
```

## 6. 前端页面设计

### 6.1 登录/注册页
- 简洁表单设计
- 验证提示
- 记住登录状态
- 响应式布局

### 6.2 主界面布局
```
┌─────────────────────────────┐
│  Header (导航栏)            │
│  Logo | 用户名 | 登出       │
├─────────────────────────────┤
│                             │
│  ┌───────┬───────┬───────┐ │
│  │待办   │习惯   │日常   │ │
│  │事项   │打卡   │记录   │ │
│  │       │       │       │ │
│  │ 图标  │ 图标  │ 图标  │ │
│  │       │       │       │ │
│  │ 待办数│连续天│记录数│ │
│  └───────┴───────┴───────┘ │
│                             │
│  欢迎信息 / 今日概览         │
│                             │
├─────────────────────────────┤
│  Footer                      │
└─────────────────────────────┘
```

### 6.3 待办事项页
```
┌─────────────────────────────┐
│  新建待办事项按钮             │
├─────────────────────────────┤
│  筛选器：全部 | 待完成 | 已完成│
│  排序：按优先级 | 按日期      │
├─────────────────────────────┤
│  待办列表                     │
│  ┌───────────────────────┐  │
│  │ ☐ 高优先级任务1        │  │
│  │    截止日期：2024-01-01 │  │
│  ├───────────────────────┤  │
│  │ ☑ 已完成任务2          │  │
│  ├───────────────────────┤  │
│  │ ☐ 低优先级任务3        │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

### 6.4 习惯打卡页
```
┌─────────────────────────────┐
│  新建习惯按钮                 │
├─────────────────────────────┤
│  本周打卡日历（可视化）       │
├─────────────────────────────┤
│  习惯列表                     │
│  ┌───────────────────────┐  │
│  │ 📖 阅读   连续7天       │  │
│  │ 本周进度：5/7           │  │
│  │ [今日打卡]              │  │
│  ├───────────────────────┤  │
│  │ 🏃 运动   连续3天       │  │
│  │ 本周进度：3/5           │  │
│  │ [已打卡 ✓]              │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

### 6.5 日常记录页
```
┌─────────────────────────────┐
│  新建记录按钮                 │
│  搜索框                       │
├─────────────────────────────┤
│  时间线展示                   │
│  ┌───────────────────────┐  │
│  │ 2024-01-10             │  │
│  │ 😊 今天心情很好         │  │
│  │ #生活 #工作             │  │
│  │ 天气：晴朗               │  │
│  ├───────────────────────┤  │
│  │ 2024-01-09             │  │
│  │ 😐 平淡的一天           │  │
│  │ #日常                   │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

## 7. 导入导出数据格式

### 7.1 JSON导出格式
```json
{
  "exportDate": "2024-01-10T10:00:00Z",
  "version": "1.0",
  "user": {
    "email": "user@example.com",
    "username": "myname"
  },
  "todos": [
    {
      "id": "uuid",
      "title": "任务标题",
      "description": "描述",
      "status": "pending",
      "priority": "high",
      "dueDate": "2024-01-01T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "habits": [
    {
      "id": "uuid",
      "name": "阅读",
      "description": "每天阅读30分钟",
      "records": [
        {
          "completedAt": "2024-01-10T08:00:00Z",
          "note": "读了20页"
        }
      ]
    }
  ],
  "journal": [
    {
      "id": "uuid",
      "title": "日记标题",
      "content": "内容...",
      "mood": "happy",
      "tags": ["生活", "感悟"],
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ]
}
```

## 8. 部署方案

### 8.1 Supabase配置
1. 注册 Supabase 账号（免费）
2. 创建项目，获取数据库URL
3. 配置环境变量

### 8.2 Vercel部署流程
```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录Vercel
vercel login

# 3. 部署项目
vercel

# 4. 配置环境变量（在Vercel Dashboard）
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...

# 5. 生产部署
vercel --prod
```

### 8.3 环境变量配置
```bash
# .env.local
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
```

## 9. 开发计划

### Phase 1: 项目初始化（第1天）
- 创建Next.js项目
- 配置Tailwind CSS + shadcn/ui
- 配置Prisma + Supabase
- 初始化数据库表

### Phase 2: 用户认证（第2-3天）
- 实现注册功能
- 实现登录功能
- 实现Session管理
- 创建布局组件

### Phase 3: 待办事项（第4-5天）
- 实现待办CRUD
- 实现状态筛选
- 实现优先级排序
- UI美化

### Phase 4: 习惯打卡（第6-7天）
- 实现习惯CRUD
- 实现打卡功能
- 实现统计功能
- 可视化展示

### Phase 5: 日常记录（第8-9天）
- 实现日记CRUD
- 实现搜索功能
- 时间线展示

### Phase 6: 导入导出（第10天）
- 实现导出功能
- 实现导入功能
- 数据验证

### Phase 7: 部署上线（第11天）
- Vercel部署
- Supabase配置
- 测试上线

## 10. 技术难点与解决方案

### 10.1 认证安全
- 密码bcrypt加密（10轮）
- JWT Token验证
- CSRF防护
- XSS防护

### 10.2 数据验证
- Zod schema验证
- 前端表单验证
- 后端API验证
- 导入数据验证

### 10.3 性能优化
- React组件懒加载
- 图片优化
- API缓存
- 数据库查询优化

### 10.4 移动端适配
- Tailwind响应式设计
- 移动端触摸交互
- PWA支持（可选）

---

## 需要确认的问题

请确认以下事项，以便开始开发：

### 1. 数据库选择
❓ 你想使用哪种数据库方案？
- **Supabase**（推荐） - 免费、自带认证、易用
- **Vercel Postgres** - Vercel原生、免费
- **PlanetScale** - MySQL兼容、免费
- 其他云数据库（需付费）

### 2. 认证方式
❓ 你倾向于哪种认证实现？
- **NextAuth.js** - 灵活、支持多种provider
- **Supabase Auth** - 简单、与数据库集成
- 自实现JWT认证 - 完全控制

### 3. UI设计风格
❓ 你喜欢什么风格的界面？
- 简约现代（类似Notion）
- Material Design风格
- 其他偏好？

### 4. 功能优先级
❓ 你希望先实现哪些功能？
- 按文档顺序逐个实现
- 先实现核心功能（认证+待办）
- 其他优先级安排？

### 5. 是否需要其他功能
❓ 还有其他需要添加的功能吗？
- 数据统计图表
- 深色模式
- 多语言支持
- 移动端PWA
- 其他？

### 6. 开发环境
❓ 你的开发环境是否已准备好？
- Node.js 版本（建议 18+）
- npm/pnpm/yarn 选择
- Git 配置

---

**确认以上问题后，我将开始编写代码！**