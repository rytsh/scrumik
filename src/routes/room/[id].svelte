<script context="module">
  export async function load({ params }) {
    return {
      props: {
        id: params.id,
      },
    };
  }
</script>

<script lang="ts">
  import Poker from "@/lib/components/Poker.svelte";
  import Settings from "@/lib/components/Settings.svelte";
  import Vote from "@/lib/components/Vote.svelte";
  import { subscribe } from "@/lib/helper/room";
  import { doc, setDoc, type Unsubscribe } from "firebase/firestore";
  import { onDestroy, onMount } from "svelte";
  import { db } from "@/lib/helper/fire";
  import type { Info, People } from "@/lib/helper/models";
  import { getName, setName } from "@/lib/helper/local";
  import { generateName } from "@/lib/helper/name";

  export let id = "";

  let info: Info = null;

  const myName = getName() ?? setName(generateName());
  let people: People = null;

  const unsub: Unsubscribe = null;
  onMount(() => {
    // create my user
    const roomRef = doc(db, "room", id);
    setDoc(
      roomRef,
      { people: { [myName]: { points: "", isLeader: false } } },
      { merge: true }
    );
    // subscribe to room
    subscribe(db, id, (data) => {
      info = data.get("info") as Info;
      people = data.get("people") as People;
      // console.log(data.data());
    });
  });

  onDestroy(() => {
    if (unsub != null) {
      unsub();
    }
  });
</script>

<div class="flex flex-row gap-2">
  <Vote
    {id}
    description={info?.description ?? ""}
    {people}
    class="flex-1 bg-white border-black border-2"
  />
  <div class="flex flex-1 flex-col gap-2">
    <Settings {id} {info} {myName} class="bg-white border-black border-2" />
    <Poker {id} {myName} class="flex-1 bg-white border-black border-2" />
  </div>
</div>
