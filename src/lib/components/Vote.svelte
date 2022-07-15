<script lang="ts">
  import { doc, setDoc } from "firebase/firestore";
  import { db } from "../helper/fire";

  import type { People } from "../helper/models";

  let className = "";
  export { className as class };

  export let id = "";
  export let description = "";
  export let people: People = null;

  let edit = false;

  const save = () => {
    const roomRef = doc(db, "room", id);
    setDoc(roomRef, { info: { description: description } }, { merge: true });
    edit = false;
  };
</script>

<div class={`${className} relative`}>
  <div
    class="border-b border-black h-7 flex flex-wrap justify-between box-content"
  >
    <span class="px-2">Voting - {edit ? "" : description}</span>
    {#if edit}
      <input
        class="bg-gray-200 flex-1 px-2"
        type="text"
        bind:value={description}
      />
    {/if}
    <div>
      {#if edit}
        <button
          class="px-2 h-7 appearance-none border-l border-black self-end hover:bg-green-500 hover:text-white"
          on:click={save}
        >
          Save
        </button>
      {/if}
      <button
        class={`float-right px-2 h-7 appearance-none border-l border-black self-end hover:text-white ${
          edit ? "hover:bg-red-500" : "hover:bg-nl"
        }`}
        on:click={() => {
          edit = !edit;
        }}
      >
        {edit ? "Cancel" : "Edit"}
      </button>
    </div>
  </div>
  <div class="p-6">
    {#if people}
      <table class="w-full">
        {#each Object.entries(people) as [name, person]}
          <tr
            class={`border-b border-black first:border-t ${
              person.card?.text
                ? person.card?.text == "-"
                  ? "bg-yellow-100"
                  : ""
                : "bg-yellow-100"
            }`}
          >
            <td class="text-left w-1/2 text-2xl">{name}</td>
            <td
              class={`${
                person.card?.emoji ? "font-emoji" : ""
              } text-center text-5xl`}>{person.card?.text ?? "-"}</td
            >
          </tr>
        {/each}
      </table>
    {/if}
  </div>
</div>
