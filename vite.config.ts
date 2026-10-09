import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// 避免在 dev 的 ssr 环境里把 Svelte 预打包成 `node_modules/.vite/deps_ssr` 的独立副本，
	// 否则 SSR 会出现两份 Svelte internals，`ssr_context` 单例不共享，
	// 导致 push_element 读取 null / lifecycle_outside_component。
	optimizeDeps: {
		exclude: ['svelte', 'bits-ui']
	},
	environments: {
		ssr: {
			optimizeDeps: {
				exclude: ['svelte', 'bits-ui']
			}
		}
	},
	ssr: {
		noExternal: ['svelte', /^svelte\//]
	},
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// 关闭 Svelte 库的依赖预打包（dev），与上面的 exclude 一起消除 SSR 重复实例。
			prebundleSvelteLibraries: false,

			// adapter-cloudflare: 构建为 Workers Static Assets（assets-first，静态请求免费）。
			// 部署: npx wrangler deploy；本地验证 Functions: npx wrangler dev
			adapter: adapter()
		})
	]
});
