<script lang="ts">
  import { page } from "$app/state";
  import { cn } from "#lib/utils.js";
  import { nav, site } from "#lib/site.js";
  import ThemeToggle from "./theme-toggle.svelte";
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import Menu from "@lucide/svelte/icons/menu";
  import { Button } from "#lib/components/ui/button/index.js";
  import * as DropdownMenu from "#lib/components/ui/dropdown-menu/index.js";

  const current = $derived(page.url.pathname);
</script>

<header class="sticky top-0 z-50 w-full bg-background">
  <div class="px-4 flex items-center gap-2 h-14 max-w-6xl mx-auto">
    <a href="/" class="text-lg font-semibold tracking-tight">{site.title}</a>
    <ThemeToggle />
    <div class="flex-1"></div>
    <nav class="hidden items-center gap-1 md:flex">
      {#each nav as item (item.href)}
        <Button variant="secondary" href={item.href}>
          {#if item.external}
            <ExternalLink />
          {/if}
          {item.title}
        </Button>
        <!-- <a
          href={item.href}
          class={cn(
            "text-sm text-muted-foreground transition-colors hover:text-foreground",
            current === item.href && "font-medium text-foreground",
          )}
        >
          {item.title}
        </a> -->
      {/each}
      <!-- <Separator orientation="vertical" class="h-4!" /> -->
    </nav>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Button
            {...props}
            variant="ghost"
            size="icon"
            class="md:hidden"
            aria-label="菜单"
          >
            <Menu />
          </Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" class="w-40">
        {#each nav as item (item.href)}
          <DropdownMenu.Item>
            {#snippet child({ props })}
              <a {...props} href={item.href}>
                {item.title}
                {#if item.external}
                  <ExternalLink class="ml-auto" />
                {/if}
              </a>
            {/snippet}
          </DropdownMenu.Item>
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</header>
