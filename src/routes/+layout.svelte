<script lang="ts">
  import "./layout.css";
  import favicon from "#lib/assets/favicon.svg";
  import { setTheme } from "#lib/hooks/theme.svelte.js";
  import Header from "#lib/components/header.svelte";
  import Footer from "#lib/components/footer.svelte";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();

  setTheme();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col">
  <Header />
  <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
    {@render children()}
  </main>
  <Footer />
</div>
