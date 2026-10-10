import type { Handle } from '@sveltejs/kit/hooks';

// 注：静态 HTML 由根目录 _headers 处理，此处覆盖 worker 动态响应（/api/* 等）。
export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  // workers.dev 预览域名禁止搜索引擎收录。
	if (event.url.hostname.endsWith('.workers.dev')) {
		response.headers.set('X-Robots-Tag', 'noindex');
	}
	return response;
};
