<script lang="ts">
  import type { Info } from "../helper/models";

  let className = "";
  export { className as class };
  export let id = "";
  export let myName = "";
  export let info: Info = null;

  const roomName = "Voting Room";

  let editMode = false;
  let form: HTMLFormElement;

  const editSettings = async () => {
    return;
  };

  const copyInviteLink = () => {
    const passCode = "xytz";
    // if (leader) {
    //   passCode = "leader";
    // }

    navigator.clipboard.writeText(
      `${window.location.origin}/room/${id}?passcode=${passCode}`
    );
  };
</script>

<svelte:head>
  <title>{roomName}</title>
</svelte:head>

<div class={`${className} p-6 relative`}>
  {#if editMode}
    <form
      on:submit|preventDefault|stopPropagation={editSettings}
      bind:this={form}
    >
      <label>
        <span class="text-sm font-bold block mb-2">Room Name</span>
        <input
          type="text"
          name="name"
          placeholder="Enter a room name"
          autocomplete="off"
          required
          class="mb-4 form-input"
        />
      </label>
      <label>
        <span class="text-sm font-bold block mb-2">Passcode</span>
        <input
          type="text"
          name="passCode"
          autocomplete="off"
          placeholder="Optional passcode to join room"
          class="mb-4 form-input"
        />
      </label>
      <label>
        <span class="text-sm font-bold block mb-2">Leader Passcode</span>
        <input
          type="text"
          name="leaderCode"
          autocomplete="off"
          placeholder="Optional passcode to be leader"
          class="mb-4 form-input"
        />
      </label>
      <button
        type="submit"
        value="save"
        class="block border border-black bg-white text-black hover:bg-nl hover:text-white font-bold py-1 px-3 rounded"
      >
        Save
      </button>
    </form>
  {:else}
    <h2 class="font-semibold leading-tight text-3xl">{info?.name}</h2>
    <span>{myName}</span>
  {/if}
  <div class="absolute top-0 right-0">
    <button
      on:click={() => {
        editMode = !editMode;
      }}
      class="float-right border-l border-b border-black hover:bg-nl hover:text-white px-2 h-7"
      >{editMode ? "Cancel" : "Edit"}</button
    >
    <button
      on:click={copyInviteLink}
      class="float-right border-l border-b border-black hover:bg-nl hover:text-white px-2 h-7"
      >Invite Link</button
    >
    <button
      on:click={copyInviteLink}
      class="float-right border-l border-b border-black hover:bg-nl hover:text-white px-2 h-7"
      >Leader Link</button
    >
  </div>
</div>
