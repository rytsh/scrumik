<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { doc, setDoc, type Unsubscribe } from "firebase/firestore";

  import Poker from "@/lib/components/Poker.svelte";
  import Settings from "@/lib/components/Settings.svelte";
  import Vote from "@/lib/components/Vote.svelte";
  import { subscribe } from "@/lib/helper/room";
  import { db } from "@/lib/helper/fire";
  import type { CardV, Info, Password, People } from "@/lib/helper/models";
  import {
    changeIDName,
    getIDName,
    getRoomNameLocalStorage,
    recordRoomLocalStorage,
    setIDName,
  } from "@/lib/helper/local";
  import { generateName } from "@/lib/helper/name";
  import { show } from "@/lib/store/store";
  import { triggerFunction } from "@/lib/helper/trigger";
  import { keyDownListener, keyUpListener } from "@/lib/helper/keys";

  export let id = "";
  export let password = "";
  export let popComponent = "";

  let info: Info = null;

  let { id: nickID, nick } = getIDName() ?? setIDName(generateName());
  let people: People = null;
  let cards: CardV[] = [];

  let unsub: Unsubscribe = null;
  onMount(async () => {
    window.addEventListener("keydown", keyDownListener);
    window.addEventListener("keyup", keyUpListener);

    const roomRef = doc(db, "room", id);
    // record room in local storage
    let roomName = getRoomNameLocalStorage(id);

    // create my user
    await setDoc(
      roomRef,
      {
        people: { [nickID]: { nick: nick, points: "" } },
      },
      { merge: true }
    );

    // subscribe to room
    unsub = subscribe(db, id, (data) => {
      info = data.get("info") as Info;
      people = data.get("people") as People;
      const passwordObj = data.get("password") as Password;
      const cardsTmp = data.get("cards") as CardV[];
      cards = cardsTmp?.sort((a, b) => a.text.localeCompare(b.text)) ?? [];
      // console.log(data.data());

      show.set(data.get("show") as boolean);

      // check kicked
      if (!people[nickID]) {
        // push(`/?msg=You%20have%20been%20kicked!!&kickRoom=${id}`);
        push("/?msg=You%20have%20been%20kicked!!");

        return;
      }

      // detect and change ID name
      if (people[nickID]?.nick != nick) {
        nick = people[nickID]?.nick;
        if (nick) {
          changeIDName(nickID, nick);
        }
      }

      // change info name
      const localChanges = {} as { [key: string]: string };
      if (info?.name != roomName) {
        roomName = info?.name;
        localChanges.name = roomName;
      }

      if (passwordObj.passCode != password) {
        password = passwordObj.passCode;
        localChanges.password = password;
        triggerFunction("password");
      }

      if (Object.keys(localChanges).length) {
        // record room in local storage
        recordRoomLocalStorage(id, {
          ...localChanges,
          id: id,
        });
      }

      // change show status
      if (Object.keys(people).every((id) => people[id].card?.text)) {
        show.set(true);
      }
    });
  });

  onDestroy(() => {
    window.removeEventListener("keydown", keyDownListener);
    window.removeEventListener("keyup", keyUpListener);

    if (unsub != null) {
      unsub();
    }
  });
</script>

{#if popComponent == "vote"}
  <Vote
    {id}
    description={info?.description ?? ""}
    {people}
    pop={true}
    class="flex-1 bg-white border-black border-t border-b sm:border"
  />
{:else}
  <div class="flex flex-col xl:flex-row gap-2">
    <Vote
      {id}
      description={info?.description ?? ""}
      {people}
      class="flex-1 bg-white border-black border-t border-b sm:border"
    />
    <div class="flex flex-1 flex-col gap-2">
      <Settings
        {id}
        {info}
        {nick}
        {nickID}
        class="bg-white border-black border-t border-b sm:border h-fit"
      />
      <Poker
        {id}
        {nickID}
        cardDeck={cards}
        class="flex-1 bg-white border-black border-t border-b sm:border h-fit"
      />
    </div>
  </div>
{/if}
