<template>
  <div class="design-container bg-darker">
    <div class="overflow-y-auto text-gray-600">
      <div class=" mx-auto grid grid-cols-1 lg:grid-cols-12 h-full gap-6">
        <!-- <div ref="glCanvas" class="w-full h-full absolute top-0 left-0 z-10"></div> -->
        <div id="edit-container" class="relative w-full h-[50vh] md:h-[70vh] lg:h-full lg:col-span-8 z-49 border-container">
          <!-- 返回按钮 - 放在顶部 -->
          <button
            @click="router.back()"
            class="z-[49] absolute left-4 top-4 w-10 h-10 rounded-full bg-dark hover:bg-darker 
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
          <div class="z-[49] absolute right-4 top-4">
            <div class="inline-grid grid-cols-2 gap-0 bg-dark rounded-full">
              <button
                @click="switch2_3D('2D')"
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  editType === '2D' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-400 hover:text-gray-100'
                ]"
                title="切换2D模式"
              >
                <svg t="1750953950619" width="50%" height="50%" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8412" xmlns:xlink="http://www.w3.org/1999/xlink" ><path d="M1019.815253 635.448889c-7.168 23.381333-20.48 42.268444-35.84 57.856a320.739556 320.739556 0 0 1-51.143111 41.130667c-73.671111 47.843556-158.606222 74.467556-234.382222 92.273777a1189.546667 1189.546667 0 0 1-91.079111 15.587556v-119.011556c23.552 0 50.119111 0 77.767111-2.218666 70.599111-4.437333 152.519111-15.587556 221.070222-43.349334 33.792-14.449778 65.536-33.393778 78.848-58.936889a55.239111 55.239111 0 0 0 5.12-40.049777 112.753778 112.753778 0 0 0-19.512889-36.693334 255.772444 255.772444 0 0 0-48.071111-44.487111c-13.312-8.817778-20.48-13.312-20.48-13.312s8.192 2.218667 22.528 8.931556c14.336 6.656 35.84 15.530667 58.311111 34.474666 11.264 8.817778 23.552 21.105778 32.768 42.211556 9.216 17.806222 11.264 43.406222 4.096 65.592889z m-366.193777-102.684445h-117.76V121.799111h113.322666c126.122667 0 204.288 64.967111 204.288 203.776 0 138.296889-78.165333 207.189333-199.850666 207.189333z m-9.443556-345.429333h-25.713778v279.324445h25.713778c76.970667 0 124.984889-41.073778 124.984889-141.084445 0-100.465778-48.014222-138.24-124.984889-138.24zM397.564587 838.940444c-24.064-3.527111-47.900444-7.964444-71.623111-13.312-75.776-17.749333-160.711111-44.487111-234.382223-92.273777a269.312 269.312 0 0 1-50.176-41.130667c-15.416889-16.725333-29.696-35.612444-36.864-57.856A95.175111 95.175111 0 0 1 7.591253 568.775111c8.248889-17.806222 20.48-30.037333 31.687111-40.049778 23.552-18.887111 44.088889-27.818667 58.424889-34.474666a157.013333 157.013333 0 0 1 22.471111-8.874667s-8.192 4.437333-20.48 13.312c-13.255111 10.012444-31.744 23.381333-48.071111 44.544-8.192 9.955556-15.36 23.267556-18.432 36.636444a49.607111 49.607111 0 0 0 5.063111 40.049778c14.392889 24.405333 46.136889 44.487111 79.872 57.799111 68.551111 27.818667 150.414222 37.831111 221.070223 42.268445 20.48 1.137778 39.822222 2.218667 58.254222 2.275555V661.048889l133.176889 124.529778-133.063111 124.586666v-71.224889z m-217.315556-353.393777c112.184889-99.953778 178.574222-177.152 178.574222-240.469334 0-41.642667-22.869333-66.673778-61.952-66.673777-30.151111 0-55.239111 19.456-75.889777 42.211555l-44.657778-44.430222c37.944889-39.992889 74.808889-62.179556 131.185778-62.179556 78.108444 0 130.048 49.948444 130.048 126.634667 0 74.410667-61.952 154.396444-137.329778 227.669333 20.650667-2.218667 48.014222-4.437333 67.015111-4.437333h89.827555v68.892444H180.249031v-47.217777z" fill="#e6e6e6" p-id="8413"></path></svg>
              </button>
              <button
                @click="switch2_3D('3D')"
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  editType === '3D'
                    ? 'bg-primary text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                ]"
                title="切换3D模式"
              >
                <svg t="1750954137343" width="50%" height="50%" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20898" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M1019.953493 635.448889c-7.168 23.381333-20.48 42.268444-35.84 57.856-15.36 15.530667-32.711111 28.842667-51.143111 41.130667-73.671111 47.843556-158.663111 74.467556-234.382222 92.273777a1189.546667 1189.546667 0 0 1-91.079111 15.587556v-119.011556c23.552 0 50.119111 0 77.767111-2.218666 70.599111-4.437333 152.519111-15.587556 221.127111-43.349334 33.735111-14.449778 65.479111-33.393778 78.791111-58.936889a54.954667 54.954667 0 0 0 5.12-40.049777 111.843556 111.843556 0 0 0-19.569778-36.693334 255.431111 255.431111 0 0 0-48.014222-44.487111c-13.312-8.817778-20.48-13.312-20.48-13.312s8.192 2.218667 22.528 8.931556c14.336 6.656 35.84 15.530667 58.311111 34.474666 11.264 8.817778 23.552 21.105778 32.768 42.211556 9.216 17.806222 11.264 43.406222 4.096 65.592889z m-366.193777-102.684445h-117.76V121.799111h113.322666c126.122667 0 204.288 64.967111 204.288 203.776 0 138.296889-78.165333 207.189333-199.850666 207.189333z m-9.500445-345.429333h-25.656889v279.324445h25.656889c77.084444 0 125.041778-41.073778 125.041778-141.084445 0-100.465778-47.957333-138.24-125.041778-138.24zM397.702827 838.940444c-24.064-3.527111-47.957333-7.964444-71.68-13.312-75.719111-17.749333-160.711111-44.487111-234.382223-92.273777a270.791111 270.791111 0 0 1-50.119111-41.130667c-15.416889-16.725333-29.696-35.612444-36.864-57.856a94.833778 94.833778 0 0 1 3.128889-65.592889c8.135111-17.806222 20.423111-30.037333 31.687111-40.049778 23.495111-18.887111 44.032-27.818667 58.368-34.474666a157.013333 157.013333 0 0 1 22.471111-8.874667s-8.192 4.437333-20.48 13.312c-13.255111 10.012444-31.744 23.381333-48.071111 44.544a92.273778 92.273778 0 0 0-18.488889 36.636444 50.062222 50.062222 0 0 0 5.12 40.049778c14.336 24.405333 46.08 44.487111 79.815112 57.799111 68.608 27.818667 150.471111 37.831111 221.127111 42.268445 20.48 1.137778 39.879111 2.275556 58.311111 2.275555V661.048889l133.063111 124.529778-133.006222 124.586666v-71.224889z m56.718222-417.792c0 75.491556-66.389333 119.352889-145.123556 119.352889-65.308444 0-109.397333-24.405333-138.410666-57.173333l38.513777-51.655111c24.576 23.893333 54.670222 42.211556 92.103112 42.211555 41.870222 0 70.314667-20.536889 70.314666-57.230222 0-40.504889-24.007111-65.479111-113.891555-65.479111V292.295111c75.946667 0 100.465778-26.112 100.465777-62.748444 0-32.256-20.081778-51.143111-55.239111-51.655111-29.582222 0.512-53.589333 14.392889-78.165333 36.636444l-41.813333-50.005333c35.669333-31.061333 75.320889-50.517333 123.904-50.517334 79.815111 0 133.973333 38.855111 133.973333 109.397334 0 44.430222-25.088 76.629333-69.233778 93.866666v2.787556c46.876444 12.743111 82.602667 47.217778 82.602667 101.091555z" fill="#e6e6e6" p-id="20899"></path></svg>
              </button>
            </div>
            <div class="mt-4 flex bg-dark rounded-full">
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
                <svg
                  fill="currentColor"
                  width="50%"
                  height="50%"
                  class="text-lg"
                  :class="{'opacity-50': !enabledTypes.includes('jersey')}"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3811"
                >
                  <path
                    d="M716.9 112H608.4a4 4 0 0 0-4 3.8c-2 49.1-42.6 88.2-92.4 88.2s-90.5-39.1-92.5-88.2a4 4 0 0 0-4-3.8H311.4c-1.6 0-151.7 120.1-209.3 166.2a40 40 0 0 0-12.7 44.6l66.1 187a40 40 0 0 0 59.7 20.1l49.9-32.9v375a40 40 0 0 0 40 40h413.7a40 40 0 0 0 40-40V497l49.9 32.9a40 40 0 0 0 59.7-20.1l66.2-187.3a40.1 40.1 0 0 0-12.4-44.3C865.7 232 718.5 112 716.9 112z"
                    p-id="3812"
                  ></path>
                </svg>
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
                <svg
                  width="50%"
                  height="50%"
                  class="text-lg"
                  :class="{'opacity-50': !enabledTypes.includes('jersey')}"
                  t="1740807255007"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4709"
                >
                  <path
                    d="M750.933333 218.453333l-34.133333-167.253333v-34.133333c0-10.24-6.826667-17.066667-17.066667-17.066667H614.4v47.786667c0 10.24-6.826667 17.066667-17.066667 17.066666s-17.066667-6.826667-17.066666-17.066666V0h-136.533334v47.786667c0 10.24-6.826667 17.066667-17.066666 17.066666s-17.066667-6.826667-17.066667-17.066666V0H324.266667c-3.413333 0-10.24 3.413333-13.653334 3.413333S307.2 13.653333 307.2 17.066667v30.72l-34.133333 170.666666v3.413334l34.133333 785.066666c0 10.24 6.826667 17.066667 17.066667 17.066667h136.533333c10.24 0 17.066667-6.826667 17.066667-17.066667l34.133333-512 34.133333 512c0 10.24 6.826667 17.066667 17.066667 17.066667h136.533333c10.24 0 17.066667-6.826667 17.066667-17.066667l34.133333-785.066666v-3.413334z"
                    fill="currentColor"
                    p-id="4710"
                  ></path>
                </svg>
              </button>

              <button
                v-if="editType === '3D'"
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
                <svg
                  fill="currentColor"
                  width="50%"
                  height="50%"
                  class="text-lg"
                  :class="{'opacity-50': !enabledTypes.includes('suit')}"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="9909"
                >
                  <path
                    d="M553.6512 591.3856h-21.8112v41.0368q0 7.6288-7.6288 7.6288-7.68 0-7.68-7.6288V591.36l-126.7712-0.0512q0.384 44.7488-25.6 76.3648-27.648 33.6896-73.2928 42.5216l9.8048-25.0368q29.2608-8.2432 51.456-30.8224 20.736-21.1456 20.3776-63.0272h-53.8368c-2.304 7.0912-4.5056 13.824-6.0928 19.712L234.0352 900.608a4.992 4.992 0 0 0 3.584 6.144l245.9392 62.0032a4.992 4.992 0 0 0 6.144-3.8912l23.6032-120.576 24.6272 120.6272a4.992 4.992 0 0 0 6.0672 3.84l246.0672-61.8752a4.992 4.992 0 0 0 3.584-6.1696l-78.5408-289.6128c-1.5872-5.888-3.7632-12.5952-6.0928-19.712H655.616q-0.3328 41.8304 20.3776 62.9504 22.1696 22.5792 51.456 30.8224l6.144 25.0368q-41.984-8.832-69.632-42.496-25.9584-31.616-25.6-76.288l-69.4272-0.0512v100.48q0 7.6288-7.6288 7.6288-7.6544 0-7.6544-7.6288v-100.48z"
                    p-id="9910"
                  ></path>
                  <path
                    d="M844.8 240.64L749.7216 332.8l-47.5392-46.08 0.9472 276.48H320.8704l0.9472-276.48-47.5392 46.08L179.2 240.64 321.8176 102.4h47.5648c18.9952 53.9136 79.3856 92.16 141.6704 92.16 61.7984 0 124.0832-38.2464 143.5648-92.16h47.5648L844.8 240.64z"
                    p-id="9911"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <div
            ref="glCanvas"
            class="w-full h-full"
          ></div>

          <!-- 编辑操作按钮 - 放在中间 -->
          <div class="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
            <!-- 撤销按钮 -->
            <!-- <button
              @click="cancelEdit"
              class="w-10 h-10 rounded-full bg-dark hover:bg-darker transition-colors duration-300 
                     flex items-center justify-center text-white shadow-lg group"
              title="撤销"
            >
              <font-awesome-icon
                :icon="['fas', 'undo']"
                class="group-hover:scale-110 transition-transform duration-300"
              />
            </button> -->

            <!-- 重做按钮 -->
            <!-- <button
              @click="restoreCancel"
              class="w-10 h-10 rounded-full bg-dark hover:bg-darker transition-colors duration-300 
                     flex items-center justify-center text-white shadow-lg group"
              title="重做"
            >
              <font-awesome-icon
                :icon="['fas', 'redo']"
                class="group-hover:scale-110 transition-transform duration-300"
              />
            </button> -->

            <button
              @click="saveDesign"
              class="w-10 h-10 rounded-full bg-dark hover:bg-darker transition-colors duration-300 
                     flex items-center justify-center text-white shadow-lg group"
              title="下载"
            >
              <font-awesome-icon
                :icon="['fas', 'download']"
                class="group-hover:scale-110 transition-transform duration-300"
              />
            </button>
          </div>

          <div class="absolute right-10 bottom-10">
            <RotateMovePanel />
          </div>
        </div>
        <!-- 设计工具区域 -->
        <div class="lg:h-screen md:h-[70vh] lg:col-span-4 flex flex-col border-container">
          <div class="relative">
            <button
              v-if="currentTab=='order'"
              @click="setTab('text')"
              class="bookmark bookmarkBg text-white"
            >
              <font-awesome-icon
                :icon="['fas', 'arrow-left']"
                class="text-xl"
              />
            </button>
            <div
              v-else
              class="bookmark bookmarkBg text-white text-center"
            >
              {{modelType === 'jersey' ? '上衣' : '裤子'}}
            </div>
            <button
              class="absolute right-4 top-[1.5rem] h-10 text-white"
              title="订单"
              @click="() => setTab('order')"
            >
              <font-awesome-icon
                :icon="['fas', 'cart-plus']"
                class="text-2xl"
              />
              订单
            </button>
          </div>
          <div
            class="flex items-center justify-center px-5 mt-4"
            v-if="currentTab !== 'order'"
          >
            <!-- <button
              class=""
              title="切换"
              :disabled="currentProduct && currentProduct.clothType !== 'suit'"
            >
              <font-awesome-icon
                :icon="['fas', 'backward']"
                class="text-xl text-white"
              />
            </button> -->
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
            <!-- <button
              class=""
              title="切换"
              :disabled="currentProduct && currentProduct.clothType !== 'suit'"
              @click="switchClothType('suit')"
            >
              <font-awesome-icon
                :icon="['fas', 'forward']"
                class="text-xl text-white"
              />
            </button> -->
          </div>
          <div
            v-if="currentRenderData"
            class="flex-1 overflow-y-auto pt-2 px-8 pb-6 text-gray-400 text-sm"
          >
            <TextTab
              v-if="currentTab === 'text'"
              :texts="currentRenderData.texts"
              @addText="addText"
              @removeText="removeText"
              @selectElement="selectElement"
              @updateFontFamily="updateFontFamily"
              @curveToggled="handleCurveToggled"
            />
            <LogoTab
              v-if="currentTab === 'logo'"
              :logos="currentRenderData.logos"
              @selectElement="selectElement"
              @uploadLogo="uploadLogo"
              @removeLogo="removeLogo"
            />
            <ColorTab
              v-if="currentTab === 'color'"
              :jerseyParts="currentRenderData.colors"
              :colors="colors"
              @setColor="setColor"
            />
            <OrderTab
              v-if="currentTab === 'order'"
              :players="players"
              @addPlayer="addPlayer"
              @removePlayer="removePlayer"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="svgCtn">
      <canvas id="pantCtn"></canvas>
    </div>
    <div class="svgCtn">
      <canvas id="jerseyCtn"></canvas>
    </div>
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
import { downloadJSON } from '../utils/util.js'
import TabButton from '../components/common/TabButton.vue';
import RotateMovePanel from '../components/DashBoard/RotateMovePanel.vue';
import { ColorList, DefaultTextItem } from '../configs';

