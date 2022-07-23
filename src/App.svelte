<script lang="ts">
  import Router from "svelte-spa-router";

  import Navbar from "@/lib/components/Navbar.svelte";
  import Home from "@/routes/Home.svelte";
  import NotFound from "@/routes/NotFound.svelte";
  import TryPass from "./routes/TryPass.svelte";

  const routes = {
    // Exact path
    "/": Home,

    // Wildcard parameter
    "/room/:id": TryPass,

    // Catch-all
    // This is optional, but if present it must be the last
    "*": NotFound,
  };
</script>

<div class="bg-gray-100 h-full">
  <div class="container mx-auto border-black">
    <Navbar class="px-2 border-nl border-b-2 mb-3" />

    <Router {routes} />
  </div>
</div>
