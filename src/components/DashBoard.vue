<template>
  <!-- Edit panel -->
  <div :class="['edit-panel bg-gray-100', { expanded: isPanelExpanded }]"
    :style="{ marginLeft: isMobile ? '0px' : '40px' }">
    <h2 class="text-xl font-bold text-gray-800 p-4 border-b bg-gray-50">
      Edit Jersey
    </h2>
    <!-- <h3 class="tab-title" v-html="getTabTitle('style')"></h3> -->
    <div class="p-4">
      <div class="tab-content">
        <!-- Style tab -->
        <div v-if="currentTab === 'style'" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
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
          <div v-if="texts.length === 0" class="text-center py-8 text-gray-500">
            <font-awesome-icon :icon="['fas', 'info-circle']" class="text-3xl mb-2"/>
            <p>No text items added yet. Click 'Add Text' to get started!</p>
          </div>
          <div v-else v-for="(text, index) in texts" :key="index" class="text-card">
            <button @click="removeText(index)" class="delete-button">
              <font-awesome-icon :icon="['fas', 'times']" />
            </button>
            <input v-model="text.content" type="text" :placeholder="'Text ' + (index + 1)"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
            <div class="mt-2">
              <label class="text-sm font-medium text-gray-700">Font:</label>
              <select v-model="text.fontType"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                <option v-for="font in fontOptions" :key="font.fontType" :value="font.fontType">{{ font.fontType }}</option>
              </select>
            </div>
            <div class="mt-2">
              <label class="text-sm font-medium text-gray-700">Font Size:</label>
              <input v-model="text.fontSize" type="number" min="1" max="100"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
            </div>
            <div v-for="(border, borderIndex) in text.borders" :key="borderIndex" class="mt-2">
              <label class="text-sm font-medium text-gray-700">{{ border.type }} Border:</label>
              <div class="flex items-center space-x-2">
                <input v-model="border.color" type="color" class="color-input" />
                <input v-model="border.strokeWidth" type="range" min="1" max="100"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                <span class="text-sm text-gray-600">{{
                  border.strokeWidth
                }}</span>
              </div>
            </div>
          </div>
          <button @click="addText"
            class="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Add Text
          </button>
        </div>

        <!-- Logo tab -->
        <div v-if="currentTab === 'logo'" class="space-y-4">
          <div class="flex flex-wrap gap-4">
            <div v-for="(logo, index) in logos" :key="logo.id" class="relative">
              <img :src="logo.url" alt="Uploaded logo" class="w-24 h-24 object-contain border rounded" />
              <button @click="removeLogo(index)"
                class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <font-awesome-icon :icon="['fas', 'times']" />
              </button>
            </div>
          </div>
          <div class="mt-4">
            <input type="file" @change="uploadLogo" accept="image/*" class="hidden" id="logo-upload" />
            <label for="logo-upload"
              class="cursor-pointer inline-flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-500">
              <font-awesome-icon :icon="['fas', 'plus']" class="text-3xl" />
            </label>
          </div>
        </div>

        <!-- Color tab -->
        <div v-if="currentTab === 'color'" class="space-y-4">
          <div v-for="(part, index) in jerseyParts" :key="index" class="border-b pb-4">
            <label :for="'color-' + index" class="block text-sm font-medium text-gray-700">{{ part.name }}</label>
            <div class="mt-2 flex flex-wrap gap-2">
              <button v-for="color in colors" :key="color" @click="setPart(index, color)" :class="['w-8 h-8 rounded-full',
                `${part.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`]"
                :style="{ backgroundColor: color }"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Preview area -->
  <div ref="glCanvas" class="preview-area" :style="{
    width: isPanelExpanded && !isMobile ? 'calc(100% - 350px)' : '100%',
  }"></div>

  <!-- Tab buttons -->
  <div class="tab-buttons bg-gray-200">
    <button @click="togglePanel" :class="[
      'tab-button focus:outline-none',
      isPanelExpanded
        ? 'bg-blue-500 text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    ]">
      <font-awesome-icon :icon="[
        'fas',
        isPanelExpanded ? 'fa-chevron-left' : 'fa-chevron-right',
      ]" />
    </button>
    <button title="Choose Jersey Style" @click="setTab('style')" :class="[
      'tab-button focus:outline-none',
      currentTab === 'style'
        ? 'bg-blue-500 text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    ]">
      <font-awesome-icon :icon="['fas', 'tshirt']" />
    </button>
    <button @click="setTab('text')" title="Edit Colors" :class="[
      'tab-button focus:outline-none',
      currentTab === 'text'
        ? 'bg-blue-500 text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    ]">
      <font-awesome-icon :icon="['fas', 'font']" />
    </button>
    <button @click="setTab('logo')" title="Edit Logo" :class="[
      'tab-button focus:outline-none',
      currentTab === 'logo'
        ? 'bg-blue-500 text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    ]">
      <font-awesome-icon :icon="['fas', 'image']" />
    </button>
    <button @click="setTab('color')" title="Edit color" :class="[
      'tab-button focus:outline-none',
      currentTab === 'color'
        ? 'bg-blue-500 text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    ]">
      <font-awesome-icon :icon="['fas', 'palette']" />
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, watchEffect } from 'vue';
import { World } from '../world/world';
import { StyleManager, fontOptions } from '../utils/StyleManager'
import _ from 'lodash'

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
  if(!newTextId) {
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
  if(type === 'text'){
    const i = texts.value.findIndex(v => v.id === id);
    texts.value.splice(i, 1);
  }
  if(type === 'image'){
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

    // 检查第一层属性变化
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

</script>

<style>
.edit-panel {
  width: 0;
  transition: all 0.3s ease;
  overflow-y: auto;
  max-height: calc(100vh - 80px);
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.edit-panel::-webkit-scrollbar {
  width: 6px;
}

.edit-panel::-webkit-scrollbar-track {
  background: transparent;
}

.edit-panel::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.edit-panel.expanded {
  width: 350px;
  margin-left: 40px;
}

.preview-area {
  flex: 1;
  transition: all 0.3s ease;
  min-width: 60%;
  position: relative;
  /* height: 100%; */
}

.tab-buttons {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 10;
}

.tab-button {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  transition: all 0.3s ease;
  padding: 1rem 0.5rem;
}

.text-card {
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  padding: 2rem 1rem;
  margin-bottom: 1rem;
  position: relative;
  border: 1px solid #e5e7eb;
}

.delete-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  color: #ef4444;
  cursor: pointer;
}

.color-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 2rem;
  height: 2rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.color-input::-webkit-color-swatch {
  border-radius: 50%;
  border: 2px solid #e5e7eb;
}

.color-input::-moz-color-swatch {
  border-radius: 50%;
  border: 2px solid #e5e7eb;
}

.tab-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a5568;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #4a5568;
  display: flex;
  align-items: center;
}
.tab-title i {
  margin-right: 0.5rem;
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .edit-panel {
    width: 100%;
    height: 0;
  }

  .edit-panel.expanded {
    width: 100%;
    height: auto;
  }

  .preview-area {
    width: 100% !important;
  }

  .tab-buttons {
    position: static;
    flex-direction: row;
    margin: 1rem 0;
  }

  .tab-button {
    writing-mode: horizontal-tb;
    transform: none;
    padding: 0.5rem 1rem;
  }
}
</style>
