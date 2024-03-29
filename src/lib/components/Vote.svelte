<script lang="ts">
  import { doc, setDoc, updateDoc } from "firebase/firestore";
  import { db } from "@/lib/helper/fire";
  import round from "lodash/round";

  import type { People } from "@/lib/helper/models";
  import { stringSort } from "@/lib/helper/sort";
  import { show } from "@/lib/store/store";
  import Icon from "./Icon.svelte";

  let className = "";
  export { className as class };

  export let id = "";
  export let selfId = "";
  export let description = "";
  export let pop = false;
  export let people: People = null;

  let editMode = false;

  const save = () => {
    const roomRef = doc(db, "room", id);
    setDoc(roomRef, { info: { description: description } }, { merge: true });

    // delete list
    const newPeople = {} as People;
    Object.keys(people).forEach((key) => {
      if (!deleteList[key]) {
        newPeople[key] = people[key];
      }
    });
    updateDoc(roomRef, { people: newPeople });

    editMode = false;
    deleteList = {};
  };

  const averageCount = (people: People) => {
    let totalPeople = 0;
    const total = Object.keys(people).reduce((total, current) => {
      const txt = people[current].card?.text;
      if (txt == "") {
        return total;
      }

      let v = 0;
      const num = Number(txt);
      if (!isNaN(num)) {
        totalPeople++;
        v = num;
      }

      return total + v;
    }, 0);

    return round(total / totalPeople, 2);
  };

  $: totalVoted = people
    ? Object.keys(people).reduce((total, current) => {
        const v = people[current].card?.text ? 1 : 0;
        return total + v;
      }, 0)
    : 0;

  $: average = people ? averageCount(people) : 0;

  let deleteList = {} as { [key: string]: boolean };
  const addDeleteList = (id: string) => {
    deleteList[id] = true;
  };
  const delDeleteList = (id: string) => {
    delete deleteList[id];
    deleteList = { ...deleteList };
  };

  const clearVotes = () => {
    if (people) {
      Object.keys(people).forEach((key) => {
        if (people[key].card) {
          people[key].card.text = null;
          people[key].card.emoji = false;
        }
      });

      const roomRef = doc(db, "room", id);
      setDoc(roomRef, { people: people, show: false }, { merge: true });
      show.set(false);
    } else {
      const roomRef = doc(db, "room", id);
      setDoc(roomRef, { show: false }, { merge: true });
      show.set(false);
    }
  };

  const showResults = () => {
    const roomRef = doc(db, "room", id);
    setDoc(roomRef, { show: true }, { merge: true });
    show.set(true);
  };
</script>

<div class={`${className} relative`}>
  <div
    class="border-b border-black h-7 flex flex-wrap justify-between box-content"
  >
    <span class="px-2">
      Voting -
      <i class="leading-7"
        >{editMode ? "" : description ? description : "Topic Name"}</i
      >
    </span>
    {#if editMode}
      <input
        class="bg-gray-200 flex-1 px-2 min-w-[2rem]"
        type="text"
        bind:value={description}
      />
    {/if}
    <div>
      <a
        href={`#/room/${id}${pop ? "" : "?pop=vote"}`}
        title="pop-up votes"
        class="float-right px-2 h-7 border-l border-black self-end hover:text-white hover:bg-nl"
      >
        {#if pop}
          <Icon icon="shrink" class="pointer-events-none" />
        {:else}
          <Icon icon="pop" class="pointer-events-none" />
        {/if}
      </a>
      {#if editMode}
        <button
          class="px-2 h-7 border-l border-black self-end hover:bg-green-500 hover:text-white"
          on:click={save}
        >
          Save
        </button>
      {/if}
      <button
        class={`float-right px-2 h-7 border-l border-black self-end hover:text-white ${
          editMode ? "hover:bg-red-500" : "hover:bg-nl"
        }`}
        on:click={() => {
          editMode = !editMode;
          deleteList = {};
        }}
      >
        {editMode ? "Cancel" : "Edit topic & users"}
      </button>
    </div>
  </div>
  <div class="p-2">
    {#if people}
      <div class="flex items-center justify-between mb-4">
        <div>
          <button
            class="px-2 h-7 border border-black hover:bg-nl hover:text-white"
            on:click={clearVotes}
          >
            Clear Votes
          </button>
          <button
            on:click={showResults}
            class="px-2 h-7 border border-black hover:bg-nl hover:text-white"
          >
            Show Results
          </button>
        </div>
        {#if $show}
          <span class="text-xl font-bold">{average}</span>
        {/if}
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
            class={`odd:bg-gray-100 border-b border-black first:border-t
            ${people[nickID]?.card?.text ? "" : "!bg-yellow-100"}
            ${deleteList[nickID] ? "stripe-gray" : ""}`}
          >
            <td
              class={`text-left w-1/2 text-2xl ${
                nickID == selfId ? "underline" : ""
              }`}
            >
              {people[nickID]?.nick}
            </td>
            <td
              class={`${
                people[nickID]?.card?.emoji || !$show ? "font-emoji" : ""
              } text-center text-4xl py-1 border border-r-0 border-black relative`}
              >{$show ? people[nickID]?.card?.text ?? "-" : "🟧"}
              {#if editMode}
                <button
                  class="bg-white border-l border-r border-black hover:bg-red-500 absolute top-0 right-0 h-full text-2xl px-2"
                  on:click={() =>
                    deleteList[nickID]
                      ? delDeleteList(nickID)
                      : addDeleteList(nickID)}
                >
                  X
                </button>
              {/if}
            </td>
          </tr>
        {/each}
      </table>
    {/if}
  </div>
</div>
