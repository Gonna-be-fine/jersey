<template>
  <div class="overflow-y-auto text-gray-600">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 h-full">
      <!-- <div ref="glCanvas" class="w-full h-full absolute top-0 left-0 z-10"></div> -->
      <div class="relative w-full h-[50vh] md:h-[70vh] lg:h-full lg:col-span-8 z-10 border-container">
        <!-- 返回按钮 - 放在顶部 -->
        <button 
          @click="router.back()"
          class="absolute left-4 top-4 w-10 h-10 rounded-full bg-dark hover:bg-darker 
                 transition-colors duration-300 flex items-center justify-center text-white 
                 shadow-lg group"
          title="返回上一页"
        >
          <font-awesome-icon 
            :icon="['fas', 'arrow-left']" 
            class="group-hover:scale-110 transition-transform duration-300"
          />
        </button>

        <div ref="glCanvas" class="w-full h-full"></div>
        
        <!-- 编辑操作按钮 - 放在中间 -->
        <div class="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
          <!-- 撤销按钮 -->
          <button 
            @click="cancelEdit"
            class="w-10 h-10 rounded-full bg-dark hover:bg-darker transition-colors duration-300 
                   flex items-center justify-center text-white shadow-lg group"
            title="撤销"
          >
            <font-awesome-icon 
              :icon="['fas', 'undo']" 
              class="group-hover:scale-110 transition-transform duration-300"
            />
          </button>

          <!-- 重做按钮 -->
          <button 
            @click="restoreCancel"
            class="w-10 h-10 rounded-full bg-dark hover:bg-darker transition-colors duration-300 
                   flex items-center justify-center text-white shadow-lg group"
            title="重做"
          >
            <font-awesome-icon 
              :icon="['fas', 'redo']" 
              class="group-hover:scale-110 transition-transform duration-300"
            />
          </button>
        </div>
      </div>
      <!-- 设计工具区域 -->
      <div class="lg:h-screen md:h-[70vh] lg:col-span-4 flex flex-col border-container">
        <div class="flex items-center justify-center p-2">
          <!-- <TabButton
            title="Choose Jersey Style"
            type="款式"
            :active="currentTab === 'style'" 
            :icon="['fas', 'tshirt']"
            @click="() => setTab('style')" 
          /> -->
          <TabButton 
            title="Edit color" 
            type="颜色"
            :active="currentTab === 'color'" 
            :icon="['fas', 'palette']"
            @click="() => setTab('color')" 
          />
          <TabButton 
            title="Edit text" 
            type="文字"
            :active="currentTab === 'text'" 
            :icon="['fas', 'font']"
            @click="() => setTab('text')" 
          />
          <TabButton 
            title="Edit Logo" 
            type="Logo"
            :active="currentTab === 'logo'" 
            :icon="['fas', 'image']"
            @click="() => setTab('logo')" 
          />
          <TabButton 
            title="Submit An Order" 
            type="订单"
            :active="currentTab === 'order'" 
            :icon="['fas', 'cart-plus']"
            @click="() => setTab('order')" 
          />
        </div>
        <div class="flex-1 overflow-y-auto pt-2 px-8 pb-6 text-gray-400 text-sm">
          <StyleTab v-if="currentTab === 'style'" :jerseyStyles="jerseyStyles" :selectedStyle="selectedStyle"
            @selectStyle="selectStyle" />
          <TextTab v-if="currentTab === 'text'" :texts="texts" @addText="addText" @removeText="removeText"
            @selectElement="selectElement" />
          <LogoTab v-if="currentTab === 'logo'" :logos="logos" @uploadLogo="uploadLogo" @removeLogo="removeLogo" />
          <ColorTab v-if="currentTab === 'color'" :jerseyParts="jerseyParts" :colors="colors" @setPart="setPart" />
          <OrderTab v-if="currentTab === 'order'" :players="players" @addPlayer="addPlayer" @removePlayer="removePlayer" />
        </div>
      </div>
    </div>
  </div>
  <div id="svgCtn"></div>
  <div id="mainSvgCtn" style="pointer-events: none;"></div>
</template>

