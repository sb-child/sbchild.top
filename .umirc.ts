import { defineConfig } from 'umi'

export default defineConfig({
  routes: [
    { path: '/', component: 'index' },
    { path: '/about', component: 'about' },
    { path: '/friends', component: 'friends' },
    { path: '/blog', component: 'blog' },
    { path: '/*', component: '404' },
  ],
  npmClient: 'pnpm',
  title: '色妹妹的网站喵',
})