// Props
const props = defineProps({
  productId: {
    type: String,
    required: true
  }
});

const currentProduct = ref(null);
const editType = ref('3D');
// 添加服装类型状态
const clothType = ref('jersey'); // 默认选中上衣
const modelType = ref('jersey'); // 默认选中上衣
const enabledTypes = ref(['jersey', 'suit']); // 示例：只启用上衣和套装
// 状态定义
const route = useRoute();
const router = useRouter();
const glCanvas = ref(null);
const currentTab = ref('text');
const categoryName = ref('Basketball');

// 数据定义
const colors = ref(ColorList);

// 3D世界相关
let world = null;
// 设计相关数据
const renderData = ref(null);
const currentRenderData = ref({
  texts: [],
  logos: [],
});
const players = ref([{
  name: '',
  number: '',
  size: ''
}]);

// 当前编辑状态
const editingElement = ref({});
provide('editingElement', editingElement);
provide('modelType', modelType);

let mainSvgEle = null;
const styleManager = new StyleManager();

const getDataForRender = async () => {
  const { productId } = route.params;
  if (!productId) return;
  const data = await fetch(`/dataset/${productId}.json`)
    .then((res) => res.json());
  return data;
}

const setTab = (tab) => {
  currentTab.value = tab;
  // isPanelExpanded.value = true;
};

