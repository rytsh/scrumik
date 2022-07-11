<script lang="ts">
  export let title = "scrumik";
  export let message = "scrum poker tool";
  let className = "";
  export { className as class };
</script>

<div class={`${className} bg-black text-white flex items-center`}>
  <span class="text-xl font-bold mr-4">
    {title}
  </span>

  <span>
    {message}
  </span>
</div>
