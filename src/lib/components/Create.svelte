<script lang="ts">
  import { db } from "../helper/firebase";
  import { recordRoomLocalStorage } from "../helper/local";
  import type { RoomSpec } from "../helper/models";
  import { createRoom } from "../helper/room";

  let className = "";
  export { className as class };

  let form: HTMLFormElement;

  const create = async () => {
    const formData = new FormData(form);
    const roomSpec: RoomSpec = {
      name: formData.get("name") as string,
      password: {
        passCode: formData.get("passCode") as string,
        leaderCode: formData.get("leaderCode") as string,
      },
    };

    try {
      const id = await createRoom(db, roomSpec);
      roomSpec.id = id;
      // record id in local storage
      recordRoomLocalStorage(id, roomSpec);
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
        placeholder="Optional passcode to be leader"
        class="mb-4 form-input"
      />
    </label>
    <button
      type="submit"
      value="create"
      class="block border border-black bg-white text-black hover:bg-orange-500 hover:text-white font-bold py-1 px-3 rounded"
    >
      Create Room
    </button>
  </form>
</div>
