<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { CardV } from "../helper/models";

  export let text = "";
  export let emoji = false;

  export let editMode = false;

  let className = "";
  export { className as class };

  const dispatch = createEventDispatcher();

  const clickFn = () => {
    dispatch("click", { text, emoji } as CardV);
  };

  const deleteFn = () => {
    dispatch("delete");
  };
</script>

<button
  on:click={clickFn}
  class={`${className} h-36 w-24 bg-white ${
    editMode ? "hover:bg-yellow-200" : "hover:bg-nl"
  } border-2 border-black flex items-center justify-center appearance-none relative`}
>
  <button
    on:click|stopPropagation={deleteFn}
    class:hidden={!editMode}
    class="h-6 w-6 bg-white hover:bg-red-500 border-l border-b border-black appearance-none absolute top-0 right-0"
    >-</button
  >
  <span class={`${emoji ? "font-emoji" : ""} text-5xl pointer-events-none`}
    >{text}</span
  >
</button>
