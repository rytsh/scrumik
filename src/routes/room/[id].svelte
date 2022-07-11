<script context="module">
  export async function load({ params }) {
    return {
      props: {
        id: params.id,
      },
    };
  }
</script>

<script lang="ts">
  import Poker from "@/lib/components/Poker.svelte";

  export let id = "";
</script>

<svelte:head>
  <title>room</title>
</svelte:head>

<h1>roomm id</h1>
<p>{id}</p>

<a href="/">Home</a>

<Poker />
