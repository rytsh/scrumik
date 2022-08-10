<script lang="ts">
  import { doc, setDoc } from "firebase/firestore";
  import { onDestroy, onMount } from "svelte";
  import { db } from "@/lib/helper/fire";

  import type { Info, RoomSpec } from "@/lib/helper/models";
  import { generateName } from "@/lib/helper/name";
  import { getPass } from "@/lib/helper/pass";
  import { generateQR } from "@/lib/helper/qr";
  import { deleteTrigger, recordTrigger } from "@/lib/helper/trigger";

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

  let copied = false;

  const boxedReset = () => {
    boxed = false;
    boxedType = "";
    boxedLink = "";
    boxedInfo = "";
    boxedQR = "";
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

    // roomref
    const roomRef = doc(db, "room", id);
    const pwObj = await getPass(roomRef);
    currentValues.passCode = pwObj.passCode;
  };

  const editSettings = async () => {
    error = "";
    // get data from form element
    const formData = new FormData(form);
    const formValues = {};

    const keys = ["roomName", "nick", "passCode"];

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

  const getLink = async () => {
    const p = await getPass(doc(db, "room", id));
    const password = p?.passCode;

    let url = `${window.location.origin}/#/room/${id}`;
    if (password) {
      url += `?password=${password}`;
    }

    return url;
  };

  const copyInviteLink = (url: string) => {
    navigator.clipboard.writeText(url).then(
      () => {
        // clipboard successfully set
        copied = true;
        setTimeout(() => (copied = false), 500);
      },
      () => {
        // clipboard write failed
        console.error("clipboard write failed");
      }
    );
  };

  const refreshQR = async () => {
    if (boxedInfo == "Invite Link") {
      boxedLink = await getLink();
      boxedQR = await generateQR(boxedLink);
    }
  };

  onMount(() => {
    recordTrigger("password", "settings", refreshQR);
  });

  onDestroy(() => {
    deleteTrigger("password", "settings");
  });
</script>

<div class={`${className}`}>
  <div class="flex justify-between w-full border-b border-black">
    <div>
      <span class="px-2 h-7">{nick}</span>
    </div>
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
          if (boxedInfo == "Invite Link") {
            boxedReset();
            return;
          }

          boxedLink = await getLink();
          boxedInfo = "Invite Link";
          boxedType = "link";
          boxedQR = await generateQR(boxedLink);
          boxed = true;
        }}
        class="float-right border-l border-black hover:bg-nl hover:text-white px-2 h-7"
        >{boxedInfo == "Invite Link"
          ? "Close Invite Link"
          : "Invite Link"}</button
      >
    </div>
  </div>

  {#if boxed}
    <div class="block border-b border-black bg-yellow-200 relative">
      {#if boxedType == "link"}
        <div class="flex flex-row flex-wrap-reverse justify-center">
          <img alt="qrcode" src={boxedQR} />
          <div class="flex flex-1 border-l border-black flex-col">
            <div class="flex items-center flex-1 min-w-[20rem]">
              <div class="flex-1 border-black border-t border-b flex flex-col">
                <input
                  class="bg-white w-full text-ellipsis inline-block flex-1 px-2"
                  type="text"
                  readonly
                  title={boxedLink}
                  value={boxedLink}
                />
                <button
                  class={`${
                    copied ? "hover:bg-green-500" : "hover:bg-nl"
                  } float-right border-t border-black bg-gray-50 hover:text-white px-2 h-7`}
                  on:click={() => {
                    copyInviteLink(boxedLink);
                  }}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
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
            on:click={() => (formNick.value = generateName())}
          >
            Generate
          </button>
        </label>
        <hr class="block py-1 px-2" />
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
    {/if}
  </div>
</div>
