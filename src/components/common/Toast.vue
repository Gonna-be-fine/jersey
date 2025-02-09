<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-2 opacity-0"
    >
      <div
        v-if="isVisible"
        class="fixed top-16 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div 
          class="px-4 py-2 rounded-lg shadow-lg text-white min-w-[200px] text-center"
          :class="typeClasses[type]"
        >
          {{ message }}
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 2000
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  }
});

const isVisible = ref(false);
const typeClasses = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500'
};

onMounted(() => {
  isVisible.value = true;
  setTimeout(() => {
    isVisible.value = false;
  }, props.duration);
});
</script> 