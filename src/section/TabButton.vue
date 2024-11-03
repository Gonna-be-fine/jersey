<template>
  <button 
    @click="onClick" 
    :class="[
      'tab-button focus:outline-none w-8 h-8 flex items-center justify-center',
      active
      ? 'bg-blue-500 text-white'
      : 'text-gray-600 hover:bg-gray-200',
      ...customClass,
    ]"
    :title="title"
  >
    <font-awesome-icon :icon="icon" class="text-xs w-4" />
  </button>
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
  border-radius: 50%;
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