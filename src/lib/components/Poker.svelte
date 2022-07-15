<script lang="ts">
  import { doc, setDoc } from "firebase/firestore";
  import { db } from "../helper/fire";

  import Card from "./Card.svelte";
  import type { CardV } from "../helper/models";

  export let cardDeck: CardV[] = [];

  let className = "";
  export { className as class };
  export let id = "";
  export let myName = "";

  let editMode = false;
  let newCardScreen = false;

  const newCardValuesOrginal = {
    text: "X",
    emoji: false,
  };

  let newCardValues = { ...newCardValuesOrginal };
  let modifiedCardDeck: CardV[];

  const selectCard = (event: CustomEvent) => {
    // select card
    const roomRef = doc(db, "room", id);
    setDoc(
      roomRef,
      { people: { [myName]: { card: event.detail } } },
      { merge: true }
    );
  };

  const newCard = () => {
    // create new card
    modifiedCardDeck = [
      ...modifiedCardDeck,
      {
        text: newCardValues.text,
        emoji: newCardValues.emoji,
      },
    ];

    newCardScreen = false;
    newCardValues = newCardValuesOrginal;
  };

  // set cards
  const save = () => {
    const roomRef = doc(db, "room", id);
    setDoc(roomRef, { cards: modifiedCardDeck }, { merge: true });

    newCardScreen = false;
    newCardValues = newCardValuesOrginal;

    editMode = false;
  };
</script>

<div class={`${className} relative`}>
  <div
    class="w-full stripe-black border-b border-black flex flex-wrap justify-end box-content"
  >
    {#if editMode}
      <button
        class="px-2 bg-white h-7 appearance-none border-l border-black self-end hover:bg-green-500 hover:text-white"
        on:click={save}
      >
        Save
      </button>
    {/if}
    <button
      class={`float-right px-2 bg-white h-7 appearance-none border-l border-black self-end hover:text-white ${
        editMode ? "hover:bg-red-500" : "hover:bg-nl"
      }`}
      on:click={() => {
        if (editMode) {
          newCardScreen = false;
          newCardValues = newCardValuesOrginal;
        } else {
          modifiedCardDeck = cardDeck.slice();
        }
        editMode = !editMode;
      }}
    >
      {editMode ? "Cancel" : "Edit"}
    </button>
  </div>

  <div class="relative">
    <div
      class="p-6 absolute bg-gray-300 bg-opacity-90 w-full h-full z-10"
      class:hidden={!newCardScreen}
    >
      <div
        class="p-2 h-full border border-black bg-white flex justify-around gap-2 items-center"
      >
        <Card
          class="bg-white"
          text={newCardValues.text}
          emoji={newCardValues.emoji}
        />
        <div class="bg-white">
          <form on:submit|preventDefault|stopPropagation={newCard}>
            <label>
              <span class="text-sm font-bold block mb-2">Card Text</span>
              <input
                type="text"
                name="cardText"
                placeholder="&MF"
                autocomplete="off"
                required
                class="mb-2 form-input"
                bind:value={newCardValues.text}
              />
            </label>
            <label class="flex mb-4">
              <span class="text-sm font-bold block pr-4">Icon</span>
              <input
                type="checkbox"
                name="icon"
                bind:checked={newCardValues.emoji}
              />
            </label>
            <button
              type="submit"
              value="create"
              class="border border-black bg-white text-black hover:bg-green-500 hover:text-white font-bold py-1 px-3 rounded"
            >
              New Card
            </button>
            <button
              type="button"
              on:click={() => {
                newCardScreen = false;
                newCardValues = newCardValuesOrginal;
              }}
              class="border border-black bg-white text-black hover:bg-red-500 hover:text-white font-bold py-1 px-3 rounded"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>

    <div class="p-6 flex flex-wrap gap-2">
      {#if editMode}
        {#each modifiedCardDeck as card}
          <Card class="bg-white" text={card.text} emoji={card.emoji} />
        {/each}
      {:else}
        {#each cardDeck as cardV}
          <Card
            on:click={selectCard}
            text={cardV.text}
            emoji={cardV.emoji}
            {editMode}
          />
        {/each}
      {/if}
      {#if editMode}
        <Card
          class="bg-yellow-200 hover:bg-indigo-400"
          on:click={() => {
            newCardScreen = true;
          }}
          text="+"
        />
      {/if}
    </div>
  </div>
</div>
