<script lang="ts">
	import { site } from '#lib/site.js';
</script>

<svelte:head>
	<title>{site.title} - {site.description}</title>
	<meta name="description" content={site.description} />
	<link rel="canonical" href={site.url} />
</svelte:head>

<section class="flex flex-col items-start gap-4 py-16">
	<h1 class="text-4xl font-bold tracking-tight">想不到吧，我复活了。</h1>
	<p class="text-lg text-muted-foreground">{site.description}</p>
</section>
