<script lang="ts">
  import { site } from "#lib/site.js";
  import { Button } from "#lib/components/ui/button/index.js";
  import ExternalLink from "@lucide/svelte/icons/external-link";
</script>

<footer class="border-t border-border">
  <div
    class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-sm text-muted-foreground"
  >
    <span>© {new Date().getFullYear()} {site.title}</span>
    <div class="flex gap-2">
      <Button
        variant="secondary"
        href="https://github.com/sb-child"
        rel="noopener noreferrer"
        target="_blank"><ExternalLink />GitHub Profile</Button
      >
    </div>
  </div>
</footer>
