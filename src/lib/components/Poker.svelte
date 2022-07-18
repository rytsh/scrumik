<script lang="ts">
  import isEqual from "lodash/isEqual";
  import {
    arrayRemove,
    arrayUnion,
    doc,
    setDoc,
    updateDoc,
  } from "firebase/firestore";
  import { db } from "../helper/fire";
  import Card from "./Card.svelte";
  import type { CardV } from "../helper/models";
  import { stringSort } from "../helper/sort";

  export let cardDeck: CardV[] = [];

  let className = "";
  export { className as class };
  export let id = "";
  export let nickID = "";

  let editMode = false;
  let newCardScreen = false;

  const newCardValuesOrginal = {
    text: "X",
    emoji: false,
  };

  let newCardValues = { ...newCardValuesOrginal };
  let modifiedCardDeck: CardV[];

  const selectCard = (event: CustomEvent | { detail: string }) => {
    // select card
    const roomRef = doc(db, "room", id);
    setDoc(
      roomRef,
      { people: { [nickID]: { card: event.detail } } },
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
    newCardValues = { ...newCardValuesOrginal };
  };

  // set cards
  const save = async () => {
    const roomRef = doc(db, "room", id);
    let addCardDeck = modifiedCardDeck.slice();
    let deleteCardDeck: CardV[] = [];
    // get differences
    for (const card of cardDeck) {
      const beforeLength = addCardDeck.length;
      addCardDeck = addCardDeck.filter((c) => !isEqual(c, card));
      if (addCardDeck.length == beforeLength) {
        deleteCardDeck = [...deleteCardDeck, card];
      }
    }

    try {
      await updateDoc(roomRef, { cards: arrayRemove(...deleteCardDeck) });
      await updateDoc(roomRef, { cards: arrayUnion(...addCardDeck) });
    } catch (e) {
      console.error(e);
    }
    // await setDoc(roomRef, { cards: modifiedCardDeck }, { merge: true });

    newCardScreen = false;
    newCardValues = { ...newCardValuesOrginal };

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
          newCardValues = { ...newCardValuesOrginal };
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
                newCardValues = { ...newCardValuesOrginal };
              }}
              class="border border-black bg-white text-black hover:bg-red-500 hover:text-white font-bold py-1 px-3 rounded"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>

    <div class="p-2">
      {#if editMode}
        <div class="grid justify-between auto-fill-col gap-2">
          {#each modifiedCardDeck as card, i}
            <Card
              class="bg-white"
              text={card.text}
              emoji={card.emoji}
              on:delete={() => {
                modifiedCardDeck = [
                  ...modifiedCardDeck.filter((_, j) => j !== i),
                ];
              }}
              {editMode}
            />
          {/each}
        </div>
      {:else}
        <button
          class="w-full border-2 border-black hover:bg-nl hover:text-white mb-4"
          on:click={() => selectCard({ detail: "" })}
        >
          Clear Vote
        </button>
        <div class="grid justify-between auto-fill-col gap-2">
          {#each cardDeck.sort( (a, b) => stringSort(a.text, b.text) ) as cardV (cardV.text)}
            <Card on:click={selectCard} text={cardV.text} emoji={cardV.emoji} />
          {/each}
        </div>
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

<style lang="scss">
  .auto-fill-col {
    grid-template-columns: repeat(auto-fill, 7rem);
  }
</style>
