export const site = {
  url: "https://sbchild.top",
  title: "sbchild.top",
  description: "色妹妹的个人主页",
  blog: "https://gh.sbchild.top/",
  github: "https://github.com/sb-child/",
} as const;

export const nav = [
  { href: "/", title: "Home", external: false },
  { href: "/about/", title: "About", external: false },
  { href: site.blog, title: "Blog", external: true },
] as const;
