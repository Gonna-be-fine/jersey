<template>
  <div class="design-container">
    <div class="overflow-y-auto text-gray-600">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 h-full gap-6">
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

          <!-- 修改服装类型选择tabs -->
          <div class="absolute  right-4 top-4">
            <div class="flex bg-dark rounded-full">
              <button 
                @click="switchClothType('jersey')"
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  clothType === 'jersey' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                ]"
                :disabled="!enabledTypes.includes('jersey')"
                :title="enabledTypes.includes('jersey') ? '上衣' : '无同款类型'"
              >
                <svg fill="currentColor" width="50%" height="50%" class="text-lg" :class="{'opacity-50': !enabledTypes.includes('jersey')}" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3811"><path d="M716.9 112H608.4a4 4 0 0 0-4 3.8c-2 49.1-42.6 88.2-92.4 88.2s-90.5-39.1-92.5-88.2a4 4 0 0 0-4-3.8H311.4c-1.6 0-151.7 120.1-209.3 166.2a40 40 0 0 0-12.7 44.6l66.1 187a40 40 0 0 0 59.7 20.1l49.9-32.9v375a40 40 0 0 0 40 40h413.7a40 40 0 0 0 40-40V497l49.9 32.9a40 40 0 0 0 59.7-20.1l66.2-187.3a40.1 40.1 0 0 0-12.4-44.3C865.7 232 718.5 112 716.9 112z" p-id="3812"></path></svg>
              </button>

              <button 
                @click="switchClothType('pant')"
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  clothType === 'pant' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                ]"
                :disabled="!enabledTypes.includes('pant')"
                :title="enabledTypes.includes('pant') ? '裤子' : '无同款类型'"
              >
                <svg width="50%" height="50%" class="text-lg" :class="{'opacity-50': !enabledTypes.includes('jersey')}" t="1740807255007" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4709" ><path d="M750.933333 218.453333l-34.133333-167.253333v-34.133333c0-10.24-6.826667-17.066667-17.066667-17.066667H614.4v47.786667c0 10.24-6.826667 17.066667-17.066667 17.066666s-17.066667-6.826667-17.066666-17.066666V0h-136.533334v47.786667c0 10.24-6.826667 17.066667-17.066666 17.066666s-17.066667-6.826667-17.066667-17.066666V0H324.266667c-3.413333 0-10.24 3.413333-13.653334 3.413333S307.2 13.653333 307.2 17.066667v30.72l-34.133333 170.666666v3.413334l34.133333 785.066666c0 10.24 6.826667 17.066667 17.066667 17.066667h136.533333c10.24 0 17.066667-6.826667 17.066667-17.066667l34.133333-512 34.133333 512c0 10.24 6.826667 17.066667 17.066667 17.066667h136.533333c10.24 0 17.066667-6.826667 17.066667-17.066667l34.133333-785.066666v-3.413334z" fill="currentColor" p-id="4710" ></path></svg>
              </button>

              <button 
                @click="switchClothType('suit')"
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  clothType === 'suit' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                ]"
                :disabled="!enabledTypes.includes('suit')"
                :title="enabledTypes.includes('suit') ? '套装' : '无同款类型'"
              >
              <svg fill="currentColor" width="50%" height="50%" class="text-lg" :class="{'opacity-50': !enabledTypes.includes('suit')}" 
               viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9909"><path d="M553.6512 591.3856h-21.8112v41.0368q0 7.6288-7.6288 7.6288-7.68 0-7.68-7.6288V591.36l-126.7712-0.0512q0.384 44.7488-25.6 76.3648-27.648 33.6896-73.2928 42.5216l9.8048-25.0368q29.2608-8.2432 51.456-30.8224 20.736-21.1456 20.3776-63.0272h-53.8368c-2.304 7.0912-4.5056 13.824-6.0928 19.712L234.0352 900.608a4.992 4.992 0 0 0 3.584 6.144l245.9392 62.0032a4.992 4.992 0 0 0 6.144-3.8912l23.6032-120.576 24.6272 120.6272a4.992 4.992 0 0 0 6.0672 3.84l246.0672-61.8752a4.992 4.992 0 0 0 3.584-6.1696l-78.5408-289.6128c-1.5872-5.888-3.7632-12.5952-6.0928-19.712H655.616q-0.3328 41.8304 20.3776 62.9504 22.1696 22.5792 51.456 30.8224l6.144 25.0368q-41.984-8.832-69.632-42.496-25.9584-31.616-25.6-76.288l-69.4272-0.0512v100.48q0 7.6288-7.6288 7.6288-7.6544 0-7.6544-7.6288v-100.48z" p-id="9910"></path><path d="M844.8 240.64L749.7216 332.8l-47.5392-46.08 0.9472 276.48H320.8704l0.9472-276.48-47.5392 46.08L179.2 240.64 321.8176 102.4h47.5648c18.9952 53.9136 79.3856 92.16 141.6704 92.16 61.7984 0 124.0832-38.2464 143.5648-92.16h47.5648L844.8 240.64z" p-id="9911"></path></svg>
              </button>
            </div>
          </div>

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
          <div class="relative">
            <button v-if="currentTab=='order'"
              @click="setTab('text')"
               class="bookmark bookmarkBg text-white">
              <font-awesome-icon :icon="['fas', 'arrow-left']" class="text-xl" />
            </button>
            <div v-else class="bookmark bookmarkBg text-white text-center">
              上衣
            </div>
            <button class="absolute right-4 top-[1.5rem] h-10 text-white" title="订单"
             @click="() => setTab('order')" >
              <font-awesome-icon :icon="['fas', 'cart-plus']" class="text-2xl" />
              订单
            </button>
          </div>
          <div class="flex items-center justify-between px-5 mt-4" v-if="currentTab !== 'order'">
            <button class="" title="切换" :disabled="clothType !== 'suit'">
              <font-awesome-icon :icon="['fas', 'backward']" class="text-xl text-white" />
            </button>
            <div class="flex items-center justify-between w-[60%]">
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
              <!-- <TabButton 
                title="Submit An Order" 
                type="订单"
                :active="currentTab === 'order'" 
                :icon="['fas', 'cart-plus']"
                @click="() => setTab('order')" 
              /> -->
            </div>
            <button class="" title="切换" :disabled="clothType !== 'suit'">
              <font-awesome-icon :icon="['fas', 'forward']" class="text-xl text-white" />
            </button>
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
    <canvas id="pantCtn" class="svgCtn"></canvas>
    <canvas id="jerseyCtn" class="svgCtn"></canvas>
    <div id="mainSvgCtn" style="pointer-events: none;"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, provide, onBeforeUnmount } from 'vue';
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
  productId: {
    type: String,
    required: true
  }
});

