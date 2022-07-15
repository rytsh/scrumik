<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { removeRoomLocalStorage } from "../helper/local";
  import { confirm } from "../helper/ask";
  import { roomList, setRoomList } from "../store/store";

  let className = "";
  export { className as class };

  onMount(() => {
    setRoomList();
    window.addEventListener("storage", setRoomList);
  });

  onDestroy(() => {
    window.removeEventListener("storage", setRoomList);
  });
</script>

<div class={`${className} p-6 bg-white`}>
  <h2 class="font-semibold leading-tight mb-4 text-3xl">Room List</h2>
  <div>
    {#if $roomList != null && $roomList.length > 0}
      <ul>
        {#each $roomList as room (room.id)}
          <li
            class="flex justify-between odd:bg-gray-100 even:bg-gray-200 first:border-t border-b border-black"
          >
            <a
              class="w-full leading-10 hover:bg-green-500 hover:text-white px-2"
              href={`/room/${room.id}`}>{room.info.name}</a
            >
            <button
              class="border-l border-black bg-white hover:bg-red-500 hover:text-white px-2"
              on:click={() => {
                if (confirm(`Are you sure to delete? [${room.info.name}]`)) {
                  removeRoomLocalStorage(room.id);
                }
              }}>delete</button
            >
          </li>
        {/each}
      </ul>
    {:else}
      <p class="italic">No rooms yet</p>
    {/if}
  </div>
</div>
