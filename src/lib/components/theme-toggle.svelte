<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
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