<script setup>
import { ref, computed, onMounted, watch, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StyleTab from '../components/Tabs/StyleTab.vue';
import TextTab from '../components/Tabs/TextTab.vue';
import LogoTab from '../components/Tabs/LogoTab.vue';
import ColorTab from '../components/Tabs/ColorTab.vue';
import OrderTab from '../components/Tabs/OrderTab.vue';
import { World } from '../world/world';
import { StyleManager, fontOptions } from '../utils/StyleManager';
import _ from 'lodash';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import TabButton from '../section/TabButton.vue';

// Props
const props = defineProps({
  categoryId: {
    type: String,
    required: true
  }
});

// 状态定义
const route = useRoute();
const router = useRouter();
const glCanvas = ref(null);
const currentTab = ref('text');
const categoryName = ref('Basketball');

// 数据定义
const colors = ref([
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' }
]);

// 3D世界相关
let world = null;

// 设计相关数据
const texts = ref([]);
const logos = ref([]);
const jerseyParts = ref([]);
const players = ref([{
  name: '',
  number: '',
  size: ''
}]);

// 当前编辑状态
const editingElement = ref({});
provide('editingElement', editingElement);

// 样式相关
const jerseyStyles = [
  { name: 'Striker', image: '/images/1.png', svg: '/texture/style/style3.svg' },
  { name: 'Codex', image: '/images/2.png', svg: '/texture/style/style1.svg' },
  { name: 'Maverick', image: '/images/3.png', svg: '/texture/style/style4.svg' },
  { name: 'Fusion', image: '/images/4.png', svg: '/texture/style/style2.svg' },
];
const selectedStyle = ref(jerseyStyles[1]);

let mainSvgEle = null;
const styleManager = new StyleManager();

const getDataForRender = async () => {
  const { categoryId } = route.params;
  if(!categoryId) return;
  const data = await fetch(`/dataset/${categoryId}.json`)
    .then((res) => res.json());
  return data;
}

const setTab = (tab) => {
  currentTab.value = tab;
  // isPanelExpanded.value = true;
};

// SVG相关方法
const initVarFromTexture = async (jersy) => {
  const svgText = await fetch(jersy.svg).then((res) => res.text());
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
  colors.value = color;

  // 获取图片列表
  const imageList = styleManager.getFontList(window.world.svgEditor.svgCanvas.svgroot);
  logos.value = imageList;

  // 获取文字列表
  const textList = styleManager.getTextList(window.world.svgEditor.svgCanvas.svgroot);
  texts.value = textList;
};

// 订单相关方法
const addPlayer = () => {
  players.value.push({
    name: '',
    number: '',
    size: '',
  });
}
const removePlayer = (index) => {
 players.value.splice(index, 1); 
}
const previewPlayer = (index) => {
  
}

// 文本相关方法
const addText = () => {
  const defaultFont = 'NotoSans';
  const newTextOptions = {
    content: 'NEW NAME',
    fontType: defaultFont,
    fontFile: fontOptions.find(v => v.fontType === defaultFont).fontFile,
    fontSize: 100,
    borders: [
      { type: 'outside', color: '#000000', strokeWidth: 16 },
      { type: 'middle', color: '#ffffff', strokeWidth: 12 },
      { type: 'inside', color: '#000000', strokeWidth: 6 },
    ],
  };
  const newTextId = world.svgEditor.svgCanvas.diyAddText(null, 2340, 5020, newTextOptions);
  if (!newTextId) {
    alert('系统出错！！！');
    return;
  }
  newTextOptions.id = newTextId;
  texts.value.unshift(newTextOptions);
};

const removeText = (index) => {
  world.svgEditor.svgCanvas.deleteElementById(texts.value[index].id);
  texts.value.splice(index, 1);
};

// Logo相关方法
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

// 样式相关方法
const selectStyle = async (style) => {
  await initVarFromTexture(style);
  world.mainTextManager.svgToTexture(mainSvgEle.outerHTML);
  selectedStyle.value = style;
};

const setPart = (index, color) => {
  jerseyParts.value[index].color = color;
  styleManager.setColorByType(
    selectedStyle.value.name,
    mainSvgEle,
    jerseyParts.value[index].type,
    color
  );
  world.mainTextManager.svgToTexture(mainSvgEle.outerHTML);
};

// 元素选择相关
const selectElement = (id) => {
  if (window.world) {
    const el = window.world.svgEditor.svgCanvas.getElement(id);
    if (el) {
      window.world.svgEditor.svgCanvas.selectOnly([el], true);
    }
  }
};

const viewSelectionToGui = (elList) => {
  if (!elList || elList.length === 0) {
    editingElement.value = {};
    return;
  }
  const el = elList[0];
  editingElement.value = {
    type: el.nodeName === 'image' ? 'image' : 'text',
    id: el.id
  };
};

// 保存设计
const downloadZIP = () => {
  const mainSvgCtn = document.querySelector('#mainSvgCtn');
  if (!mainSvgCtn) return;
  const zip = new JSZip();

  const svgContent1 = window.world.svgEditor.svgCanvas.getSvgString();
  zip.file("editSvg.svg", svgContent1);

  const svgContent2 = mainSvgCtn.outerHTML;
  zip.file("mainSvg.svg", svgContent2);

  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, "svgs.zip");
  });
};

