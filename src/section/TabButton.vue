<template>
  <div @click="onClick" class="p-2 bg-dark rounded-lg mr-6 cursor-pointer">
    <button 
      :class="[
        'tab-button mr-5 focus:outline-none w-8 h-8 flex items-center justify-center',
        active
        ? 'bg-white text-gray-600'
        : 'text-gray-400',
        ...customClass,
      ]"
      :title="title"
    >
      <font-awesome-icon :icon="icon" class="text-xs w-4" />
    </button>
    <div :class="[active ? 'text-white' : 'text-gray-400', 'text-xs text-center']">
      {{ type }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  },
  icon: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  },
  customClass: {
    type: Array,
    default: []
  }
});

const emit = defineEmits(['click']);

const onClick = () => {
  emit('click');
};
</script>

<style scoped>
.tab-button {
  transition: all 0.3s ease;
  /* border-radius: 1rem; */
  margin: 0.2rem 0;
  min-width: 2rem;
  min-height: 2rem;
}

@media (max-width: 768px) {
  .tab-button {
    margin: 0 0.5rem;
  }
}
</style> 