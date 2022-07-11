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

  const copyInviteLink = () => {
    const passCode = "xytz";
    // if (leader) {
    //   passCode = "leader";
    // }

    navigator.clipboard.writeText(
      `https://${window.location.host}/room/${id}?passcode=${passCode}`
    );
  };
</script>

<div class={`${className} relative`}>
  <div class="border-b border-black text-xl flex flex-wrap justify-between">
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
          class="px-2 appearance-none border-l border-black self-end hover:bg-green-500 hover:text-white"
          on:click={save}
        >
          Save
        </button>
      {/if}
      <button
        class={`px-2 appearance-none border-l float-right border-black self-end ${
          edit ? "hover:bg-red-500 hover:text-white" : "hover:bg-orange-500"
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
          <tr>
            <td class="text-left w-1/2">{name}</td>
            <td class="text-center">{person.points}</td>
          </tr>
        {/each}
      </table>
    {/if}
  </div>
  <div class="absolute bottom-0 right-0">
    <button
      on:click={copyInviteLink}
      class="float-right border-l border-t border-black hover:bg-orange-500 px-2"
      >Invite Link</button
    >
    <button
      on:click={copyInviteLink}
      class="float-right border-l border-t border-black hover:bg-orange-500 px-2"
      >Leader Link</button
    >
  </div>
</div>
