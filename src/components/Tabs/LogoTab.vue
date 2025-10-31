<template>
  <div class="space-y-4">
    <div class="tab-title flex items-center justify-between">
      <p>上传LOGO/SVG</p>
      <input type="file" @change="uploadLogo" accept="image/*" class="hidden" id="logo-upload" />
      <label for="logo-upload" class="cursor-pointer inline-flex items-center justify-center hover:text-gray-500">
        <font-awesome-icon :icon="['fas', 'plus']" />
      </label>
    </div>
    <div class="flex flex-wrap gap-4 p-2 bg-dark rounded-lg">
      <div v-for="(logo, index) in logos" :key="logo.id" class="relative">
        <img :src="logo.url" alt="logo" class="w-20 h-20 object-contain border rounded" @click="() => selectElement(logo.id)" />
        <button @click="() => removeLogo(index)"
          class="absolute top-1 right-1 bg-red-500 text-red-100 rounded-full shadow-lg w-4 h-4 flex items-center justify-center">
          <font-awesome-icon :icon="['fas', 'circle-minus']" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  logos: Array,
});
const emit = defineEmits();

const uploadLogo = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target.result;
      emit('uploadLogo', url);
    };
    reader.readAsDataURL(file);
  }
  // 清空 input 的值，确保可以再次上传相同文件
  event.target.value = '';
};

const removeLogo = (index) => {
  emit('removeLogo', index);
};

const selectElement = (id) => {
  emit('selectElement', id);
};
</script>

<style scoped>
/* 样式可以根据需要添加 */
</style>