<template>
  <div class="space-y-4">
    <p class="tab-title">Select a style</p>
    <div class="grid grid-cols-2 gap-4 rounded-lg p-2 bg-gray-100">
      <div v-for="style in jerseyStyles" :key="style.name"
        class="rounded-lg p-2 cursor-pointer hover:border-blue-500"
        :class="{ 'selected-primary': selectedStyle.name === style.name }" @click="() => selectStyle(style)">
        <img :src="style.image" :alt="style.name" class="w-full h-32 object-cover rounded-lg mb-2" />
        <p class="text-center font-medium">{{ style.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  jerseyStyles: Array,
  selectedStyle: Object,
});
const emit = defineEmits();

const selectStyle = (style) => {
  emit('selectStyle', style);
};
</script>

<style scoped>
/* 样式可以根据需要添加 */
</style>