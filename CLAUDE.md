# 架构说明

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

## 目录范式

```
apps/web/
├── app/                    # 路由 + 薄 API
├── components/             # 全局 UI 组件
├── features/{name}/        # 业务功能模块
│   ├── index.ts            # 统一导出
│   ├── api/
│   │   ├── client.ts       # TanStack Query
│   │   └── server.ts       # 服务端逻辑
│   ├── components/         # Feature 组件
│   ├── hooks/              # Feature hooks
│   ├── lib/                # 业务逻辑
│   ├── stores/             # Zustand (可选)
│   └── types.ts
├── core/                   # 基础设施 (db, config, utils)
└── types/                  # 全局类型
```

## 核心范式

### 1. Feature 组织

- **页面**放 `app/(routes)/**/page.tsx`，只做路由级逻辑
- **Feature 模块**放 `features/{name}/`，必须包含 `index.ts` 统一导出
- **API 分层**: Route 保持薄，业务逻辑下沉到 `features/{name}/api/server.ts`

### 2. 命名规范

| 类型 | 命名 | 示例 |
|------|------|------|
| 组件 | PascalCase | `FooCard.tsx` |
| Hooks | camelCase | `useFoo.ts` |
| 工具函数 | camelCase | `formatBar.ts` |
| 常量 | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 类型 | PascalCase | `FooParams` |

## 禁止事项

```
❌ hooks/, lib/, utils/ 目录 (用 core/ 或放 feature 内)
❌ app/**/components/ (页面级组件用 feature 代替)
❌ 业务逻辑直接放 API routes
❌ 组件里直接调用 fetch (用 feature/api/client.ts)
❌ 重复定义数据库类型
```

## 开发命令

```bash
cd apps/web
pnpm dev          # 端口 5002
pnpm build && pnpm typecheck
```

## @workspace/ui 使用

```typescript
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import "@workspace/ui/globals.css"
```

添加组件: `cd packages/ui && npx shadcn add <name>`
