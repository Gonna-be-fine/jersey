<template>
  <!-- Edit panel -->
  <div :class="['edit-panel', { expanded: isPanelExpanded }]" :style="{
    marginLeft: isMobile ? '0px' : 'calc(var(--default-padding)*2 + 2rem)',
    marginRight: isPanelExpanded ? 'var(--default-padding)' : '0px',
  }">
    <h2 class="text-xl font-medium font-mono text-gray-800 p-4" v-html="getTabTitle(currentTab)"></h2>
    <div :class="['tab-content', { 'p-4': isPanelExpanded }]">
      <!-- Style tab -->
      <div v-if="currentTab === 'style'" class="space-y-4">
        <p class="tab-title">select a style</p>
        <div class="grid grid-cols-2 gap-4 rounded-lg p-2 bg-gray-100">
          <div v-for="style in jerseyStyles" :key="style.name"
            class="border rounded-lg p-2 cursor-pointer hover:border-blue-500"
            :class="{ 'border-blue-500': selectedStyle.name === style.name }" @click="selectStyle(style)">
            <img :src="style.image" :alt="style.name" class="w-full h-32 object-cover rounded-lg mb-2" />
            <p class="text-center font-medium">{{ style.name }}</p>
          </div>
        </div>
      </div>

      <!-- Text tab -->
      <div v-if="currentTab === 'text'" class="space-y-4">
        <div class="tab-title flex items-center justify-between">
          <p>Add or edit a text</p>
          <font-awesome-icon class="cursor-pointer" @click="addText" :icon="['fas', 'plus']" />
        </div>
        <div v-if="texts.length === 0" class="text-center py-8 text-gray-500">
          <font-awesome-icon :icon="['fas', 'info-circle']" class="text-3xl mb-2" />
          <p>No text items added yet. Click 'Add Text' to get started!</p>
        </div>
        <div v-else v-for="(text, index) in texts" :key="index" class="text-card p-4 bg-gray-100 rounded-lg">
          <div class="text-header">
            <div class="flex items-center">
              <button @click="removeText(index)" class="mr-6 text-gray-500">
                <font-awesome-icon :icon="['fas', 'circle-minus']" />
              </button>
              <font-awesome-icon class="mr-2" :icon="['fas', 'comments']" />
              <span class="font-medium mr-2">{{ text.content || 'New Text' }}</span>
            </div>
            <div class="cursor-pointer px-2">
              <font-awesome-icon :icon="['fas', text.isExpanded ? 'chevron-up' : 'chevron-down']"
                @click="text.isExpanded = !text.isExpanded" />
            </div>
          </div>

          <div class="text-content" :class="{ 'expanded': text.isExpanded }">
            <div class="flex items-center justify-between">
              <label>Content</label>
              <input v-model="text.content" type="text" :placeholder="'Text ' + (index + 1)"
                class="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
            </div>
            <div class="mt-4 flex items-center justify-between">
              <label>Font</label>
              <select v-model="text.fontType"
                class="p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                <option v-for="font in fontOptions" :key="font.fontType" :value="font.fontType">{{ font.fontType }}
                </option>
              </select>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <label>Size</label>
              <input v-model="text.fontSize" type="number" min="1" max="100"
                class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
            </div>
            <div v-for="(border, borderIndex) in text.borders" :key="borderIndex" class="mt-2 mb-4">
              <label class="font-bold">{{ border.type[0].toUpperCase() + border.type.slice(1) }} Border</label>
              <div class="flex items-center justify-between">
                <label>Color</label>
                <div class="flex items-center gap-1">
                  <input v-model="border.color" type="color" class="color-input w-6 h-6 rounded-lg" />
                  <input class="w-20 rounded-md p-1" type="text" v-model="border.color" />
                </div>
              </div>
              <div class="flex items-center justify-between mt-2">
                <label>Width</label>
                <div class="flex items-center gap-1">
                  <input v-model="border.strokeWidth" type="range" min="1" max="100"
                    class="w-24 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer" />
                  <input type="number" min="1" max="100" class="w-10 rounded-md p-1" v-model="border.strokeWidth" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Logo tab -->
      <div v-if="currentTab === 'logo'" class="space-y-4">
        <div class="tab-title flex items-center justify-between">
          <p>Add a logo</p>
          <input type="file" @change="uploadLogo" accept="image/*" class="hidden" id="logo-upload" />
          <label for="logo-upload"
            class="cursor-pointer inline-flex items-center justify-center hover:text-gray-500">
            <font-awesome-icon :icon="['fas', 'plus']" />
          </label>
        </div>
        <div class="flex flex-wrap gap-4 p-2 bg-gray-100 rounded-lg">
          <div v-for="(logo, index) in logos" :key="logo.id" class="relative">
            <img :src="logo.url" alt="logo" class="w-20 h-20 object-contain border-2 rounded" />
            <button @click="removeLogo(index)"
              class="absolute top-1 right-1 bg-red-500 text-red-100 rounded-full shadow-lg w-4 h-4 flex items-center justify-center">
              <font-awesome-icon :icon="['fas', 'circle-minus']" />
            </button>
          </div>
        </div>
      </div>

      <!-- Color tab -->
      <div v-if="currentTab === 'color'" class="space-y-4">
        <div class="tab-title flex items-center justify-between">
          <p>Edit cloth color</p>
        </div>
        <div v-for="(part, index) in jerseyParts" :key="index" class="border-b p-4 bg-gray-100 rounded-lg">
          <label :for="'color-' + index" class="block mb-4 text-sm font-medium text-gray-700">{{ part.name }}</label>
          <div class="mt-2 flex flex-wrap gap-2">
            <button v-for="color in colors" :key="color" @click="setPart(index, color)" :class="['w-8 h-8 rounded-full',
              `${part.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`]"
              :style="{ backgroundColor: color }"></button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Preview area -->
  <div :style="{
    width: isPanelExpanded && !isMobile ? 'calc(100% - 350px)' : '100%',
  }" class="preview-area px-4 bg-gray-200">
    <div class="flex items-center justify-between w-full">
      <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" class="ml-4 text-md" />
      <h2 class="text-xl font-medium font-mono text-gray-800 p-4">
        3D Preview
      </h2>
      <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="mr-4 text-md cursor-pointer" />
    </div>
    <div ref="glCanvas" style="width: calc(100% - 4rem); max-height: calc(100% - 5rem);"></div>
    <div class="absolute top-1/2 transform -translate-y-1/2 right-7">
      <div>
        <font-awesome-icon :icon="['fas', 'save']" class="text-xl cursor-pointer text-blue-500" @click="saveDesign" />
      </div>
      <div class="mt-4">
        <font-awesome-icon :icon="['fas', 'ellipsis']" class="text-xl cursor-pointer text-gray-500" />
      </div>
    </div>
  </div>

  <!-- Tab buttons -->
  <div class="tab-buttons">
    <TabButton :active="isPanelExpanded" :icon="['fas', isPanelExpanded ? 'fa-chevron-left' : 'fa-chevron-right']"
      @click="togglePanel" />
    <TabButton title="Choose Jersey Style" :active="currentTab === 'style'" :icon="['fas', 'tshirt']"
      @click="() => setTab('style')" />
      <TabButton title="Edit color" :active="currentTab === 'color'" :icon="['fas', 'palette']"
        @click="() => setTab('color')" />
    <TabButton title="Edit Colors" :active="currentTab === 'text'" :icon="['fas', 'font']"
      @click="() => setTab('text')" />
    <TabButton title="Edit Logo" :active="currentTab === 'logo'" :icon="['fas', 'image']"
      @click="() => setTab('logo')" />
  </div>
  <ActionButtons />
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, watchEffect } from 'vue';
import { World } from '../world/world';
import { StyleManager, fontOptions } from '../utils/StyleManager'
import _ from 'lodash'
import JSZip from "jszip";
import { saveAs } from "file-saver";
import TabButton from '../section/TabButton.vue';
import ActionButtons from './DashBoard/ActionButtons.vue';

