<script lang="ts">
  /* eslint-disable no-unused-vars */

  enum IconTypes {
    king = "M16.896 10l-4.896-8-4.896 8-7.104-4 3 11v5h18v-5l3-11-7.104 4zm-11.896 10v-2h14v2h-14zm14.2-4h-14.4l-1.612-5.909 4.615 2.598 4.197-6.857 4.197 6.857 4.615-2.598-1.612 5.909z",
    reload = "M22 3v18h-5v-2h3v-14h-6v3l-5.25-4 5.25-4v3h8zm-12 16h-6v-14h3v-2h-5v18h8v3l5.25-4-5.25-4v3z",
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
