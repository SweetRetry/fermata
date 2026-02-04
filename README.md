# Fermata - AI 音乐生成器

基于 Next.js 的 AI 音乐创作与管理平台，集成 MiniMax Music API，支持智能歌词生成与音乐创作。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 + React 19 |
| 语言 | TypeScript 5 (严格模式) |
| 构建 | Turbopack |
| 样式 | Tailwind CSS + Framer Motion |
| UI 组件 | @workspace/ui (monorepo 共享) |
| 状态管理 | TanStack Query + Zustand |
| 表单 | React Hook Form + Zod |
| 数据库 | Better-SQLite3 + Drizzle ORM |
| AI 服务 | MiniMax Music API, DeepSeek AI |

## 项目结构

```
apps/web/
├── app/
│   ├── (app)/              # 应用主界面路由组
│   ├── (landing)/          # 落地页路由组
│   └── api/                # API 路由
├── components/             # 全局 UI 组件
├── features/               # 业务功能模块
│   ├── genre-discovery/    # 音乐风格发现
│   ├── music-creation/     # 音乐创作表单
│   ├── music-generation/   # AI 音乐生成
│   ├── music-library/      # 音乐库管理
│   └── player/             # 播放器
├── core/                   # 基础设施 (db, config, utils)
├── lib/                    # 工具函数
└── data/                   # 本地数据存储
```

## 功能特性

- **AI 歌词生成** - 基于 DeepSeek 的智能歌词创作
- **音乐风格发现** - 浏览和选择多种音乐风格
- **AI 音乐生成** - 通过 MiniMax Music API 生成音乐
- **音乐库管理** - 保存、播放、删除生成的音乐
- **播放器** - 支持播放列表、进度控制、曲目导航

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器 (端口 5002)
cd apps/web && pnpm dev

# 构建应用
pnpm build

# 类型检查
pnpm typecheck

# 代码检查与格式化
pnpm check

# 查找未使用代码
pnpm knip
```

## 数据库操作

```bash
# 生成迁移
cd apps/web && npx drizzle-kit generate

# 执行迁移
npx drizzle-kit migrate
```

## 环境变量

```bash
# apps/web/.env
DEEPSEEK_API_KEY=your_deepseek_key
FAL_KEY=your_fal_key
```

## 添加 UI 组件

```bash
# 在 packages/ui 中添加 shadcn/ui 组件
cd packages/ui && npx shadcn add <component-name>
```

## Monorepo 结构

```
.
├── apps/
│   └── web/                 # Next.js 应用
├── packages/
│   ├── ui/                  # 共享 UI 组件库
│   └── typescript-config/   # 共享 TS 配置
├── biome.json               # Biome 配置
├── knip.json                # Knip 配置
├── turbo.json               # Turborepo 配置
└── pnpm-workspace.yaml      # pnpm workspace 配置
```
