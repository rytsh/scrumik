<script lang="ts">
  import { querystring } from "svelte-spa-router";

  import Create from "@/lib/components/Create.svelte";
  import Join from "@/lib/components/Join.svelte";
  import Nick from "@/lib/components/Nick.svelte";
  import RoomList from "@/lib/components/RoomList.svelte";
  import { removeRoomLocalStorage } from "@/lib/helper/local";

  let msg = "";

  const queryCheck = (qString: string) => {
    const searchParams = new URLSearchParams(qString);
    msg = searchParams.get("msg") ?? "";
    const kickRoom = searchParams.get("kickRoom") ?? "";

    if (kickRoom) {
      removeRoomLocalStorage(kickRoom);
    }
  };

  $: queryCheck($querystring);
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
