export const site = {
	url: 'https://sbchild.top',
	title: 'sbchild.top',
	description: '色妹妹的个人主页'
} as const;

export const nav = [
	{ href: '/', title: 'Home', external: false },
	{ href: '/about/', title: 'About', external: false },
	{ href: 'https://gh.sbchild.top/', title: 'Blog', external: true },
] as const;
