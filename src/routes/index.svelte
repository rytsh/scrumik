<script lang="ts">
  import Create from "@/lib/components/Create.svelte";
  import Join from "@/lib/components/Join.svelte";
  import RoomList from "@/lib/components/RoomList.svelte";
</script>

<div class="flex flex-1 gap-3">
  <div class="flex flex-1 flex-col gap-3">
    <Join class="flex-1 border border-black h-fit" />
    <RoomList class="flex-1 border border-black h-fit" />
  </div>
  <Create class="flex-1 border border-black h-fit" />
</div>
