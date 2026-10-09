<script lang="ts">
	import { site } from '#lib/site.js';
</script>

<footer class="border-t border-border">
	<div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 text-sm text-muted-foreground">
		<span>© {new Date().getFullYear()} {site.title}</span>
		<a href="https://github.com/sbchild" rel="noopener noreferrer" target="_blank" class="hover:text-foreground">
			GitHub
		</a>
	</div>
</footer>