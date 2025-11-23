<template>
  <div class="space-y-4">
    <div class="tab-title flex items-center justify-between">
      <p>添加/编辑文字</p>
      <font-awesome-icon
        class="cursor-pointer"
        @click="addText"
        :icon="['fas', 'plus']"
      />
    </div>
    <div
      v-if="texts.length === 0"
      class="text-center py-8"
    >
      <font-awesome-icon
        :icon="['fas', 'info-circle']"
        class="text-3xl mb-2"
      />
      <p>还没有添加任何文字！请点击右方‘+’添加</p>
      <!-- <p>No text items added yet. Click 'Add Text' to get started!</p> -->
    </div>
    <div
      v-else
      v-for="(text, index) in texts"
      :key="index"
      :class="{ 'selected-primary': editingElement.id === text.id }"
      class="text-card px-4 py-2 bg-dark rounded-lg"
    >
      <div
        class="flex justify-between items-center px-2"
        @click="selectElement(text)"
      >
        <div class="flex items-center">
          <button
            @click.stop="removeText(index)"
            class="mr-6 hover:text-red-500"
          >
            <font-awesome-icon :icon="['fas', 'minus']" />
          </button>
          <font-awesome-icon
            class="mr-2"
            :icon="['fas', 'comments']"
          />
          <span class="font-medium mr-2 text-ellipsis w-28 overflow-hidden whitespace-nowrap">{{ text.text || 'New Text' }}</span>
        </div>
        <div
          class="cursor-pointer px-2 py-1"
          @click="openDialog(index)"
        >
          <font-awesome-icon :icon="['fas', text.isExpanded ? 'chevron-up' : 'chevron-down']" />
        </div>
      </div>

      <div
        class="text-content"
        :class="{ 'expanded': text.isExpanded }"
      >
        <div class="flex justify-between mt-4">
          <label class="w-1/3">字体</label>
          <div class="w-2/3">
            <input
              v-model="text.text"
              type="text"
              :placeholder="'Text ' + (index + 1)"
              class="input-element w-full"
            />
            <!-- <select @change="(e) =>setFontFamily(index, e.target.value)"
              :value="text.fontFamily"
              class="input-element mt-2 w-full">
              <option v-for="font in fontOptions" :key="font.fontType" :value="font.fontType">{{ font.fontType }}</option>
            </select> -->
            <div class="mt-2">
              <FontSelectionVue
                :currentFont="text.fontFamily"
                @font-selected="(e) => setFontFamily(index, e)"
              />
            </div>

            <div class="grid gap-2 grid-cols-2 mt-2 w-full box-border">
              <div class="px-2 flex items-center bg-darker rounded-lg">
                <img
                  class="w-4 h-4 mr-1"
                  src='/images/assets/font-size.svg'
                />
                <input
                  v-model="text.fontSize"
                  type="number"
                  min="1"
                  max="100"
                  class="min-w-0 input-element box-border"
                />
              </div>
              <div class="flex items-center justify-between bg-darker rounded-lg">
                <font-awesome-icon
                  :icon="['fas', 'bold']"
                  class="rounded-lg py-1 px-2 cursor-pointer"
                  :class="{ 'bg-white': text.fontWeight === 'bold' }"
                  @click="setFontWeight(index)"
                />
                <font-awesome-icon
                  :icon="['fas', 'italic']"
                  class="rounded-lg py-1 px-2 cursor-pointer"
                  :class="{ 'bg-white': text.fontStyle === 'italic' }"
                  @click="setFontItalic(index)"
                />
                <font-awesome-icon
                  :icon="['fas', 'underline']"
                  class="rounded-lg py-1 px-2 cursor-pointer"
                  :class="{ 'bg-white': text.underline }"
                  @click="setFontUnderline(index)"
                />
              </div>
            </div>
            <div class="grid gap-2 grid-cols-2 mt-2 w-full box-border">
              <div class="px-2 flex items-center bg-darker rounded-lg">
                <img
                  class="w-4 h-4 mr-1"
                  src='/images/assets/font-spacing-leftright.svg'
                />
                <input
                  v-model="text.charSpacing"
                  type="number"
                  min="0"
                  max="100"
                  class="min-w-0 input-element box-border"
                />
              </div>
              <div class="px-2 flex items-center bg-darker rounded-lg">
                <img
                  class="w-4 h-4 mr-1"
                  src='/images/assets/font-spacing-updown.svg'
                />
                <input
                  v-model="text.lineHeight"
                  type="number"
                  min="0"
                  max="100"
                  class="min-w-0 input-element box-border"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <label class="w-1/3">排列</label>
          <div class="w-2/3 grid grid-cols-3 gap-2 px-2 bg-darker rounded-lg py-1 justify-items-center">
            <button
              class="rounded-lg w-8"
              :class="{ 'bg-white': text.textAlign === 'left' }"
              @click="setFontLayout(index, 'left')"
            >
              <font-awesome-icon :icon="['fas', 'align-left']" />
            </button>
            <button
              class="rounded-lg w-8"
              :class="{ 'bg-white': text.textAlign === 'center' }"
              @click="setFontLayout(index, 'center')"
            >
              <font-awesome-icon :icon="['fas', 'align-center']" />
            </button>
            <button
              class="rounded-lg w-8"
              :class="{ 'bg-white': text.textAlign === 'right' }"
              @click="setFontLayout(index, 'right')"
            >
              <font-awesome-icon :icon="['fas', 'align-right']" />
            </button>
          </div>
        </div>
        <!-- Curve -->
        <div class="mt-4 flex items-center justify-between">
          <label class="w-1/3">弯曲</label>
          <div class="flex-1 flex items-center justify-end">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="text.isCurved"
                @change="toggleCurve(index)"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-darker rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-300"></div>
            </label>
          </div>
        </div>

        <div
          v-if="text.isCurved"
          class="mt-4 flex items-center justify-between"
        >
          <label class="w-1/3">弯曲值</label>
          <div class="flex-1 grid gap-2 grid-cols-2 w-full box-border">
            <div class="px-2 flex items-center bg-darker rounded-lg col-span-2">
              <img
                class="w-4 h-4 mr-1"
                src='/images/assets/font-spacing-updown.svg'
              />
              <input
                v-model="text.curveValue"
                type="number"
                min="-360"
                max="360"
                class="min-w-0 input-element box-border"
                @input="$emit('updateText', index)"
              />
            </div>
          </div>
        </div>
        <!-- <div class="mt-4 flex items-center justify-between">
          <label class="w-1/3">弯曲</label>
          <div class="flex-1 grid gap-2 grid-cols-2 mt-2 w-full box-border">
            <div class="px-2 flex items-center bg-darker rounded-lg mr-2">
            </div>
            <div class="px-2 flex items-center bg-darker rounded-lg">
              <img
                class="w-4 h-4 mr-1"
                src='/images/assets/font-spacing-updown.svg'
              />
              <input
                v-model="text.curveValue"
                type="number"
                min="0"
                max="100"
                class="min-w-0 input-element box-border"
              />
            </div>
          </div>
        </div> -->
        <div class="mt-4 flex items-center justify-between">
          <label class="w-1/3">颜色</label>
          <div class="w-2/3 px-2 bg-darker rounded-lg flex">
            <input
              v-model="text.fill"
              type="color"
              class="p-0.5 bg-darker color-input w-6 h-6 cursor-pointer"
            />
            <input
              v-model="text.fill"
              type="text"
              class="w-2/3 input-element"
            />
          </div>
        </div>

        <div class="mt-4 flex justify-between">
          <label class="w-1/3">边框</label>
          <div class="w-2/3">
            <div class="bg-darker rounded-lg flex px-2">
              <input
                v-model="text.stroke"
                type="color"
                class="p-0.5 bg-darker color-input w-6 h-6 cursor-pointer"
              />
              <input
                v-model="text.stroke"
                type="text"
                placeholder="暂无边框"
                class="w-2/3 input-element"
              />
            </div>
            <div class="grid gap-2 grid-cols-2 mt-2 w-full box-border">
              <div class="px-2 flex items-center bg-darker rounded-lg">
                <img
                  class="w-4 h-4 mr-1"
                  src='/images/assets/border-width.svg'
                />
                <input
                  v-model="text.strokeWidth"
                  type="number"
                  min="1"
                  max="100"
                  class="min-w-0 input-element box-border"
                />
              </div>
              <div class="px-2 flex items-center bg-darker rounded-lg">
                <img
                  class="w-4 h-4 mr-1"
                  src='/images/assets/border-style.svg'
                />
                <select
                  v-model="text.strokeLineCap"
                  class="input-element mt-2"
                >
                  <option
                    v-for="font in fontOptions"
                    :key="font.fontType"
                    :value="font.fontType"
                  >{{ font.fontType }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { fontOptions } from '../../utils/StyleManager'
import { defineProps, defineEmits, inject, onMounted } from 'vue';
import fontManager from '../../utils/FontManager';
import FontSelectionVue from '../DashBoard/FontSelection.vue';

const editingElement = inject('editingElement');
const props = defineProps({
  texts: Array,
});
const emit = defineEmits();

const addText = () => {
  emit('addText');
};

const removeText = (index) => {
  emit('removeText', index);
};

const updateText = (index) => {
  emit('updateText', index);
}

const setFontWeight = (index) => {
  if (props.texts[index].fontWeight === 'bold') {
    props.texts[index].fontWeight = 'normal';
  } else {
    props.texts[index].fontWeight = 'bold';
  }
}

const setFontFamily = async (index, fontType) => {
  props.texts[index].fontFamily = fontType.type;
  await fontManager.loadFont(fontType.type, { fontUrl: fontType.url });
  emit('updateFontFamily', index, fontType.type);
}

const setFontItalic = (index) => {
  if (props.texts[index].fontStyle === 'normal') {
    props.texts[index].fontStyle = 'italic';
  } else {
    props.texts[index].fontStyle = 'normal';
  }
}

const setFontUnderline = (index) => {
  if (props.texts[index].underline) {
    props.texts[index].underline = false;
  } else {
    props.texts[index].underline = true;
  }
}

const setFontLayout = (index, layout) => {
  props.texts[index].textAlign = layout;
}

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
const selectElement = (text) => {
  if (!text.isExpanded) return;
  emit('selectElement', text.id);
};

/**
 * 切换弯曲功能的开关状态
 * @param {number} index 文本对象在数组中的索引
 */
const toggleCurve = (index) => {
  const textItem = props.texts[index];
  textItem.isCurved = !textItem.isCurved;

  // 1. 开关状态通知事件:
  // 可以在这里发出一个事件，通知父组件开关状态已改变
  emit('curveToggled', {
    index: index,
    id: textItem.id,
    textOptions: textItem,
    isCurved: textItem.isCurved
  });
  
  // 2. 确保更新到画布：
  // 调用父组件的 updateText 方法以同步更改到画布/编辑器
  emit('updateText', index);
}
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