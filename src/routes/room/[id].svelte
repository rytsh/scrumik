<script context="module" lang="ts">
  export async function load({ params, url }) {
    const leader = (url as URL).searchParams.has("leader");
    const password = (url as URL).searchParams.get("password") ?? "";
    return {
      props: {
        id: params.id,
        leader: leader,
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

  export let id = "";
  export let leader = false;
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
    if (!(await checkPass(roomRef, password))) {
      tryPass = true;
      mounted = true;
      return;
    }

    // record room in local storage
    let roomName = await recordRoom(db, id);

    // create my user
    await setDoc(
      roomRef,
      { people: { [nickID]: { nick: nick, points: "", isLeader: false } } },
      { merge: true }
    );

    // subscribe to room
    unsub = subscribe(db, id, (data) => {
      info = data.get("info") as Info;
      people = data.get("people") as People;
      const cardsTmp = data.get("cards") as CardV[];
      cards = cardsTmp?.sort((a, b) => a.text.localeCompare(b.text)) ?? [];
      // console.log(data.data());

      // detect and change ID name
      if (people[nickID]?.nick != nick) {
        nick = people[nickID]?.nick;
        changeIDName(nickID, nick);
      }

      // change info name
      if (info?.name != roomName) {
        roomName = info?.name;
        recordRoomLocalStorage(id, { id: id, name: roomName });
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
    <div class="flex flex-row gap-2">
      <Vote
        {id}
        description={info?.description ?? ""}
        {people}
        class="flex-1 bg-white border-black border-2"
      />
      <div class="flex flex-1 flex-col gap-2">
        <Settings
          {id}
          {info}
          {nick}
          {nickID}
          class="bg-white border-black border-2 h-fit"
        />
        <Poker
          {id}
          {nickID}
          cardDeck={cards}
          class="flex-1 bg-white border-black border-2 h-fit"
        />
      </div>
    </div>
  {/if}
{/if}
