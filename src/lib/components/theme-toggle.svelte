<script lang="ts">
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import { Button } from '#lib/components/ui/button/index.js';
	import { getTheme } from '#lib/hooks/theme.svelte.js';

	const theme = getTheme();
</script>

<Button
	variant="ghost"
	size="icon"
	aria-label="切换主题"
	onclick={() => theme.toggle()}
>
	{#if theme.current === 'dark'}
		<Sun />
	{:else}
		<Moon />
	{/if}
</Button>
