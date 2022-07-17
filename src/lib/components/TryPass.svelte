<script lang="ts">
  import { doc } from "firebase/firestore";
  import { db } from "../helper/fire";

  import { checkPass, redirectToRoom } from "../helper/pass";

  export let id = "";
  let password = "";
  let error = false;

  const tryPassCode = async () => {
    error = false;
    const roomRef = doc(db, "room", id);
    // check password
    if (!(await checkPass(roomRef, password))) {
      error = true;
      return;
    }

    redirectToRoom(id, password);
    return;
  };
</script>

<div class="flex items-center justify-center">
  <div class="p-6 bg-white border border-black">
    <span class="block mb-4 text-xl font-bold bg-black text-white px-2 py-1"
      >Password not correct</span
    >
    <form on:submit|preventDefault|stopPropagation={tryPassCode}>
      <label>
        <span class="text-sm font-bold block mb-2">Passcode</span>
        <input
          type="text"
          name="passCode"
          autocomplete="off"
          bind:value={password}
          placeholder="Password to join room"
          class="mb-4 form-input"
        />
      </label>
      <div class="flex gap-2 justify-between">
        <button
          type="submit"
          value="create"
          class="block border border-black bg-white text-black hover:bg-nl hover:text-white font-bold py-1 px-3 rounded"
        >
          Login
        </button>
        {#if error}
          <span class="flex-1 bg-red-500 text-white block px-2 leading-loose"
            >Wrong!</span
          >
        {/if}
      </div>
    </form>
  </div>
</div>
