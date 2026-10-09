<script lang="ts">
  import { site } from "#lib/site.js";
  import { Button } from "#lib/components/ui/button/index.js";
  import ExternalLink from "@lucide/svelte/icons/external-link";
</script>

<svelte:head>
  <title>About - {site.title}</title>
  <meta name="description" content="关于本站" />
  <link rel="canonical" href="{site.url}/about/" />
</svelte:head>

<section class="flex flex-col items-start gap-4 py-16">
  <h1 class="text-4xl font-bold tracking-tight">About</h1>
  <p class="text-lg text-muted-foreground">关于本站...</p>

  <p class="leading-7 mt-6">
    这是历史遗留问题，之前的 workaround 是 301 到<Button
      variant="secondary"
      href="https://gh.sbchild.top/"
      rel="noopener noreferrer"
      size="sm"
      target="_blank"><ExternalLink />博客站</Button
    >，但我现在改变主意了。
  </p>

  <p class="leading-7">现在本站部署到 Cloudflare Workers，祝你玩得开心。</p>
</section>
