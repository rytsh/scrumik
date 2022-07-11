<script>
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
</script>

<div class="flex flex-wrap gap-2">
  {#each texts as text}
    <Card {text} />
  {/each}
</div>
