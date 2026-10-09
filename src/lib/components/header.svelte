<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '#lib/utils.js';
	import { nav, site } from '#lib/site.js';
	import ThemeToggle from './theme-toggle.svelte';
	import { Separator } from '#lib/components/ui/separator/index.js';

	const current = $derived(page.url.pathname);
</script>

<header class="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
	<div class="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
		<a href="/" class="text-lg font-semibold tracking-tight">{site.title}</a>
		<nav class="flex items-center gap-4">
			{#each nav as item (item.href)}
				<a
					href={item.href}
					class={cn(
						'text-sm text-muted-foreground transition-colors hover:text-foreground',
						current === item.href && 'font-medium text-foreground'
					)}
				>
					{item.title}
				</a>
			{/each}
			<Separator orientation="vertical" class="!h-4" />
			<ThemeToggle />
		</nav>
	</div>
</header>