let world = null;
const currentTab = ref('text');
const isPanelExpanded = ref(false);

const texts = ref([]);
const logos = ref([]);
const jerseyParts = ref([]);
const colors = ref([]);
const jerseyStyles = [
  { name: 'Striker', image: '/images/1.png', svg: '/texture/style/style3.svg' },
  { name: 'Codex', image: '/images/2.png', svg: '/texture/style/style1.svg' },
  {
    name: 'Maverick',
    image: '/images/3.png',
    svg: '/texture/style/style4.svg'
  },
  { name: 'Fusion', image: '/images/4.png', svg: '/texture/style/style2.svg' },
];
const selectedStyle = ref(jerseyStyles[1]);

const isMobile = computed(() => {
  return window.innerWidth <= 768;
});

const setTab = (tab) => {
  currentTab.value = tab;
  isPanelExpanded.value = true;
};

const togglePanel = () => {
  isPanelExpanded.value = !isPanelExpanded.value;
};

const addText = () => {
  const defaultFont = 'NotoSans';
  const newTextOptions = {
    content: 'NAME',
    fontType: defaultFont,
    fontFile: fontOptions.find(v => v.fontType === defaultFont).fontFile,
    fontSize: 100,
    borders: [
      { type: 'outside', color: '#000000', strokeWidth: 16 },
      { type: 'middle', color: '#ffffff', strokeWidth: 12 },
      { type: 'inside', color: '#000000', strokeWidth: 6 },
    ],
  }
  const newTextId = world.svgEditor.svgCanvas.diyAddText(null, 2340, 5020, newTextOptions)
  if (!newTextId) {
    alert('系统出错！！！')
    return;
  }
  newTextOptions.id = newTextId;
  texts.value.push(newTextOptions);
};

