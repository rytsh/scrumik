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
        {#each Object.keys(people).sort((a, b) => a.length - b.length) as person (person)}
          <tr
            class={`border-b border-black first:border-t ${
              people[person].card?.text
                ? people[person].card?.text == "-"
                  ? "bg-yellow-100"
                  : ""
                : "bg-yellow-100"
            }`}
          >
            <td class="text-left w-1/2 text-2xl">{person}</td>
            <td
              class={`${
                people[person].card?.emoji ? "font-emoji" : ""
              } text-center text-5xl border border-r-0 border-black`}
              >{people[person].card?.text ?? "-"}</td
            >
          </tr>
        {/each}
      </table>
    {/if}
  </div>
</div>
