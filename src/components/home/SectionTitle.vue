<template>
  <div :class="[
    'mb-8 relative',
    align === 'center' ? 'text-center' : 'text-left'
  ]">
    <h2 class="text-3xl md:text-4xl font-playfair font-bold text-gray-900 inline-block relative">
      <slot>{{ title }}</slot>
      <span class="absolute bottom-0 left-0 w-16 h-0.5 bg-primary transition-all duration-300 group-hover:w-24"></span>
    </h2>
    <div v-if="$slots.action" 
         :class="[
           'mt-4 md:mt-0',
           align === 'center' ? 'text-center' : 'md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2'
         ]">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SectionTitle',
  props: {
    title: {
      type: String,
      default: ''
    },
    align: {
      type: String,
      default: 'left'
    }
  }
}
</script> 