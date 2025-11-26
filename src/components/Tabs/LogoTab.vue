<template>
  <div class="space-y-4">
    <!-- <div class="tab-title flex items-center justify-between">
      <p>上传LOGO/SVG</p>
      <input
        type="file"
        @change="uploadLogo"
        accept="image/*"
        class="hidden"
        id="logo-upload"
      />
      <label
        for="logo-upload"
        class="cursor-pointer inline-flex items-center justify-center hover:text-gray-500"
      >
        <font-awesome-icon :icon="['fas', 'plus']" />
      </label>
    </div> -->
    <!-- <div class="flex flex-wrap gap-4 p-2 bg-dark rounded-lg">
      <div
        v-for="(logo, index) in logos"
        :key="logo.id"
        class="relative"
      >
        <img
          :src="logo.url"
          alt="logo"
          class="w-20 h-20 object-contain border rounded"
          @click="() => selectElement(logo.id)"
        />
        <button
          @click="() => removeLogo(index)"
          class="absolute top-1 right-1 bg-red-500 text-red-100 rounded-full shadow-lg w-4 h-4 flex items-center justify-center"
        >
          <font-awesome-icon :icon="['fas', 'circle-minus']" />
        </button>
      </div>
    </div> -->

    <!-- Header / Action Bar -->
    <div class="flex items-center justify-between p-2 rounded-lg bg-dark ">
      <p class="font-semibold  pl-2">Assets / Logos</p>

      <div class="flex items-center gap-2">
        <!-- Hidden File Input -->
        <input
          type="file"
          ref="fileInputRef"
          @change="uploadLogo"
          accept="image/*"
          class="hidden"
          id="logo-upload"
        />

        <!-- Upload Button -->
        <button
          for="logo-upload"
          @click="triggerFileInput"
          type="button"
          class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
          title="Upload Local File"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <span>上传</span>
        </button>

        <!-- Library Button -->
        <button
          type="button"
          @click="isRepoOpen = true"
          class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          title="Choose from Library"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          <span>仓库</span>
        </button>
      </div>
    </div>

    <!-- Grid Area: Logos -->
    <div class="flex flex-wrap gap-4 p-4 bg-dark rounded-xl shadow-sm min-h-[160px]">
      <!-- empty state -->
      <div
        v-if="!logos || logos.length === 0"
        class="w-full h-32 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg"
      >
        <svg
          class="w-8 h-8 mb-2 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span class="text-sm">No logos added yet.</span>
      </div>

      <!-- logos -->
      <div
        v-for="(logo, index) in logos"
        :key="logo.id"
        class="relative group w-24 h-24"
      >
        <!-- Image / SVG container -->
        <div
          class="w-full h-full p-2 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors overflow-hidden"
          @click="() => selectElement(logo.id)"
        >
          <div
            v-if="isRawSvg(logo.url)"
            class="w-full h-full text-gray-800"
            v-html="logo.url"
          ></div>
          <img
            v-else
            :src="logo.url"
            :alt="logo.name"
            class="w-full h-full object-contain"
          />
        </div>

        <!-- remove button -->
        <button
          @click.stop="() => removeLogo(index)"
          class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
          title="Remove"
        >
          <svg
            class="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 12H4"
            />
          </svg>
        </button>

        <!-- hover label -->
        <div class="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[10px] text-center truncate rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity p-0.5 pointer-events-none">
          {{ logo.name }}
        </div>
      </div>
    </div>

    <!-- 右侧弹出的 SVG 素材库组件 -->
    <SvgDrawer
      :isOpen="isRepoOpen"
      :svgLibrary="svgLibrary"
      @close="isRepoOpen = false"
      @select="handleLibrarySelect"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';
import SvgDrawer from '../DashBoard/SvgDrawer.vue';

const props = defineProps({
  logos: Array,
});
const emit = defineEmits();
const fileInputRef = ref(null);

const isRepoOpen = ref(false);
const svgLibrary = ref([]);

// ---- helpers ----
const isRawSvg = (str) => typeof str === 'string' && str.trim().startsWith('<svg');

const triggerFileInput = () => {
  fileInputRef.value && fileInputRef.value.click();
};
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

// ---- Drawer selection ----
const handleLibrarySelect = (item) => {
  if (!item || !item.content) return;
  emit('uploadLogo', item.content);
  isRepoOpen.value = false;
};


// ---- Fetch SVG from server ----
onMounted(async () => {
  // const res = await fetch(props.fetchUrl);
  svgLibrary.value = getFallbackLibrary();
  // svgLibrary.value = await res.json();
});

// ---- fallback demo library (follows the example you provided earlier) ----
function getFallbackLibrary() {
  // 基础图标（Fabric 可解析：无 class，无 currentColor）
  const base = [
    {
      id: 'star',
      name: 'Star',
      category: 'Shapes',
      content: `
      <svg viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>`
    },
    {
      id: 'circle',
      name: 'Circle',
      category: 'Shapes',
      content: `
      <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
      </svg>`
    },
    {
      id: 'heart',
      name: 'Heart',
      category: 'Icons',
      content: `
      <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>`
    },
    {
      id: 'zap',
      name: 'Lightning',
      category: 'Icons',
      content: `
      <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>`
    },
    {
      id: 'smile',
      name: 'Smile',
      category: 'Emoji',
      content: `
      <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>`
    },
    {
      id: 'sun',
      name: 'Sun',
      category: 'Nature',
      content: `
      <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>`
    }
  ];

  // 可生成的颜色（hex，Fabric 可识别）
  const colors = [
    '#f87171', '#60a5fa', '#4ade80', '#a78bfa', '#f472b6', '#818cf8'
  ];

  const result = [...base];

  // 自动生成 30 个变体
  for (let i = 0; i < 30; i++) {
    const baseItem = base[i % base.length];
    const color = colors[i % colors.length];

    // 用正则替换原 stroke="xxxx"
    const content = baseItem.content.replace(
      /stroke="#[0-9a-fA-F]{3,6}"/,
      `stroke="${color}"`
    );

    result.push({
      id: `gen-${i}`,
      name: `${baseItem.name} ${i + 1}`,
      category: i % 2 === 0 ? 'Generated' : baseItem.category,
      content
    });
  }

  return result;
}

</script>

<style scoped>
/* 样式可以根据需要添加 */
</style>