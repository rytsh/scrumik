<script lang="ts">
  import { doc, setDoc } from "firebase/firestore";
  import { db } from "../helper/fire";

  import { getRoomPasswordLocalStorage } from "../helper/local";

  import type { Info, RoomSpec } from "../helper/models";
  import { generateName } from "../helper/name";

  let className = "";
  export { className as class };
  export let id = "";
  export let nick = "";
  export let info: Info = null;

  const isLeader = false;

  const roomName = "Voting Room";

  let editMode = false;
  let form: HTMLFormElement;
  let formNick: HTMLInputElement;

  const currentValues: { [key: string]: string } = {
    roomName: "",
    nick: "",
    passCode: "",
    leaderCode: "",
  };

  const fillCurrentValues = () => {
    const p = getRoomPasswordLocalStorage(id);
    currentValues.roomName = info.name;
    currentValues.nick = nick;
    currentValues.passCode = p?.passCode;
    currentValues.leaderCode = p?.leaderCode;
  };

  const editSettings = async () => {
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

    console.log(changes);
    // update data in firebase
    if (Object.keys(changes).length > 0) {
      const mapChanges = {} as Partial<RoomSpec>;
      for (const [key, value] of Object.entries(changes)) {
        switch (key) {
          case "roomName":
            mapChanges.info = { name: value as string };
            break;
          case "nick":
            // mapChanges.people = { [value as string]: { points: "", isLeader } };
            break;
          case "passCode":
            mapChanges.password.passCode = value as string;
            break;
          case "leaderCode":
            mapChanges.password.leaderCode = value as string;
            break;
          default:
            break;
        }
      }

      const roomRef = doc(db, "room", id);
      setDoc(roomRef, mapChanges, { merge: true });
    }
    return;
  };

  const copyInviteLink = (leader = false) => {
    const p = getRoomPasswordLocalStorage(id);
    let password = p?.passCode;
    if (leader) {
      password = p?.leaderCode;
    }

    let url = `${window.location.origin}/room/${id}`;
    if (password) {
      url += `?password=${password}`;
    }

    if (leader && password) {
      url += "&";
    } else {
      url += "?";
    }

    if (leader) {
      url += "&leader";
    }

    navigator.clipboard.writeText(url);
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
      <label>
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
      {#if isLeader}
        <hr class="block py-2 px-2" />
        <label>
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
        <label>
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
    <span>{nick}</span>
  {/if}
  <div class="absolute top-0 right-0">
    <button
      on:click={() => {
        editMode = !editMode;
        if (editMode) {
          fillCurrentValues();
        }
      }}
      class="float-right border-l border-b border-black hover:bg-nl hover:text-white px-2 h-7"
      >{editMode ? "Cancel" : "Edit"}</button
    >
    <button
      on:click={() => copyInviteLink(false)}
      class="float-right border-l border-b border-black hover:bg-nl hover:text-white px-2 h-7"
      >Invite Link</button
    >
    <button
      on:click={() => copyInviteLink(true)}
      class="float-right border-l border-b border-black hover:bg-nl hover:text-white px-2 h-7"
      >Leader Link</button
    >
  </div>
</div>
