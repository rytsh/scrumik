<script lang="ts">
  import { doc, setDoc } from "firebase/firestore";
  import { db } from "../helper/fire";

  import {
    getRoomPasswordLocalStorage,
    recordRoomLocalStorage,
  } from "../helper/local";

  import type { Info, RoomSpec } from "../helper/models";
  import { generateName } from "../helper/name";
  import { checkPass, getPass } from "../helper/pass";
  import { generateQR } from "../helper/qr";
  import { isLeader } from "../store/store";

  let className = "";
  export { className as class };
  export let id = "";
  export let nick = "";
  export let nickID = "";
  export let info: Info = null;

  let editMode = false;
  let form: HTMLFormElement;
  let formNick: HTMLInputElement;
  let error = "";

  let boxed = false;
  let boxedType = "";
  let boxedLink = "";
  let boxedInfo = "";
  let boxedQR = "";

  const boxedReset = () => {
    boxed = false;
    boxedType = "";
    boxedLink = "";
    boxedInfo = "";
    boxedQR = "";
  };

  const switchMode = async () => {
    // get current password
    const password = getRoomPasswordLocalStorage(id);
    // roomref
    const roomRef = doc(db, "room", id);
    // check password for leader
    const [checkLeader] = await checkPass(roomRef, password);

    const currentIsLeader = $isLeader;
    if (currentIsLeader) {
      if (checkLeader) {
        // set leader
        isLeader.set(false);

        const pwObj = await getPass(roomRef);
        // set local password as normal
        recordRoomLocalStorage(id, {
          password: pwObj.passCode,
          id: id,
        });
        return;
      }

      // set leader
      isLeader.set(false);
    } else {
      if (!checkLeader) {
        boxedType = "pass";
        boxedInfo = "Password is incorrect";
        boxed = true;
        return;
      }

      isLeader.set(true);
    }
  };

  const switchTryLeader = async (password: string) => {
    // roomref
    const roomRef = doc(db, "room", id);
    // check password for leader
    const [checkLeader] = await checkPass(roomRef, password);
    if (!checkLeader) {
      boxedInfo = "Password is incorrect";
      return;
    }

    // set leader
    isLeader.set(true);

    // set local password as leader password
    recordRoomLocalStorage(id, {
      password: password,
      id: id,
    });
    boxedReset();
  };

  const submitForm = (
    e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
  ) => {
    boxedInfo = "";
    const form = e.currentTarget;
    const passCode = form.elements.namedItem("passCode") as HTMLInputElement;
    const pw = passCode.value;

    switchTryLeader(pw);
  };

  const currentValues: { [key: string]: string } = {
    roomName: "",
    nick: "",
    passCode: "",
    leaderCode: "",
  };

  const fillCurrentValues = async () => {
    currentValues.roomName = info.name;
    currentValues.nick = nick;

    if ($isLeader) {
      // roomref
      const roomRef = doc(db, "room", id);
      const pwObj = await getPass(roomRef);
      currentValues.passCode = pwObj.passCode;
      currentValues.leaderCode = pwObj.leaderCode;
    } else {
      currentValues.passCode = "";
      currentValues.leaderCode = "";
    }
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

  const getLink = async (leader = false) => {
    const p = await getPass(doc(db, "room", id));
    let password = p?.passCode;
    if (leader) {
      password = p?.leaderCode;
    }

    let url = `${window.location.origin}/#/room/${id}`;
    if (password) {
      url += `?password=${password}`;
    }

    return url;
  };

  const copyInviteLink = (url: string) => {
    navigator.clipboard.writeText(url);
  };
</script>

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
        on:click={async () => {
          boxedLink = await getLink(false);
          boxedInfo = "Selected Invite link";
          boxedType = "link";
          boxedQR = await generateQR(boxedLink);
          boxed = true;
        }}
        class="float-right border-l border-black hover:bg-nl hover:text-white px-2 h-7"
        >Invite Link</button
      >
      {#if $isLeader}
        <button
          on:click={async () => {
            boxedLink = await getLink(true);
            boxedInfo = "Selected Leader link";
            boxedType = "link";
            boxedQR = await generateQR(boxedLink);
            boxed = true;
          }}
          class="float-right border-l border-black hover:bg-nl hover:text-white px-2 h-7"
          >Leader Link</button
        >
      {/if}
    </div>
  </div>

  {#if boxed}
    <div class="block border-b border-black bg-yellow-200 relative">
      {#if boxedType == "pass"}
        <button
          on:click={boxedReset}
          class="px-2 h-7 bg-gray-100 border-b border-l border-black hover:bg-red-500 hover:text-white absolute top-0 right-0"
        >
          X
        </button>
        <form on:submit|preventDefault|stopPropagation={submitForm} class="p-2">
          <label>
            <span class="text-sm font-bold block mb-2">Passcode for leader</span
            >
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
              class="block border border-black bg-white text-black hover:bg-nl hover:text-white font-bold py-1 px-2"
            >
              Try Switch Leader
            </button>
            <span class="flex-1 bg-red-500 text-white block px-2 leading-loose"
              >{boxedInfo}</span
            >
          </div>
        </form>
      {:else if boxedType == "link"}
        <div class="flex flex-row flex-wrap">
          <img alt="qrcode" src={boxedQR} />
          <div class="flex flex-1 border-l border-black flex-col">
            <div class="bg-gray-100 border-b border-black w-full">
              <span class="inline-block px-2 leading-7">{boxedInfo}</span>
              <button
                on:click={boxedReset}
                class="px-2 h-7 float-right border-l border-black hover:bg-red-500 hover:text-white"
              >
                X
              </button>
            </div>
            <div class="flex items-center flex-1">
              <div class="flex-1 border-black border-t border-b flex">
                <input
                  class="bg-white w-full h-7 text-ellipsis inline-block flex-1 px-2"
                  type="text"
                  readonly
                  title={boxedLink}
                  value={boxedLink}
                />
                <button
                  class="float-right border-l border-black bg-gray-100 hover:text-white hover:bg-nl px-2 h-7"
                  on:click={() => {
                    copyInviteLink(boxedLink);
                  }}>Copy</button
                >
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}

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
