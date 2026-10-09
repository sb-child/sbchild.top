<script lang="ts">
	import { site } from '#lib/site.js';
</script>

<svelte:head>
	<title>{site.title} - {site.description}</title>
	<meta name="description" content={site.description} />
	<link rel="canonical" href={site.url} />
</svelte:head>

<section class="flex flex-col items-start gap-4 py-16">
	<h1 class="text-4xl font-bold tracking-tight">Hi, 我是 {site.title}</h1>
	<p class="text-lg text-muted-foreground">页面结构待定，这里是占位内容。</p>
</section>