<script lang="ts">
  export let text = "";
  export let emoji = false;
</script>

<div
  class="h-44 w-24 bg-white border-2 border-black flex items-center justify-center"
>
  <span class={`${emoji ? "font-emoji" : ""} text-5xl hover:text-orange-500`}
    >{text}</span
  >
</div>