// SVG相关方法
const initVarFromTexture = async (data) => {
  renderData.value = styleManager.getRenderFromJson(data);
  setCurrentRenderData();
};

function setCurrentRenderData () {
  currentRenderData.value = renderData.value.find(v => v.type === modelType.value);
}
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
  const newTextOptions = JSON.parse(JSON.stringify(DefaultTextItem));
  const newText = world.getSvgEditorByType(modelType.value)._addText(newTextOptions);
  if (!newText) {
    alert('系统出错！！！');
    return;
  }
  newTextOptions.id = newText.id;
  currentRenderData.value.texts.unshift(newTextOptions);
};

const removeText = (index) => {
  world.getSvgEditorByType(modelType.value).removeObjectById(currentRenderData.value.texts[index].id);
  currentRenderData.value.texts.splice(index, 1);
};
// 监听文本变化
const monitorTextChange = _.debounce((newTexts, oldTexts) => {
  if (newTexts.length !== oldTexts.length) return;

  newTexts.forEach((newText, index) => {
    const oldText = oldTexts[index];
    if(oldText.isExpanded !== newText.isExpanded) return;
    if(oldText.fontFamily !== newText.fontFamily) return;
    if(oldText.isCurved !== newText.isCurved) {
      return;
    }
    if(_.isEqual(newText, oldText)) return;
    world.getSvgEditorByType(modelType.value).updateText(newText.id, newText);
  });
}, 200);
const updateFontFamily = (index, fontType) => {
  const newText = currentRenderData.value.texts[index];
  world.getSvgEditorByType(modelType.value).updateText(newText.id, { fontFamily: fontType });
}
const handleCurveToggled = (options) => {
  console.log(options);
  world.getSvgEditorByType(modelType.value).setNewText(options.id, options);
}
watch(
  () => _.cloneDeep(currentRenderData.value.texts),
  (newTexts, oldTexts) => {
    monitorTextChange(newTexts, oldTexts);
  },
  { deep: true, immediate: false }
);

