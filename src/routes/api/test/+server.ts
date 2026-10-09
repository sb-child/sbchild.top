import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// 测试端点：验证 Workers Functions 生效
export const GET: RequestHandler = async () => {
	return json({ ok: true, time: new Date().toISOString() });
};