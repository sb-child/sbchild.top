<script>
  let analytics = import.meta.env.PROD;
  let cf_beacon = "8183db815f2546e19b1978f3f8b385fa";
  let gtag = "G-6Y5JBS9L6H";
</script>

<svelte:head>
  {#if analytics}
    <!-- Cloudflare Web Analytics -->
    <script
      type="module"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={`{"token": "${cf_beacon}"`}
    ></script>
    <!-- End Cloudflare Web Analytics -->

    <!-- Google tag (gtag.js) -->
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id={gtag}"
    ></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());

      gtag("config", gtag);
    </script>
    <!-- End Google tag (gtag.js) -->
  {/if}
</svelte:head>
