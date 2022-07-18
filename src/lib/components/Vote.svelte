<script lang="ts">
  import { doc, setDoc } from "firebase/firestore";
  import { db } from "../helper/fire";

  import type { People } from "../helper/models";
  import { stringSort } from "../helper/sort";

  let className = "";
  export { className as class };

  export let id = "";
  export let description = "";
  export let people: People = null;

  let editMode = false;

  const save = () => {
    const roomRef = doc(db, "room", id);
    setDoc(roomRef, { info: { description: description } }, { merge: true });
    editMode = false;
  };

  $: totalVoted = people
    ? Object.keys(people).reduce((total, current) => {
        const v =
          people[current].card == undefined ||
          people[current].card.text == undefined ||
          people[current].card.text == "-"
            ? 0
            : 1;
        return total + v;
      }, 0)
    : 0;
</script>

<div class={`${className} relative`}>
  <div
    class="border-b border-black h-7 flex flex-wrap justify-between box-content"
  >
    <span class="px-2">Voting - {editMode ? "" : description}</span>
    {#if editMode}
      <input
        class="bg-gray-200 flex-1 px-2"
        type="text"
        bind:value={description}
      />
    {/if}
    <div>
      {#if editMode}
        <button
          class="px-2 h-7 appearance-none border-l border-black self-end hover:bg-green-500 hover:text-white"
          on:click={save}
        >
          Save
        </button>
      {/if}
      <button
        class={`float-right px-2 h-7 appearance-none border-l border-black self-end hover:text-white ${
          editMode ? "hover:bg-red-500" : "hover:bg-nl"
        }`}
        on:click={() => {
          editMode = !editMode;
        }}
      >
        {editMode ? "Cancel" : "Edit"}
      </button>
    </div>
  </div>
  <div class="p-6">
    {#if people}
      <div class="flex items-center justify-between mb-4">
        <div>
          <button
            class="px-2 h-7 appearance-none border border-black hover:bg-nl hover:text-white"
          >
            Clear Votes
          </button>
          <button
            class="px-2 h-7 appearance-none border border-black hover:bg-nl hover:text-white"
          >
            Show Results
          </button>
        </div>
        <span class="text-xl font-bold"
          ><span
            class={`${
              totalVoted != Object.keys(people).length ? "text-red-500" : ""
            }`}>{totalVoted}</span
          >/{Object.keys(people).length}</span
        >
      </div>
      <table class="w-full">
        {#each Object.keys(people).sort( (a, b) => stringSort(people[a].nick, people[b].nick) ) as nickID (nickID)}
          <tr
            class={`border-b border-black first:border-t ${
              people[nickID]?.card?.text ? "" : "bg-yellow-100"
            }`}
          >
            <td class="text-left w-1/2 text-2xl">{people[nickID]?.nick}</td>
            <td
              class={`${
                people[nickID]?.card?.emoji ? "font-emoji" : ""
              } text-center text-5xl py-2 border border-r-0 border-black`}
              >{people[nickID]?.card?.text ?? "-"}</td
            >
          </tr>
        {/each}
      </table>
    {/if}
  </div>
</div>
