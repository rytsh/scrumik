<script lang="ts">
  /* eslint-disable no-unused-vars */

  enum IconTypes {
    king = "M16.896 10l-4.896-8-4.896 8-7.104-4 3 11v5h18v-5l3-11-7.104 4zm-11.896 10v-2h14v2h-14zm14.2-4h-14.4l-1.612-5.909 4.615 2.598 4.197-6.857 4.197 6.857 4.615-2.598-1.612 5.909z",
    reload = "M22 3v18h-5v-2h3v-14h-6v3l-5.25-4 5.25-4v3h8zm-12 16h-6v-14h3v-2h-5v18h8v3l5.25-4-5.25-4v3z",
    pop = "M14 4h-13v18h20v-11h1v12h-22v-20h14v1zm10 5h-1v-6.293l-11.646 11.647-.708-.708 11.647-11.646h-6.293v-1h8v8z",
    shrink = "M24 22h-24v-20h24v20zm-23-9v8h10v-8h-10zm22 8v-18h-22v9h11v9h11zm-4-9h-5v-5h1v3.241l5.241-5.241.759.759-5.241 5.241h3.241v1z",
  }

  type IconTypesString = keyof typeof IconTypes;

  type PosTypes = "left" | "down" | "up" | undefined;

  export let icon: IconTypesString;

  export let height = "24";
  export let width = "24";

  let className: string = undefined;
  export let position: PosTypes = undefined;
  export { className as class };
  export let title = "icon";

  const totalClass = [className, position].join(" ");
</script>

<span {title} class={totalClass ? totalClass : undefined}>
  <svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24">
    <path d={IconTypes[icon]} />
  </svg>
</span>

<style lang="scss">
  .left {
    transform: rotate(180deg);
  }

  .down {
    transform: rotate(90deg);
  }

  .up {
    transform: rotate(-90deg);
  }
</style>
