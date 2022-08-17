<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import type { CardV } from "@/lib/helper/models";
  import { addKeyMap, deleteKeyMap } from "@/lib/helper/keys";
  import { keysView } from "../store/store";

  export let text = "";
  export let emoji = false;

  export let editMode = false;

  let className = "";
  export { className as class };

  export let index = -1;
  export let key = "";

  const dispatch = createEventDispatcher();

  const clickFn = () => {
    dispatch("click", { text, emoji } as CardV);
  };

  const deleteFn = () => {
    dispatch("delete");
  };

  onMount(() => {
    if (index < 0) return;

    // add to card function
    key = addKeyMap(index, clickFn);
  });

  onDestroy(() => {
    if (index < 0) return;

    if (key) deleteKeyMap(key);
  });
</script>

<button
  on:click={clickFn}
  class={`${className} h-36 w-28 ${
    editMode ? "" : "hover:bg-nl"
  } border border-black flex items-center justify-center relative`}
>
  <button
    on:click|stopPropagation={deleteFn}
    class:hidden={!editMode}
    class="h-6 w-6 bg-white hover:bg-red-500 border-l border-b border-black absolute top-0 right-0"
  >
    -
  </button>

  <span class={`${emoji ? "font-emoji" : ""} text-5xl pointer-events-none`}>
    {text}
  </span>
  {#if !editMode && $keysView && key}
    <span
      class="h-6 w-6 bg-gray-200 border-r border-b border-black absolute top-0 left-0"
    >
      {key}
    </span>
  {/if}
</button>
