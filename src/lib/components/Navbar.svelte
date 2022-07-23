<script lang="ts">
  import { link } from "svelte-spa-router";

  export let title = "scrumik";
  export let message = "scrum poker tool";
  let className = "";
  export { className as class };
</script>

<div class={`${className} bg-black text-white flex items-center`}>
  <a
    href="/"
    class="appearance-none text-xl font-bold mr-4 hover:text-nl"
    use:link
  >
    {title}
  </a>

  <span>
    {message}
  </span>

  <div class="flex-grow text-right">
    <a
      href="https://github.com/rytsh/scrumik"
      target="_blank"
      class="hover:text-nl border-l border-white pl-4 pr-2"
    >
      github
    </a>
  </div>
</div>
