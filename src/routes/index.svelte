<script context="module" lang="ts">
  export async function load({ url }) {
    const msg = (url as URL).searchParams.get("msg") ?? "";
    const kickRoom = (url as URL).searchParams.get("kickRoom") ?? "";
    return {
      props: {
        msg: msg,
        kickRoom: kickRoom,
      },
    };
  }
</script>

<script lang="ts">
  import Create from "@/lib/components/Create.svelte";
  import Join from "@/lib/components/Join.svelte";
  import Nick from "@/lib/components/Nick.svelte";
  import RoomList from "@/lib/components/RoomList.svelte";
  import { removeRoomLocalStorage } from "@/lib/helper/local";

  export let msg = "";
  export let kickRoom = "";

  if (kickRoom) {
    removeRoomLocalStorage(kickRoom);
  }
</script>

{#if msg}
  <div class="border-t border-b sm:border border-black mb-3 bg-yellow-200">
    <span class="p-2">{msg}</span>
    <button
      class="border-l border-black bg-gray-200 hover:bg-nl px-2 float-right"
      on:click={() => (msg = "")}>X</button
    >
  </div>
{/if}

<div class="flex flex-1 gap-3 md:flex-row flex-col">
  <div class="flex flex-1 flex-col gap-3">
    <Join class="flex-1 border-t border-b sm:border border-black h-fit" />
    <RoomList class="flex-1 border-t border-b sm:border border-black h-fit" />
  </div>
  <div class="flex flex-1 flex-col gap-3">
    <Nick class="flex-1 border-t border-b sm:border border-black h-fit" />
    <Create class="flex-1 border-t border-b sm:border border-black h-fit" />
  </div>
</div>
