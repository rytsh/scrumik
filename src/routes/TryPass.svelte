<script lang="ts">
  import { querystring } from "svelte-spa-router";
  import { doc } from "firebase/firestore";
  import { db } from "@/lib/helper/fire";

  import { checkPass } from "@/lib/helper/pass";
  import Room from "./Room.svelte";
  import { onMount } from "svelte";
  import { getRoomPasswordLocalStorage } from "@/lib/helper/local";

  export let params = {} as {
    id: string;
  };
  let password = "";
  let error = false;

  let allow = false;
  let mounted = false;

  const queryCheck = (qString: string, noCheck = false) => {
    if (!noCheck && !mounted) return;

    qString = qString.replace(" ", "");
    if (qString == "") {
      return;
    }

    console.log("called", qString);

    const searchParams = new URLSearchParams(qString);
    password = searchParams.get("password") ?? "";

    // remove query in URL
    window.history.replaceState(
      {},
      "",
      window.location.pathname + window.location.hash.replace("?" + qString, "")
    );

    return password;
  };

  $: queryCheck($querystring);

  const tryPassCode = async (paramID: string, pw: string, noCheck = false) => {
    if (!noCheck && !mounted) return;

    error = false;
    const roomRef = doc(db, "room", paramID);

    // get current password
    const pwLocal = getRoomPasswordLocalStorage(paramID);
    // check password
    let reachable = await checkPass(roomRef, pwLocal);
    let usedPassword = pwLocal;

    if (!reachable) {
      reachable = await checkPass(roomRef, pw);
      usedPassword = pw;
    }

    if (!reachable) {
      error = true;
      return;
    }

    // record password
    password = usedPassword;

    allow = true;
  };

  $: tryPassCode(params.id, password);

  const submitForm = (
    e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
  ) => {
    const form = e.currentTarget;
    const passCode = form.elements.namedItem("passCode") as HTMLInputElement;
    const pw = passCode.value;

    tryPassCode(params.id, pw);
  };

  onMount(async () => {
    const pw = queryCheck($querystring, true);
    await tryPassCode(params.id, pw, true);

    mounted = true;
  });
</script>

{#if mounted}
  {#if !allow}
    <div class="flex items-center justify-center">
      <div class="p-6 bg-white border border-black">
        <span class="block mb-4 text-xl font-bold bg-black text-white px-2 py-1"
          >password not correct!</span
        >
        <form on:submit|preventDefault|stopPropagation={submitForm}>
          <label>
            <span class="text-sm font-bold block mb-2">Passcode</span>
            <input
              type="text"
              name="passCode"
              autocomplete="off"
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
              <span
                class="flex-1 bg-red-500 text-white block px-2 leading-loose"
                >Wrong!</span
              >
            {/if}
          </div>
        </form>
      </div>
    </div>
  {:else}
    <Room id={params.id} {password} />
  {/if}
{/if}