const removeText = (index) => {
  world.svgEditor.svgCanvas.deleteElementById(texts.value[index].id);
  texts.value.splice(index, 1);
};

const uploadLogo = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target.result;
      const id = window.world.svgEditor.addLogo(url);
      logos.value.push({ id, url });
    };
    reader.readAsDataURL(file);
  }
};

const removeLogo = (index) => {
  const logo = logos.value[index];
  world.svgEditor.removeLogo(logo.id);
  logos.value.splice(index, 1);
};

const setPart = (index, color) => {
  jerseyParts.value[index].color = color;

  styleManager.setColorByType(selectedStyle.value.name, mainSvgEle, jerseyParts.value[index].type, color);
  world.mainTextManager.svgToTexture(mainSvgEle.outerHTML);
};

const getTabTitle = (tab) => {
  switch (tab) {
    case 'text':
      return `<font-awesome-icon :icon="['fas','font']" /> Textual Magic`
    case 'logo':
      return '<i class="fas fa-image"></i> Logo Showcase';
    case 'color':
      return '<i class="fas fa-palette"></i> Color Symphony';
    case 'style':
      return `<i class="fas fa-tshirt" /> Jersey Stylist`
    default:
      return '';
  }
};
const selectStyle = async (style) => {
  await initVarFromTexture(style);
  world.mainTextManager.svgToTexture(mainSvgEle.outerHTML);
  selectedStyle.value = style;
};

let mainSvgEle = null;
const styleManager = new StyleManager();
const initVarFromTexture = async (jersy) => {
  const svgText = await fetch(jersy.svg).then((res) =>
    res.text()
  );
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
  mainSvgEle = svgDoc.documentElement;
  const mainSvgCtn = document.querySelector('#mainSvgCtn');
  while (mainSvgCtn.firstChild) {
    mainSvgCtn.removeChild(mainSvgCtn.firstChild);
  }
  mainSvgCtn.appendChild(mainSvgEle);
  // 获取颜色列表
  const { styles, color } = styleManager.getColorByType(jersy.name, mainSvgEle);
  jerseyParts.value = styles;
  colors.value = color

  // 获取图片列表
  const imageList = styleManager.getFontList(window.world.svgEditor.svgCanvas.svgroot)
  logos.value = imageList;

  // 获取文字列表
  const textList = styleManager.getTextList(window.world.svgEditor.svgCanvas.svgroot)
  texts.value = textList;
}
// svgEditor delete event
const svgEditorDelete = (e, target) => {
  const { id, type } = target
  if (type === 'text') {
    const i = texts.value.findIndex(v => v.id === id);
    texts.value.splice(i, 1);
  }
  if (type === 'image') {
    const i = logos.value.findIndex(v => v.id === id);
    logos.value.splice(i, 1);
  }
}
const glCanvas = ref('glCanvas');
onMounted(() => {
  world = new World(glCanvas.value);
  window.world = world;
  world.addEventListener('load_editSvg', () => {
    initVarFromTexture(selectedStyle.value);
    world.svgEditor.svgCanvas.bind('delete', (e, target) => {
      svgEditorDelete(e, target);
    })
  })
});

