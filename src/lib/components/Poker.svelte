<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import {
    arrayRemove,
    arrayUnion,
    doc,
    setDoc,
    updateDoc,
  } from "firebase/firestore";
  import { db } from "@/lib/helper/fire";
  import Card from "@/lib/components/Card.svelte";
  import type { CardV } from "@/lib/helper/models";
  import { stringSort } from "@/lib/helper/sort";
  import { getCardId } from "@/lib/helper/id";
  import { show } from "@/lib/store/store";

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
    if ($show) {
      return;
    }
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
    const id = uuidv4();
    const cardV = {
      text: newCardValues.text,
      emoji: newCardValues.emoji,
      id: id,
    };

    modifiedCardDeck = [...modifiedCardDeck, cardV];

    addAddList(id, cardV);

    newCardScreen = false;
    newCardValues = { ...newCardValuesOrginal };
  };

  // set cards
  const save = async () => {
    const roomRef = doc(db, "room", id);

    try {
      await updateDoc(roomRef, {
        cards: arrayRemove(...Object.values(deleteList)),
      });
      await updateDoc(roomRef, {
        cards: arrayUnion(...Object.values(addList)),
      });
    } catch (e) {
      console.error(e);
    }

    newCardScreen = false;
    newCardValues = { ...newCardValuesOrginal };

    deleteList = {};
    addList = {};

    editMode = false;
  };

  let deleteList = {} as { [key: string]: CardV };
  const addDeleteList = (id: string, cardV: CardV) => {
    deleteList[id] = cardV;
    deleteList = { ...deleteList };
  };
  const delDeleteList = (id: string) => {
    delete deleteList[id];
    deleteList = { ...deleteList };
  };

  let addList = {} as { [key: string]: CardV };
  const addAddList = (id: string, cardV: CardV) => {
    addList[id] = cardV;
  };
  const delAddList = (id: string) => {
    delete addList[id];
    addList = { ...addList };
  };
</script>

<div class={`${className} relative`}>
  <div
    class="w-full border-b border-black flex flex-wrap justify-end box-content"
  >
    <button
      class="flex-1 px-2 bg-white hover:bg-nl hover:text-white"
      on:click={() => selectCard({ detail: "" })}
    >
      Clear My Vote
    </button>
    {#if editMode}
      <button
        class="px-2 bg-white h-7 border-l border-black self-end hover:bg-green-500 hover:text-white"
        on:click={save}
      >
        Save
      </button>
    {/if}
    <button
      class={`px-2 bg-white h-7 border-l border-black self-end hover:text-white ${
        editMode ? "hover:bg-red-500" : "hover:bg-nl"
      }`}
      on:click={() => {
        editMode = !editMode;

        if (editMode) {
          modifiedCardDeck = cardDeck.slice();
          return;
        }

        newCardScreen = false;
        newCardValues = { ...newCardValuesOrginal };
        deleteList = {};
        addList = {};
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
          {#each modifiedCardDeck as card (getCardId(card))}
            <Card
              class={`${
                editMode
                  ? `${
                      deleteList[getCardId(card)]
                        ? "stripe-gray"
                        : `${
                            addList[getCardId(card)]
                              ? "bg-indigo-200"
                              : "bg-gray-100"
                          }`
                    } cursor-not-allowed`
                  : "bg-white"
              }`}
              text={card.text}
              emoji={card.emoji}
              on:delete={() => {
                if (addList[getCardId(card)]) {
                  delAddList(getCardId(card));
                  modifiedCardDeck = [
                    ...modifiedCardDeck.filter(
                      (c) => getCardId(c) != getCardId(card)
                    ),
                  ];
                } else {
                  deleteList[getCardId(card)]
                    ? delDeleteList(getCardId(card))
                    : addDeleteList(getCardId(card), card);
                }
              }}
              {editMode}
            />
          {/each}
          <Card
            class="bg-yellow-200 hover:bg-indigo-400"
            on:click={() => {
              newCardScreen = true;
            }}
            text="+"
          />
        </div>
      {:else}
        <div class="grid justify-between auto-fill-col gap-2">
          {#each cardDeck.sort( (a, b) => stringSort(a.text, b.text) ) as cardV (cardV.text)}
            <Card on:click={selectCard} text={cardV.text} emoji={cardV.emoji} />
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .auto-fill-col {
    grid-template-columns: repeat(auto-fill, 7rem);
  }
</style>
