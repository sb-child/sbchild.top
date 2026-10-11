<script lang="ts">
  import { Separator } from "#lib/components/ui/separator/index.ts";
  import { site } from "#lib/site.js";
  import LightBox from "#lib/components/lightbox.svelte";
</script>

<svelte:head>
  <title>{site.title} - {site.description}</title>
  <meta name="description" content={site.description} />
  <link rel="canonical" href={site.url} />
</svelte:head>

<section class="flex flex-col items-start gap-4 py-16">
  <h1 class="text-4xl font-bold tracking-tight">想不到吧，我复活了。</h1>
  <p class="text-lg text-muted-foreground">{site.description}</p>

  <Separator />

  <p class="leading-7">来看看我的新发明吧！</p>

  <LightBox />
</section>