const monitorTextChange = _.debounce((newTexts, oldTexts) => {
  // 新增或者删除部分跳过；
  if (newTexts.length !== oldTexts.length) return;

  newTexts.forEach((newText, index) => {
    const oldText = oldTexts[index] || {};

    // 检查第一层属性化
    if (newText.content !== oldText.content) {
      console.log(`texts[${index}].content changed:`, newText.content);
      world.svgEditor.svgCanvas.updateDiyText(newText.id, 'content', newText)
      return;
    }

    if (newText.fontType !== oldText.fontType) {
      console.log(`texts[${index}].fontType changed:`, newText.fontType);
      world.svgEditor.svgCanvas.updateDiyText(newText.id, 'fontType', newText)
      return;
    }

    if (newText.fontSize !== oldText.fontSize) {
      world.svgEditor.svgCanvas.updateDiyText(newText.id, 'fontSize', newText)
      return;
    }

    // 检查 borders 的变化 (逐个比较)
    newText.borders.forEach((newBorder, borderIndex) => {
      const oldBorder = oldText.borders?.[borderIndex] || {};
      if (newBorder.type !== oldBorder.type ||
        newBorder.color !== oldBorder.color ||
        newBorder.strokeWidth !== oldBorder.strokeWidth) {
        console.log(`texts[${index}].borders[${borderIndex}] changed:`, newBorder);
        world.svgEditor.svgCanvas.updateDiyText(newText.id, 'borders', newText)
        return;
      }
    });
  });
}, 600);
watch(
  () => _.cloneDeep(texts.value),
  (newTexts, oldTexts) => {
    monitorTextChange(newTexts, oldTexts);
  },
  { deep: true }
);



const downloadZIP = () => {
  const mainSvgCtn = document.querySelector('#mainSvgCtn');
  if (!mainSvgCtn) return;
  const zip = new JSZip();

  // 添加第一个 SVG 文件
  const svgContent1 = window.world.svgEditor.svgCanvas.getSvgString();
  zip.file("editSvg.svg", svgContent1);

  // 添加第二个 SVG 文件
  const svgContent2 = mainSvgCtn.outerHTML;
  zip.file("mainSvg.svg", svgContent2);

  // 生成 ZIP 文件并触发下载
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, "svgs.zip"); // 使用 FileSaver.js 触发下载
  });
}
const saveDesign = () => {
  if (!window.world.svgEditor.svgCanvas) return;
  downloadZIP();
};

</script>

<style>
.edit-panel {
  width: 0;
  transition: all 0.3s ease;
  max-height: 100%;
}

.tab-content {
  max-height: calc(100% - 4.75rem);
  overflow-y: auto;
}

.tab-content::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}

.tab-content::-webkit-scrollbar-track {
  background: transparent;
}

.tab-content::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.edit-panel.expanded {
  width: 25%;
  margin-left: 90px;
}

.preview-area {
  flex: 1;
  transition: all 0.3s ease;
  min-width: 60%;
  position: relative;
  border-radius: 3rem;
  /* height: 100%; */
}

.tab-buttons {
  position: absolute;
  left: var(--default-padding);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 10;
}

.text-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.text-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.text-content.expanded {
  max-height: 1000px;
  transition: max-height 0.5s ease-in;
}

.toggle-arrow {
  transition: transform 0.3s ease;
}

.toggle-arrow.expanded {
  transform: rotate(180deg);
}

.tab-title {
  position: sticky;
  top: -1rem;
  padding-bottom: 0.5rem;
  background: white;
  /* Compensate for parent padding */
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