// 切换2D/3D
const switch2_3D = (type) => {
  editType.value = type;
  const editor = world.getSvgEditorByType(modelType.value);
  if(!editor) return;
  // 先隐藏所有fabric元素
  for(let key in world.resource) {
    world.resource[key].fabricEditor.canvas.getElement().parentNode.parentNode.style = '';
  }
  const parentElement = editor.canvas.getElement().parentNode.parentNode;
  if (type === '2D') {
    if (clothType.value === 'suit') {
      clothType.value = modelType.value;
    }
    const pb = parentElement.getBoundingClientRect();
    const cb = document.getElementById('edit-container').getBoundingClientRect();
    // 先计算scale，然后设置位置
    let scale = cb.width > cb.height ? cb.height / pb.height : cb.width / pb.width;
    scale = scale > 1 ? 1/scale : scale - 0.01;
    let left = cb.width > cb.height ? (cb.width / 2 - pb.width / (2 / scale)) : 0;
    let top = cb.width > cb.height ? 0 : (cb.height / 2 - pb.height / (2 / scale));
    parentElement.style = `
      left: ${left}px;
      top: ${top}px;
      transform-origin: left top;
      z-index: 48;
      transform: scale(${scale});
    `
    world.glDom.style = 'display: none;';
  } else {
    parentElement.style = '';
    world.glDom.style = 'display: block;';
  }
}

