<script context="module" lang="ts">
  export async function load({ params, url }) {
    const password = (url as URL).searchParams.get("password") ?? "";
    return {
      props: {
        id: params.id,
        password: password,
      },
    };
  }
</script>

<script lang="ts">
  import Poker from "@/lib/components/Poker.svelte";
  import Settings from "@/lib/components/Settings.svelte";
  import Vote from "@/lib/components/Vote.svelte";
  import { recordRoom, subscribe } from "@/lib/helper/room";
  import { doc, setDoc, type Unsubscribe } from "firebase/firestore";
  import { onDestroy, onMount } from "svelte";
  import { db } from "@/lib/helper/fire";
  import type { CardV, Info, People } from "@/lib/helper/models";
  import {
    changeIDName,
    getIDName,
    recordRoomLocalStorage,
    setIDName,
  } from "@/lib/helper/local";
  import { generateName } from "@/lib/helper/name";
  import { checkPass } from "@/lib/helper/pass";
  import TryPass from "@/lib/components/TryPass.svelte";
  import { isLeader, show } from "@/lib/store/store";

  export let id = "";
  export let password = "";

  let tryPass = false;
  let mounted = false;
  let info: Info = null;

  let { id: nickID, nick } = getIDName() ?? setIDName(generateName());
  let people: People = null;
  let cards: CardV[] = [];

  let unsub: Unsubscribe = null;
  onMount(async () => {
    const roomRef = doc(db, "room", id);
    // check password
    const [checkLeader, checkPassword] = await checkPass(roomRef, password);
    if (!checkPassword) {
      tryPass = true;
      mounted = true;
      return;
    }

    // set leader
    isLeader.set(checkLeader);

    // record room in local storage
    let roomName = await recordRoom(db, id, password);

    // create my user
    await setDoc(
      roomRef,
      {
        people: { [nickID]: { nick: nick, points: "", isLeader: checkLeader } },
      },
      { merge: true }
    );

    // subscribe to room
    unsub = subscribe(db, id, (data) => {
      info = data.get("info") as Info;
      people = data.get("people") as People;
      const cardsTmp = data.get("cards") as CardV[];
      cards = cardsTmp?.sort((a, b) => a.text.localeCompare(b.text)) ?? [];
      // console.log(data.data());

      show.set(data.get("show") as boolean);

      // check kicked
      if (!people[nickID]) {
        window.location.href =
          "/?msg=You%20have%20been%20kicked!!&kickRoom=" + id;

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
      if (info?.name != roomName) {
        roomName = info?.name;
        recordRoomLocalStorage(id, {
          id: id,
          name: roomName,
          password: password,
        });
      }

      // change show status
      if (Object.keys(people).every((id) => people[id].card.text)) {
        show.set(true);
      }
    });

    tryPass = false;
    mounted = true;
  });

  onDestroy(() => {
    if (unsub != null) {
      unsub();
    }
  });
</script>

{#if mounted}
  {#if tryPass}
    <TryPass {id} />
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
{/if}
