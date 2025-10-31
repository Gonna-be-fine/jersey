<template>
  <div class="space-y-4">
    <div class="tab-title">
      <p>换个颜色~</p>
    </div>
    <div v-for="(part, index) in jerseyParts" :key="index" class="p-2 bg-dark rounded-lg">
      <label :for="'color-' + index" class="block mb-4">{{ part.name }}</label>
      <div class="mt-2 flex flex-wrap gap-2">
        <button v-for="color in colors" :key="color" @click="() => setColor(index, color)" :class="['w-8 h-8 rounded-full', `${part.color === color ? 'ring-2 ring-offset-1 ring-white ring-offset-dark' : ''}`]"
          :style="{ backgroundColor: color }"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  jerseyParts: Array,
  colors: Array,
});
const emit = defineEmits();

const setColor = (index, color) => {
  emit('setColor', index, color);
};
</script>

<style scoped>
/* 样式可以根据需要添加 */
</style>