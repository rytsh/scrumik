<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { changeIDName, getIDName, setIDName } from "../helper/local";
  import { generateName } from "../helper/name";
  import Icon from "./Icon.svelte";

  let editMode = false;

  let className = "";
  export { className as class };

  let nickID = "";
  let nick = "";

  let nickChange = "";

  const save = () => {
    changeIDName(nickID, nickChange);
    nick = nickChange;
    editMode = false;
  };

  const setName = () => {
    const idNick = getIDName() ?? setIDName(generateName());
    nickID = idNick.id;
    nick = idNick.nick;
  };

  onMount(() => {
    setName();
    window.addEventListener("storage", setName);
  });

  onDestroy(() => {
    window.removeEventListener("storage", setName);
  });
</script>

<div class={`${className} bg-white`}>
  <div class="float-right">
    <div>
      {#if editMode}
        <button
          class="px-2 h-7 border-l border-b border-black self-end hover:bg-green-500 hover:text-white"
          on:click={save}
        >
          Save
        </button>
      {/if}
      <button
        class={`float-right px-2 h-7 border-l border-b border-black self-end hover:text-white ${
          editMode ? "hover:bg-red-500" : "hover:bg-nl"
        }`}
        on:click={() => {
          editMode = !editMode;
          if (editMode) nickChange = nick;
        }}
      >
        {editMode ? "Cancel" : "Edit Nickname"}
      </button>
    </div>
  </div>
  <div class="py-6 pl-4 pr-6">
    {#if editMode}
      <form
        on:submit|preventDefault|stopPropagation={save}
        class="flex items-center"
      >
        <input
          class="bg-gray-100 border border-gray-200 px-2 text-xl font-bold"
          type="text"
          bind:value={nickChange}
        />
        <button
          class="bg-white border border-black px-2 text-xl hover:bg-nl hover:text-white"
          type="button"
          on:click={() => (nickChange = generateName())}
        >
          <Icon
            icon="reload"
            height="1.75rem"
            title="new name generate"
            class="pointer-events-none"
          />
        </button>
      </form>
    {:else}
      <span class="font-bold text-xl px-2">{nick}</span>
    {/if}
  </div>
</div>
