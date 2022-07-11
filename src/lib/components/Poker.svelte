<script lang="ts">
  import { doc, setDoc } from "firebase/firestore";
  import { db } from "../helper/fire";

  import Card from "./Card.svelte";

  const texts = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  let className = "";
  export { className as class };

  export let id = "";

  export let myName = "";

  const selectCard = (event: CustomEvent) => {
    // select card
    const roomRef = doc(db, "room", id);
    setDoc(
      roomRef,
      { people: { [myName]: { points: event.detail.text } } },
      { merge: true }
    );
  };
</script>

<div class={`${className} p-6 flex flex-wrap gap-2`}>
  {#each texts as text}
    <Card on:click={selectCard} {text} />
  {/each}
</div>
