<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let text = "";
  export let emoji = false;

  const dispatch = createEventDispatcher();

  const clickFn = () => {
    dispatch("click", { text });
  };
</script>

<button
  on:click={clickFn}
  class="h-40 w-24 bg-white hover:bg-orange-500 border-2 border-black flex items-center justify-center appearance-none"
>
  <span class={`${emoji ? "font-emoji" : ""} text-5xl pointer-events-none`}
    >{text}</span
  >
</button>