const currentProduct = ref(null);
// 添加服装类型状态
const clothType = ref('jersey'); // 默认选中上衣
const enabledTypes = ref(['jersey', 'suit']); // 示例：只启用上衣和套装
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
  const { productId } = route.params;
  if(!productId) return;
  const data = await fetch(`/dataset/${productId}.json`)
    .then((res) => res.json());
  return data;
}

const setTab = (tab) => {
  currentTab.value = tab;
  // isPanelExpanded.value = true;
};

// SVG相关方法
const initVarFromTexture = async (jersey) => {
  return;
  const svgText = await fetch(jersey.svg).then((res) => res.text());
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
  mainSvgEle = svgDoc.documentElement;
  const mainSvgCtn = document.querySelector('#mainSvgCtn');
  while (mainSvgCtn.firstChild) {
    mainSvgCtn.removeChild(mainSvgCtn.firstChild);
  }
  mainSvgCtn.appendChild(mainSvgEle);

  // 获取颜色列表
  const { styles, color } = styleManager.getColorByType(jersey.name, mainSvgEle);
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
  console.log(data);
  currentProduct.value = data;
  clothType.value = data.clothType;
  enabledTypes.value = data.clothType === 'suit' ? ['suit', 'jersey', 'pant'] : [data.clothType];
  if (data) {
    world = new World(glCanvas.value, data.scene);
    window.world = world;

    world.addEventListener('load_editSvg', (type) => {
      initVarFromTexture(selectedStyle.value);
      const svgCanvas = world.resource[type].svgEditor.svgCanvas;
      svgCanvas.bind('delete', (e, target) => {
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
      svgCanvas.bind('selected', (e, target) => {
        viewSelectionToGui(target);
      });
    });
  }
});

onBeforeUnmount(() => {
  if (world) {
    world.destroy();
    world = null;
    window.world = null;
  }
})

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

// 切换服装类型
const switchClothType = (type) => {
  if (enabledTypes.value.includes(type)) {
    clothType.value = type;
    world.switchClothType(type);
  }
};

</script>

<style scoped>
.design-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.svgCtn,
#mainSvgCtn {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 1;
  z-index: 99;
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

/* 添加禁用状态的样式 */
button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.bookmark {
  width: 8rem;
  height: 2rem;
  margin: 1.5rem 0 0.5rem -0.2rem;
  line-height: 2rem;
}
.bookmarkBg {
  background: url('/images/assets/1.svg');
  background-size: 100% 100%;
}
</style>