// Logo相关方法
const uploadLogo = async (url) => {
  const imgObj = await world.getSvgEditorByType(modelType.value).addLogo(url);
  console.log(imgObj)
  currentRenderData.value.logos.unshift({ id: imgObj.id, url });
};
const removeLogo = (index) => {
  const logo = currentRenderData.value.logos[index];
  world.getSvgEditorByType(modelType.value).removeObjectById(logo.id);
  currentRenderData.value.logos.splice(index, 1);
};


const setColor = (index, color) => {
  const curItem = currentRenderData.value.colors[index];
  if (!curItem) return;
  curItem.color = color;
  // TODO: 更新颜色
  world.getSvgEditorByType(modelType.value).setColor(curItem.id, color);
};

// 元素选择相关
const selectElement = (id) => {
  if (window.world) {
    const obj = world.getSvgEditorByType(modelType.value).selectObjectById(id);
    // fit to object
    if (obj) {
      const isFrontSide = obj.left + obj.width / 2 > world.getSvgEditorByType(modelType.value).canvas.width / 2;
      world.switchClothType(modelType.value, isFrontSide ? 'front' : 'back');
    }
  }
};

const viewSelectionToGui = (selected) => {
  editingElement.value = {
    type: selected.type,
    id: selected.id
  };
};

