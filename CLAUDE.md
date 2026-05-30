# CLAUDE.md — T-GEO 项目上下文

> Claude Code 每次进入本仓库会自动读取这个文件。先读它，再读 `项目交接说明.md`（完整全栈路线图）和 `GEO_PRD_本地生活版.md`（产品定义）。

## 这是什么项目

**T-GEO**：本地生活商家（餐饮 / 按摩SPA / 酒旅）的「AI 搜索推荐优化」系统。
让商家在 DeepSeek / 豆包 / Kimi / 元宝 / 通义千问 / 文心一言 / 智谱清言 / ChatGPT / Gemini 等**全渠道** AI 助手与 AI 搜索入口里被优先推荐、被准确描述。
全渠道清单的单一事实源在 `src/lib/platforms.ts`；**行业意图矩阵**的单一事实源在 `src/lib/intents.ts`（模板×变量池展开，每行业 100+，带 priority/topRec）。新增平台或意图只改对应那一个文件。
核心指标：**T-LBR™**（本地品牌推荐指数）。对标迈富时 T-GEO™，差异化是垂直本地生活三行业。

## 当前状态（重要）

**纯前端 SPA，全部是 mock 假数据。** 登录、诊断、图表、内容都是写死的演示。
全栈开发的本质 = **把假数据逐页替换为真后端/数据库/大模型调用**，UI 不用重做。
假数据清单见 `项目交接说明.md` 第 1.3 节。
原料采集方案（API / MediaCrawler / token重放 / Agent，**可替换**）见 `采集方案.md`。
**运营投喂层**的单一事实源在 `src/lib/distribution.ts`（平台权重/单账号安全频率/发布主体/各阶段周配额 + `generateWeeklyPlan()` 自动排期），分发看板页据此生成「本周投喂作战卡」。
**Agent 内容流水线**的事实源在 `src/lib/workflow.ts`（6阶段：计划→AI生成→合规→采用→分发→回填监测），内容工厂与分发看板通过 `src/store/PipelineContext.tsx` **共享同一份 jobs**（采用即进看板，两页同步）。
**多 Agent 编排 + 学习闭环**的事实源在 `src/lib/agents.ts`（7个Agent：诊断/计划/内容/合规/分发/监测/优化 + `computeLearning()`）。工作台(`Dashboard.tsx`)是这套 Agent 的运作中枢：监测到"被AI引用"的回填数据 → 优化Agent学出最优打法与未覆盖短板 → 回喂下一轮内容生成，越用越准。

## 技术栈

- 构建：Vite 6（**不是 Next.js**，纯 SPA）
- 前端：React 19 + TypeScript + Tailwind CSS v4（`@theme` 在 `src/index.css`）
- 动效：Framer Motion (`motion`) + Canvas（`NeuralBackground.tsx`）
- 图表：Recharts；图标：lucide-react
- 计划后端：Supabase（Postgres + Auth + Storage + pgvector + RLS）+ 独立 Worker（队列跑诊断/爬虫）

## 命令

```bash
npm install      # 装依赖（首次 / 换机器）
npm run dev      # 本地开发 http://localhost:3000
npm run build    # 生产构建
npm run lint     # tsc --noEmit 类型检查
```

## 目录速览

```
src/App.tsx              根组件，登录页 + useState 切页（非 react-router）
src/main.tsx             挂载 + <ToastProvider>
src/index.css            Tailwind v4 主题 + 科幻动效关键帧
src/lib/config.ts        背景视频地址 HERO_VIDEO_SRC（public/hero.mp4）
src/lib/utils.ts         cn() 合并 className
src/components/Layout.tsx          工作台外壳（侧栏/顶栏/背景）
src/components/NeuralBackground.tsx 背景视频 + Canvas 雷达动效
src/components/Toast.tsx           全局通知 useToast()
src/pages/*.tsx          8 个功能页
```

## 代码约定

- 样式只用 Tailwind 工具类；自定义动效写在 `src/index.css` 的 `@theme` / `@keyframes`。
- 颜色用主题变量：`brand-gold`(#C5A059)、`brand-bg`、`brand-card`。中文界面、深色科幻风。
- 给用户操作反馈用 `useToast()`（`success/info/warn/process`），不要 `alert()`。
- 合并 className 用 `cn()`。
- 背景视频/雷达逻辑在 `NeuralBackground.tsx`，非必要别改；换视频改 `public/hero.mp4` 或 `config.ts`。

## 接后端时的铁律

1. 一次只改一个页面的「取数」，不动 UI 视觉。
2. 长任务（诊断 3000 次模型调用、爬虫）**必须**放 Worker + 队列，禁止放前端或短时函数。
3. 密钥只放后端/Worker，绝不进前端或 git（`.env.local` 已被忽略）。
4. T-LBR 评分公式见 `项目交接说明.md` 第 5 节，按它实现。
5. 合规红线：不养号/不刷量/不造假评论；SPA 行业用「养生/推拿/中医调理」替代词 + 敏感词过滤。

## 提交

```bash
git add -A && git commit -m "..." && git push origin HEAD:main
```
远程默认分支是 `main`。