const saveDesign = () => {
  if (!window.world.svgEditor.svgCanvas) return;
  downloadZIP();
};

// 监听文本变化
const monitorTextChange = _.debounce((newTexts, oldTexts) => {
  if (newTexts.length !== oldTexts.length) return;

  newTexts.forEach((newText, index) => {
    const oldText = oldTexts[index] || {};

    if (newText.content !== oldText.content) {
      world.svgEditor.svgCanvas.updateDiyText(newText.id, 'content', newText);
      return;
    }

    if (newText.fontType !== oldText.fontType) {
      newText.fontFile = fontOptions.find(v => v.fontType === newText.fontType).fontFile;
      world.svgEditor.svgCanvas.updateDiyText(newText.id, 'fontType', newText);
      return;
    }

    if (newText.fontSize !== oldText.fontSize) {
      world.svgEditor.svgCanvas.updateDiyText(newText.id, 'fontSize', newText);
      return;
    }

    newText.borders.forEach((newBorder, borderIndex) => {
      const oldBorder = oldText.borders?.[borderIndex] || {};
      if (newBorder.type !== oldBorder.type ||
        newBorder.color !== oldBorder.color ||
        newBorder.strokeWidth !== oldBorder.strokeWidth) {
        world.svgEditor.svgCanvas.updateDiyText(newText.id, 'borders', newText);
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

// 生命周期钩子
onMounted(async () => {
  const data = await getDataForRender();
  if (data) {
    world = new World(glCanvas.value, data);
    window.world = world;

    world.addEventListener('load_editSvg', () => {
      initVarFromTexture(selectedStyle.value);
      world.svgEditor.svgCanvas.bind('delete', (e, target) => {
        const { id, type } = target;
        if (type === 'text') {
          const i = texts.value.findIndex(v => v.id === id);
          texts.value.splice(i, 1);
        }
        if (type === 'image') {
          const i = logos.value.findIndex(v => v.id === id);
          logos.value.splice(i, 1);
        }
      });
      world.svgEditor.svgCanvas.bind('selected', (e, target) => {
        viewSelectionToGui(target);
      });
    });
  }
});

// 撤销操作
const cancelEdit = () => {
  if(world && world.svgEditor.svgCanvas) {
    world.svgEditor.svgCanvas.undoMgr.undo();
  }
};

// 重做操作
const restoreCancel = () => {
  if(world && world.svgEditor.svgCanvas) {
    world.svgEditor.svgCanvas.undoMgr.redo();
  }
};
</script>

<style scoped>
#svgCtn,
#mainSvgCtn {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0;
  z-index: -1;
}

/* 自定义滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.border-container {
  @apply bg-darker border border-solid border-dark rounded-md;
}

/* 添加按钮悬停效果 */
.group:hover {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}

/* 添加按钮激活效果 */
.group:active {
  transform: scale(0.95);
}
</style>