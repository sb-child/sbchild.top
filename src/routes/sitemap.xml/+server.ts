import { site } from '#lib/site.js';
import type { RequestHandler } from './$types';

// 预渲染为静态 sitemap.xml（不占 Functions 调用）
export const prerender = true;

export const GET: RequestHandler = () => {
	const urls = ['', 'about/'].map((path) => `${site.url}/${path}`);
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `\t<url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml' }
	});
};