<template>
  <div class="space-y-4">
    <div class="tab-title flex items-center justify-between">
      <p>添加/编辑文字</p>
      <font-awesome-icon class="cursor-pointer" @click="addText" :icon="['fas', 'plus']" />
    </div>
    <div v-if="texts.length === 0" class="text-center py-8">
      <font-awesome-icon :icon="['fas', 'info-circle']" class="text-3xl mb-2" />
      <p>No text items added yet. Click 'Add Text' to get started!</p>
    </div>
    <div v-else v-for="(text, index) in texts" :key="index"
      :class="{ 'selected-primary': editingElement.id === text.id }" class="text-card px-4 py-2 bg-dark rounded-lg">
      <div class="flex justify-between items-center px-2" @click="selectElement(text.id)">
        <div class="flex items-center">
          <button @click.stop="removeText(index)" class="mr-6 hover:text-red-500">
            <font-awesome-icon :icon="['fas', 'minus']" />
          </button>
          <font-awesome-icon class="mr-2" :icon="['fas', 'comments']" />
          <span class="font-medium mr-2 text-ellipsis w-28 overflow-hidden whitespace-nowrap">{{ text.content || 'New Text' }}</span>
        </div>
        <div class="cursor-pointer px-2 py-1" @click="openDialog(index)">
          <font-awesome-icon :icon="['fas', text.isExpanded ? 'chevron-up' : 'chevron-down']" />
        </div>
      </div>

      <div class="text-content" :class="{ 'expanded': text.isExpanded }">
        <div class="flex items-center justify-between mt-4">
          <label>内容</label>
          <input v-model="text.content" type="text" :placeholder="'Text ' + (index + 1)"
            class="input-element" />
        </div>
        <div class="mt-2 flex items-center justify-between">
          <label>字体类型</label>
          <select v-model="text.fontType"
            class="input-element">
            <option v-for="font in fontOptions" :key="font.fontType" :value="font.fontType">{{ font.fontType }}</option>
          </select>
        </div>
        <div class="mt-2 flex items-center justify-between">
          <label>字体大小</label>
          <input v-model="text.fontSize" type="number" min="1" max="100"
            class="input-element">
        </div>
        <div v-for="(border, borderIndex) in text.borders" :key="borderIndex" class="mt-2 last:mb-4">
          <div class="flex items-center justify-between">
            <label>{{ computeBorderType(border.type) }}边框</label>
            <div class="flex items-center gap-1">
              <div class="flex items-center gap-1 bg-darker rounded-lg px-2">
                <input v-model="border.strokeWidth" type="range" min="1" max="100" step="1"
                  class="w-20 h-0.5 bg-darker rounded-lg cursor-pointer" />
                <input type="number" min="1" max="100" class="w-10 appearance-none input-element" v-model="border.strokeWidth" />
              </div>
              <input v-model="border.color" type="color" class="p-0.5 bg-darker color-input w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { fontOptions } from '../../utils/StyleManager'
import { defineProps, defineEmits, inject } from 'vue';

const editingElement = inject('editingElement');
const props = defineProps({
  texts: Array,
});
const emit = defineEmits();

const addText = () => {
  emit('addText');
};

const computeBorderType = (type) => {
  if(type.toLowerCase().indexOf('outside') > -1) {
    return '外层';
  }else if(type.toLowerCase().indexOf('middle') > -1) {
    return '夹层';
  }else {
    return '内层';
  }
}
const removeText = (index) => {
  emit('removeText', index);
};

let currentOpenIndex = -1;
const openDialog = (index) => {
  props.texts.forEach(text => {
    text.isExpanded = false;
  });
  if (currentOpenIndex === index) {
    currentOpenIndex = -1;
    return;
  }
  currentOpenIndex = index;
  props.texts[index].isExpanded = true;
}
const selectElement = (id) => {
  emit('selectElement', id);
};
</script>

<style scoped>
/* 样式可以根据需要添加 */
.text-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}
.text-content.expanded {
  max-height: 1000px;
  transition: max-height 0.5s ease-in;
}

.input-element {
  @apply focus:outline-none block rounded-md bg-darker shadow-md sm:text-sm focus:border-none px-2 py-1;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>