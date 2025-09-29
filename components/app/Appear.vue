<template>
  <Transition appear-from-class="opacity-0 translate-y-2 skew-2" appear-to-class="origin-top-left duration-300" appear>
    <slot />
  </Transition>
</template>
