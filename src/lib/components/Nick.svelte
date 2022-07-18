<script lang="ts">
  import { changeIDName, getIDName, setIDName } from "../helper/local";
  import { generateName } from "../helper/name";

  let editMode = false;

  let className = "";
  export { className as class };

  let { id: nickID, nick } = getIDName() ?? setIDName(generateName());

  const save = () => {
    changeIDName(nickID, nick);
    editMode = false;
  };
</script>

<div class={`${className} bg-white`}>
  <div class="float-right">
    <div>
      {#if editMode}
        <button
          class="px-2 h-7 appearance-none border-l border-b border-black self-end hover:bg-green-500 hover:text-white"
          on:click={save}
        >
          Save
        </button>
      {/if}
      <button
        class={`float-right px-2 h-7 appearance-none border-l border-b border-black self-end hover:text-white ${
          editMode ? "hover:bg-red-500" : "hover:bg-nl"
        }`}
        on:click={() => {
          editMode = !editMode;
        }}
      >
        {editMode ? "Cancel" : "Edit Nickname"}
      </button>
    </div>
  </div>
  <div class="py-6 pl-4 pr-6">
    {#if editMode}
      <form on:submit|preventDefault|stopPropagation={save}>
        <input
          class="bg-gray-100 border-gray-200 flex-1 px-2 text-xl font-bold"
          type="text"
          bind:value={nick}
        />
      </form>
    {:else}
      <span class="font-bold text-xl px-2">{nick}</span>
    {/if}
  </div>
</div>
