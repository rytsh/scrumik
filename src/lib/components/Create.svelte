<script lang="ts">
  import { push } from "svelte-spa-router";
  import { db } from "@/lib/helper/fire";
  import { defaultCards, type RoomSpec } from "@/lib/helper/models";
  import { createRoom } from "@/lib/helper/room";

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
      },
      cards: defaultCards,
    };

    try {
      const id = await createRoom(db, roomSpec);
      // goes to room page
      let urlRoom = `/room/${id}`;
      if (roomSpec.password.passCode) {
        urlRoom += `?password=${roomSpec.password.passCode}`;
      }
      push(urlRoom);
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
    <button
      type="submit"
      value="create"
      class="block border border-black bg-white text-black hover:bg-nl hover:text-white font-bold py-1 px-3 rounded"
    >
      Create Room
    </button>
  </form>
</div>