const saveDesign = async () => {
  if (!window.world) return;
  const data = currentProduct.value;

  const zip = new JSZip();
  data.scene.model.forEach(v => {
    v.texture.main = world.getSvgEditorByType(v.type).getJson();
  });
  // downloadJSON(data);
  zip.file(data.id + '.json', JSON.stringify(data));
  for(const key in world.resource) {
    const design = world.resource[key];
    const fabricJson = await design.fabricEditor.toSVG(`${data.id}.svg`, 1, { isDownload: false });
    zip.file(`${data.id}_${key}.svg`, fabricJson);
  }
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, `${data.id}.zip`);
  });
};

// 生命周期钩子
onMounted(async () => {
  const data = await getDataForRender();
  if (!data) return;
  console.log(data);
  currentProduct.value = data;
  clothType.value = data.clothType;
  modelType.value = data.clothType === 'suit' ? 'jersey' : data.clothType;;
  enabledTypes.value = data.clothType === 'suit' ? ['suit', 'jersey', 'pant'] : [data.clothType];

  initVarFromTexture(currentProduct.value);

  world = new World(glCanvas.value, data.scene);
  window.world = world;

  world.addEventListener('model_loaded', () => {
    for (let key in world.resource) {
      const editor = world.getSvgEditorByType(key);
      editor.canvas.on('selection:created', (e) => {
        viewSelectionToGui(e.selected[0]);
      });
      editor.canvas.on('selection:updated', (e) => {
        viewSelectionToGui(e.selected[0]);
      });
    }
  });
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
  if (world && world.svgEditor.svgCanvas) {
    world.svgEditor.svgCanvas.undoMgr.undo();
  }
};

// 重做操作
const restoreCancel = () => {
  if (world && world.svgEditor.svgCanvas) {
    world.svgEditor.svgCanvas.undoMgr.redo();
  }
};

// 切换服装类型
const switchClothType = (type) => {
  if (enabledTypes.value.includes(type)) {
    clothType.value = type;
    if(type !== 'suit') {
      modelType.value = type;
      setCurrentRenderData()
    }
    world.switchClothType(type);
    if (editType.value === '2D') {
      switch2_3D(editType.value);
    }
  }
};

</script>

<style scoped>
.design-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.svgCtn {
  position: absolute;
  top: 0;
  right: 100%;
  opacity: 1;
  z-index: -99;
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
  background: url("/images/assets/1.svg");
  background-size: 100% 100%;
}
</style>