<script lang="ts">
  import { push } from "svelte-spa-router";
  import { db } from "../helper/fire";
  import { defaultCards, type RoomSpec } from "../helper/models";
  import { createRoom } from "../helper/room";

  let className = "";
  export { className as class };

  let form: HTMLFormElement;

  const create = async () => {
    const formData = new FormData(form);
    const roomSpec: RoomSpec = {
      info: {
        name: formData.get("name") as string,
      },
      password: {
        passCode: formData.get("passCode") as string,
        leaderCode: formData.get("leaderCode") as string,
      },
      cards: defaultCards,
    };

    // fix passCode
    if (roomSpec.password.leaderCode == "") {
      roomSpec.password.leaderCode = roomSpec.password.passCode;
    }

    try {
      const id = await createRoom(db, roomSpec);
      // goes to room page
      push(`/room/${id}?password=${roomSpec.password.leaderCode}`);
    } catch (error) {
      console.error(error);
    }
  };
</script>

<div class={`${className} p-6 bg-white`}>
  <h2 class="font-semibold leading-tight mb-4 text-3xl">Create Room</h2>
  <form on:submit|preventDefault|stopPropagation={create} bind:this={form}>
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
        placeholder="If not set, will be the same as passcode"
        class="mb-4 form-input"
      />
    </label>
    <button
      type="submit"
      value="create"
      class="block border border-black bg-white text-black hover:bg-nl hover:text-white font-bold py-1 px-3 rounded"
    >
      Create Room
    </button>
  </form>
</div>
