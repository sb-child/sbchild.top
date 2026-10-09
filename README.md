# sbchild.top

个人主页。SvelteKit 3（全站预渲染，SEO 友好）+ Tailwind CSS v4 + shadcn-svelte，部署到 Cloudflare Workers（Static Assets）。

## 开发

```bash
# 登录 wrangler 
pnpm wrangler login

# 启动开发服务器
pnpm dev

# 类型检查
pnpm check

# 构建到 .svelte-kit/cloudflare/
pnpm build

# 本地测试 worker
pnpm wrangler dev

# 本地测试 worker 构建产物
pnpm wrangler dev .svelte-kit/cloudflare/_worker.js --assets .svelte-kit/cloudflare

# 部署到 Cloudflare Workers Static Assets
pnpm wrangler deploy
```

## 架构

- **路由**：文件系统路由（`src/routes/`），页面 = 文件夹。全站 `prerender`（见 `src/routes/+layout.ts`），产物为完整静态 HTML，爬虫无需执行 JS。
- **SEO**：每页 `<svelte:head>` 独立 title/description/canonical；`sitemap.xml`（预渲染端点）+ `robots.txt`；`trailingSlash: 'always'` 统一 URL 形态。
- **动态端点**：`src/routes/api/` 下的 `+server.ts` 跑在 Workers Functions 上，如 `/api/test`。
- **组件**：shadcn-svelte 组件在 `src/lib/components/ui/`（由 CLI 生成，可重装），业务组件在 `src/lib/components/`。
- **站点信息**：集中在 `src/lib/site.ts`。

## 部署（Workers Static Assets）

构建产物分两层：静态资源（HTML/CSS/JS，assets-first 直接服务、免费不限量）+ `_worker.js`（仅处理未命中静态资源的请求，如 `/api/*`）。

```bash
npx wrangler login   # 首次
npx wrangler deploy
```

部署到 `https://sbchild-top.workers.dev`。

### 绑定正式域名（阶段 C）

1. Cloudflare dashboard 删除根域的 Redirect Rule（301 → gh.sbchild.top）
2. `wrangler.jsonc` 取消注释 `routes` 段（`sbchild.top` Custom Domain）
3. `npx wrangler deploy` —— CF 自动创建 DNS 记录 + 证书
4. （可选）新建 Redirect Rule：`www.sbchild.top` → `https://sbchild.top`，并为 www 添加 proxied 占位 A 记录（`192.0.2.0`）

### noindex 说明

- `workers.dev` 预览域名禁止收录：`_headers`（静态资源）+ `src/hooks.server.ts`（动态响应）双保险
- 正式域名不受影响

## 维护备忘

- 新增页面：`src/routes/<name>/+page.svelte`，记得 `<svelte:head>` 里写 title/description/canonical，并加入 `src/lib/site.ts` 的 `nav`（如需导航）和 `sitemap.xml/+server.ts` 的 urls
- 新增 shadcn 组件：`pnpm dlx shadcn-svelte add <component>`
- 主题色基于 shadcn "nova" style（见 `src/routes/layout.css` 的 CSS 变量）
