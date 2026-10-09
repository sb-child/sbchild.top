// 全站预渲染：产物为完整静态 HTML（SEO 友好），动态端点走 Workers Functions
export const prerender = true;
// 统一 URL 形态为带尾斜杠（/about/），避免重复收录
export const trailingSlash = 'always';