<script lang="ts">
  import { db } from "../helper/fire";
  import { isReachableRoom } from "../helper/room";

  let className = "";
  export { className as class };

  let form: HTMLFormElement;
  let warn: string;

  const create = async () => {
    const formData = new FormData(form);

    const roomID = formData.get("roomID") as string;
    const password = formData.get("password") as string;

    // check roomID and password
    try {
      const passApproved = await isReachableRoom(db, roomID, password);
      if (!passApproved) {
        throw new Error("Passcode is not correct");
      }

      window.location.href = `/room/${roomID}${
        password != "" ? `?password=${password}` : ""
      }`;
    } catch (error) {
      warn = error.message;
    }
  };
</script>

<div class={`${className} p-6 bg-white`}>
  <h2 class="font-semibold leading-tight mb-4 text-3xl">Join Room</h2>
  <form on:submit|preventDefault|stopPropagation={create} bind:this={form}>
    <label>
      <span class="text-sm font-bold block mb-2">Room ID</span>
      <input
        type="text"
        name="roomID"
        placeholder="Room ID"
        required
        class="mb-4 form-input"
      />
    </label>
    <label>
      <span class="text-sm font-bold block mb-2">Password</span>
      <input
        type="password"
        name="passCode"
        placeholder="Leave it empty if don't need password"
        class="mb-4 form-input"
      />
    </label>
    <div class="block">
      <button
        type="submit"
        value="join"
        class="border border-black bg-white text-black hover:bg-nl hover:text-white font-bold py-1 px-3 rounded"
      >
        Join
      </button>
      <button
        type="button"
        class:invisible={!warn}
        on:click={() => (warn = "")}
        class="border border-black bg-white text-black hover:bg-red-500 hover:text-white font-bold py-1 px-3 rounded"
      >
        {warn ?? ""}
      </button>
    </div>
  </form>
</div>
