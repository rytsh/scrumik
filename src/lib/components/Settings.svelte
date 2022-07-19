<script lang="ts">
  import { doc, setDoc } from "firebase/firestore";
  import { db } from "../helper/fire";

  import { getRoomPasswordLocalStorage } from "../helper/local";

  import type { Info, RoomSpec } from "../helper/models";
  import { generateName } from "../helper/name";
  import { checkPass, getPass } from "../helper/pass";
  import { recordRoom } from "../helper/room";
  import { isLeader } from "../store/store";

  let className = "";
  export { className as class };
  export let id = "";
  export let nick = "";
  export let nickID = "";
  export let info: Info = null;

  const roomName = "Voting Room";

  let editMode = false;
  let form: HTMLFormElement;
  let formNick: HTMLInputElement;
  let error = "";

  const switchMode = async () => {
    // get current password
    const password = getRoomPasswordLocalStorage(id);
    // roomref
    const roomRef = doc(db, "room", id);
    // check password for leader
    const [checkLeader, checkPassword] = await checkPass(roomRef, password);

    const currentIsLeader = $isLeader;
    if (currentIsLeader) {
      if (checkLeader) {
        // switch back password
        await recordRoom(db, id, (await getPass(roomRef)).passCode);
        // set leader
        isLeader.set(false);
        return;
      }

      if (!checkPassword) {
        console.error("password failed");
        return;
      }

      // set leader
      isLeader.set(false);
    } else {
      if (!checkLeader) {
        console.error("leader password failed");
        return;
      }

      isLeader.set(true);
    }
  };

  const currentValues: { [key: string]: string } = {
    roomName: "",
    nick: "",
    passCode: "",
    leaderCode: "",
  };

  const fillCurrentValues = () => {
    currentValues.roomName = info.name;
    currentValues.nick = nick;
    currentValues.passCode = "";
    currentValues.leaderCode = "";
  };

  const editSettings = async () => {
    error = "";
    // get data from form element
    const formData = new FormData(form);
    const formValues = {};

    const keys = ["roomName", "nick"];
    if (isLeader) {
      keys.push("passCode", "leaderCode");
    }

    for (const key of keys) {
      formValues[key] = formData.get(key) as string;
    }

    // check changes between current values and form data
    const changes = {};
    for (const [key, value] of Object.entries(formValues)) {
      if (currentValues[key] !== value) {
        changes[key] = value;
      }
    }

    // disable passcode and leader code if not leader
    if (!isLeader) {
      if ("passCode" in changes || "leaderCode" in changes) {
        error = "leader can change passwords";
        return;
      }
    }

    // update data in firebase
    if (Object.keys(changes).length > 0) {
      const mapChanges = {} as Partial<RoomSpec>;
      for (const [key, value] of Object.entries(changes)) {
        switch (key) {
          case "roomName":
            mapChanges.info = { name: value as string };
            break;
          case "nick":
            mapChanges.people = { [nickID]: { nick: value as string } };
            break;
          case "passCode":
            mapChanges.password = {
              ...mapChanges.password,
              passCode: value as string,
            };
            break;
          case "leaderCode":
            mapChanges.password = {
              ...mapChanges.password,
              leaderCode: value as string,
            };
            break;
          default:
            break;
        }
      }

      const roomRef = doc(db, "room", id);
      try {
        await setDoc(roomRef, mapChanges, { merge: true });
        editMode = false;
      } catch (err) {
        error = err;
      }
    }
  };

  const copyInviteLink = async (leader = false) => {
    const p = await getPass(doc(db, "room", id));
    let password = p?.passCode;
    if (leader) {
      password = p?.leaderCode;
    }

    let url = `${window.location.origin}/room/${id}`;
    if (password) {
      url += `?password=${password}`;
    }

    navigator.clipboard.writeText(url);
  };
</script>

<svelte:head>
  <title>{roomName}</title>
</svelte:head>

<div class={`${className}`}>
  <div class="flex justify-between w-full border-b border-black">
    <button
      class="h-7 flex-1 px-2 text-left hover:bg-nl hover:text-white"
      on:click={switchMode}
      >{$isLeader ? "Leader - switch" : "User - switch"}</button
    >
    <div>
      <button
        on:click={() => {
          editMode = !editMode;
          if (editMode) {
            fillCurrentValues();
          }
        }}
        class="float-right border-l border-black hover:bg-nl hover:text-white px-2 h-7"
        >{editMode ? "Cancel" : "Edit"}</button
      >
      <button
        on:click={() => copyInviteLink(false)}
        class="float-right border-l border-black hover:bg-nl hover:text-white px-2 h-7"
        >Invite Link</button
      >
      {#if $isLeader}
        <button
          on:click={() => copyInviteLink(true)}
          class="float-right border-l border-black hover:bg-nl hover:text-white px-2 h-7"
          >Leader Link</button
        >
      {/if}
    </div>
  </div>

  <div class="p-2">
    {#if editMode}
      <form
        on:submit|preventDefault|stopPropagation={editSettings}
        bind:this={form}
      >
        <label class="inline-block w-full">
          <span class="text-sm font-bold mb-2">Room Name</span>
          <input
            type="text"
            name="roomName"
            placeholder="Enter a room name"
            autocomplete="off"
            value={currentValues.roomName}
            required
            class="mb-4 form-input"
          />
        </label>
        <label class="inline-block w-full">
          <span class="text-sm font-bold mb-2">Nick</span>
          <input
            type="text"
            name="nick"
            placeholder="Marcus Antonius"
            autocomplete="off"
            value={currentValues.nick}
            required
            bind:this={formNick}
            class="mb-4 form-input float-right"
          />
          <button
            type="button"
            class="underline hover:bg-nl hover:text-white"
            on:click={() => (formNick.value = generateName())}>Generate</button
          >
        </label>
        {#if $isLeader}
          <hr class="block py-2 px-2" />
          <label class="inline-block w-full">
            <span class="text-sm font-bold mb-2">Passcode</span>
            <input
              type="text"
              name="passCode"
              autocomplete="off"
              value={currentValues.passCode}
              placeholder="Optional passcode to join room"
              class="mb-4 form-input"
            />
          </label>
          <label class="inline-block w-full">
            <span class="text-sm font-bold mb-2">Leader Passcode</span>
            <input
              type="text"
              name="leaderCode"
              autocomplete="off"
              value={currentValues.leaderCode}
              placeholder="Optional passcode to be leader"
              class="mb-4 form-input"
            />
          </label>
        {/if}
        <div class="flex gap-2 justify-between">
          <button
            type="submit"
            value="save"
            class="block border border-black bg-white text-black hover:bg-nl hover:text-white font-bold py-1 px-3 rounded"
          >
            Save
          </button>
          {#if error}
            <span class="flex-1 bg-red-500 text-white block px-2 leading-loose"
              >{error}</span
            >
          {/if}
        </div>
      </form>
    {:else}
      <h2 class="font-semibold leading-tight text-3xl">{info?.name}</h2>
      <span>{nick}</span>
    {/if}
  </div>
</div>
