<script lang="ts">
  import "@/app.scss";

  import Navbar from "@/lib/components/Navbar.svelte";
</script>

<svelte:head>
  <title>scrumik</title>
</svelte:head>

<div class="bg-gray-100 h-full">
  <div class="container mx-auto border-black">
    <Navbar class="px-2 border-nl border-b-2 mb-3" />

    <slot />
  </div>
</div>
