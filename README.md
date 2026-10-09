# sbchild.top

个人主页终于终于复活了。

## 开发

```bash
# 类型检查
pnpm check

# 启动开发服务器
pnpm dev

# 本地测试 worker
pnpm wrangler dev

# 构建到 .svelte-kit/cloudflare/
pnpm build

# 本地测试 worker 构建产物
pnpm wrangler dev .svelte-kit/cloudflare/_worker.js --assets .svelte-kit/cloudflare
```

## 架构

SvelteKit 3 + Tailwind CSS v4 + shadcn-svelte，部署到 Cloudflare Workers（Static Assets）。

本站让 Deepseek 帮我构建，代码写的烂跳来跳去不是我的锅。

- **路由**：全站 prerender，产物为完整静态 HTML，爬虫无需执行 JS。
- **SEO**：每页 `<svelte:head>` 独立 title/description/canonical，预渲染 `sitemap.xml` 和 `robots.txt`，URL 统一 `trailingSlash: 'always'`。
- **动态端点**：`src/routes/api/` 下的 `+server.ts` 跑在 Workers Functions 上，如 `/api/test`。
- **组件**：shadcn-svelte 组件在 `src/lib/components/ui/`（由 CLI 生成，可重装），业务组件在 `src/lib/components/`。
- **站点信息**：集中在 `src/lib/site.ts`。

## 部署（Workers Static Assets）

构建产物：

- 静态资源（HTML/CSS/JS，assets-first 直接服务、免费不限量。
- `_worker.js`（仅处理未命中静态资源的请求，如 `/api/*`）。

部署：

```bash
# 先登录
pnpm wrangler login

# 部署到 Cloudflare Workers
pnpm wrangler deploy
```

部署到 `https://sbchild-top.sbchild.workers.dev`。

### 绑定正式域名（阶段 C）

1. Cloudflare dashboard 删除根域的 Redirect Rule（301 → gh.sbchild.top）
2. `wrangler.jsonc` 取消注释 `routes` 段（`sbchild.top` Custom Domain）
3. `npx wrangler deploy` —— CF 自动创建 DNS 记录 + 证书
4. （可选）新建 Redirect Rule：`www.sbchild.top` → `https://sbchild.top`，并为 www 添加 proxied 占位 A 记录（`192.0.2.0`）

### noindex 说明

- `workers.dev` 预览域名禁止收录：`_headers`（静态资源）+ `src/hooks.server.ts`（动态响应）双保险
- 正式域名不受影响

## 维护备忘

新增页面：

- 创建 `src/routes/<name>/+page.svelte`
- `<svelte:head>` 写 title/description/canonical
- 需要导航：加入 `src/lib/site.ts` > `nav`
- 需要索引：加入 `sitemap.xml/+server.ts` > `urls`

新增 shadcn 组件：`pnpm dlx shadcn-svelte add <component>`

主题色：基于 shadcn "nova" style看 `src/routes/layout.css` 变量
