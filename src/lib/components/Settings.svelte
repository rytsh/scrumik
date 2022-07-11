<script lang="ts">
  import type { Info } from "../helper/models";

  let className = "";
  export { className as class };

  export let id = "";

  export let myName = "";

  const roomName = "Voting Room";

  export let info: Info = null;
</script>

<svelte:head>
  <title>{roomName}</title>
</svelte:head>

<div class={`${className} p-6 relative`}>
  <h2 class="font-semibold leading-tight text-3xl">{info?.name}</h2>
  <span>{myName}</span>
</div>
