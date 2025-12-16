<template>
  <div class="flex flex-col lg:flex-row min-h-screen bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-100">
    <div class="lg:hidden sticky top-0 bg-white dark:bg-gray-800 z-10 p-3 shadow-md">
      <button
        @click="isMobileFilterOpen = true"
        class="w-full flex justify-center items-center text-primary border border-primary p-2 rounded-lg font-medium"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-5.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          ></path>
        </svg>
        筛选商品
        <span
          v-if="selectedFilters.length > 0"
          class="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white"
        >{{ selectedFilters.length }}</span>
      </button>
    </div>

    <div
      :class="isMobileFilterOpen ? 'fixed inset-0 z-50' : 'hidden lg:block'"
      class="lg:w-64 bg-white dark:bg-gray-800 transition-transform duration-300 transform"
    >
      <div
        v-if="isMobileFilterOpen"
        @click="isMobileFilterOpen = false"
        class="lg:hidden absolute inset-0 bg-black opacity-50"
      ></div>

      <div
        class="w-full h-full lg:w-64 bg-white dark:bg-gray-800 lg:border-r dark:border-gray-700 overflow-y-auto"
        :class="isMobileFilterOpen ? 'absolute right-0 w-3/4 max-w-sm shadow-2xl' : ''"
      >

        <div
          v-if="isMobileFilterOpen"
          class="flex justify-between items-center p-4 border-b dark:border-gray-700"
        >
          <h2 class="text-xl font-bold">筛选</h2>
          <button
            @click="isMobileFilterOpen = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div class="p-4">
          <div :class="{'sticky top-20': !isMobileFilterOpen, 'p-0': isMobileFilterOpen}">
            <!-- 已选择的筛选标签 -->
            <div
              v-if="selectedFilters.length > 0"
              class="p-4 border-b dark:border-gray-700"
            >
              <div class="flex justify-between items-center mb-2">
                <h3 class="text-sm font-medium">已选择：</h3>
                <button
                  @click="clearAllFilters"
                  class="text-sm text-primary hover:text-secondary transition-colors duration-300 flex items-center gap-1"
                >
                  <font-awesome-icon :icon="['fas', 'times']" />
                  清除全部
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="filter in selectedFilters"
                  :key="filter.id"
                  class="inline-flex items-center px-2 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-500"
                >
                  {{ filter.label }}
                  <button
                    @click="removeFilter(filter)"
                    class="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              </div>
            </div>

            <!-- 筛选选项 -->
            <div class="p-4">
              <h2 class="text-lg font-semibold mb-4">筛选</h2>

              <!-- 设计类型筛选 -->
              <div class="mb-4">
                <button
                  @click="toggleFilter('design')"
                  class="w-full flex justify-between items-center font-medium mb-2"
                >
                  <span>设计</span>
                  <svg
                    :class="{'rotate-180': filters.design.isOpen}"
                    class="w-5 h-5 transition-transform duration-200"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  v-show="filters.design.isOpen"
                  class="space-y-2 ml-2"
                >
                  <label
                    v-for="category in SceneCategories"
                    :key="category.id"
                    class="flex items-center"
                  >
                    <input
                      type="checkbox"
                      class="form-checkbox text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
                      :value="category.id"
                      :checked="filters.design.selected.includes(category.id)"
                      @change="updateFilters('design', category.id, category.name)"
                    >
                    <span class="ml-2">{{ category.name }}</span>
                  </label>
                </div>
              </div>

              <!-- 性别筛选 -->
              <div class="mb-4">
                <button
                  @click="toggleFilter('gender')"
                  class="w-full flex justify-between items-center font-medium mb-2"
                >
                  <span>性别</span>
                  <svg
                    :class="{'rotate-180': filters.gender.isOpen}"
                    class="w-5 h-5 transition-transform duration-200"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  v-show="filters.gender.isOpen"
                  class="space-y-2 ml-2"
                >
                  <label
                    v-for="category in GenderCategories"
                    :key="category.id"
                    class="flex items-center"
                  >
                    <input
                      type="checkbox"
                      class="form-checkbox text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
                      :value="category.id"
                      :checked="filters.gender.selected.includes(category.id)"
                      @change="updateFilters('gender', category.id, category.name)"
                    >
                    <span class="ml-2">{{ category.name }}</span>
                  </label>
                </div>
              </div>

              <!-- 在性别筛选后添加服装类型筛选 -->
              <div class="mb-4">
                <button
                  @click="toggleFilter('clothType')"
                  class="w-full flex justify-between items-center font-medium mb-2"
                >
                  <span>服装类型</span>
                  <svg
                    :class="{'rotate-180': filters.clothType.isOpen}"
                    class="w-5 h-5 transition-transform duration-200"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  v-show="filters.clothType.isOpen"
                  class="space-y-2 ml-2"
                >
                  <label
                    v-for="category in ClothCategories"
                    :key="category.id"
                    class="flex items-center"
                  >
                    <input
                      type="checkbox"
                      class="form-checkbox text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
                      :value="category.id"
                      :checked="filters.clothType.selected.includes(category.id)"
                      @change="updateFilters('clothType', category.id, category.name)"
                    >
                    <span class="ml-2">{{ category.name }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="isMobileFilterOpen"
          class="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t dark:border-gray-700 shadow-inner flex justify-end"
        >
          <button
            @click="isMobileFilterOpen = false"
            class="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-secondary transition-colors"
          >
            确认
          </button>
        </div>
      </div>
    </div>
    

    <!-- 右侧商品展示区 -->
    <div class="flex-1 p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          v-for="product in displayedProducts"
          :key="product.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
        >
          <div class="p-3">
            <div
              class="relative w-full h-64 lg:h-96 rounded overflow-hidden bg-gray-100 dark:bg-gray-700"
              @mouseenter="showSecondImage(product.id)"
              @mouseleave="hideSecondImage(product.id)"
            >
              <img
                :src="`${ImagePrex}/${product.images[currentImage[product.id] || 0]}`"
                :alt="product.name"
                class="w-full h-full object-cover transition-opacity duration-300"
              >
            </div>
            <h3 class="mt-4 text-lg font-medium">{{ product.name }}</h3>
            <div class="mt-2 flex justify-between items-center">
              <span class="text-gray-600">￥{{ product.price }}/件</span>
              <span class="text-gray-600">￥{{ product.priceList[2][0]*product.priceList[2][1] }}/7件</span>
            </div>
            <button
              @click="handleCustomize(product)"
              class="bg-primary w-full hover:bg-secondary mt-2 text-white px-2 py-1 rounded transition-colors duration-300"
            >
              自定义
            </button>
            <div
              class="text-center mt-2 border-b dark:border-gray-700 cursor-pointer hover:text-primary transition-colors duration-300"
              @click="viewProduct(product)"
            >
              查看产品
            </div>
          </div>
        </div>
      </div>

      <!-- 分页控件 -->
      <div class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded border"
            :class="currentPage === 1 ? 'text-gray-400 border-gray-200 dark:border-gray-700' : 'text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'"
          >
            上一页
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            class="px-3 py-1 rounded border"
            :class="currentPage === page ? 'bg-primary text-white border-primary' : 'text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'"
          >
            {{ page }}
          </button>

          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded border"
            :class="currentPage === totalPages ? 'text-gray-400 border-gray-200 dark:border-gray-700' : 'text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'"
          >
            下一页
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { SceneCategories, GenderCategories, ClothCategories } from '../configs/clothes';
import { useToast } from '../utils/toast';
import { useMobileDetection } from '@/hook/useMobileDetection';

const ImagePrex = import.meta.env.VITE_CLOTH_PREX;
const router = useRouter();
const route = useRoute();


const isMobile = useMobileDetection();
const isMobileFilterOpen = ref(false);
// 新增 watch 监听：当 isMobile 从 true 变为 false 时，自动关闭弹窗
watch(isMobile, (newIsMobile) => {
  // 如果从小屏切换到大屏，且弹窗是打开的，则关闭弹窗
  if (!newIsMobile && isMobileFilterOpen.value) {
    isMobileFilterOpen.value = false;
  }
});
// 筛选按钮点击事件
const openMobileFilter = () => {
  isMobileFilterOpen.value = true;
};

// 筛选器状态
const filters = ref({
  design: {
    isOpen: true,
    selected: []
  },
  gender: {
    isOpen: true,
    selected: []
  },
  clothType: {
    isOpen: true,
    selected: []
  }
});

// 已选择的筛选项
const selectedFilters = ref([]);

// 默认占位图片
const defaultImage = './images/assets/placeholder.png'; // 确保这个路径存在

// 从URL参数获取筛选状态
const initFiltersFromQuery = () => {
  // 清空现有筛选
  selectedFilters.value = [];
  filters.value.design.selected = [];
  filters.value.gender.selected = [];
  filters.value.clothType.selected = [];

  // 处理设计类型筛选
  const designParam = route.query.design;
  if (designParam) {
    const designIds = designParam.split(',');
    designIds.forEach(id => {
      const category = SceneCategories.find(cat => cat.id === id);
      if (category) {
        filters.value.design.selected.push(id);
        selectedFilters.value.push({
          id: `design-${id}`,
          type: 'design',
          value: id,
          label: category.name
        });
      }
    });
  }

  // 处理性别筛选
  const genderParam = route.query.gender;
  if (genderParam) {
    const genderIds = genderParam.split(',');
    genderIds.forEach(id => {
      const category = GenderCategories.find(cat => cat.id === id);
      if (category) {
        filters.value.gender.selected.push(id);
        selectedFilters.value.push({
          id: `gender-${id}`,
          type: 'gender',
          value: id,
          label: category.name
        });
      }
    });
  }

  // 处理服装类型筛选
  const clothTypeParam = route.query.clothType;
  if (clothTypeParam) {
    const clothTypeIds = clothTypeParam.split(',');
    clothTypeIds.forEach(id => {
      const category = ClothCategories.find(cat => cat.id === id);
      if (category) {
        filters.value.clothType.selected.push(id);
        selectedFilters.value.push({
          id: `clothType-${id}`,
          type: 'clothType',
          value: id,
          label: category.name
        });
      }
    });
  }
};

// 监听路由变化
watch(
  () => route.query,
  () => {
    initFiltersFromQuery();
  },
  { immediate: true } // 立即执行一次
);

// 修改updateFilters函数
const updateFilters = (type, value, label) => {
  const currentSelected = filters.value[type].selected;
  const isSelected = currentSelected.includes(value);

  if (isSelected) {
    // 如果已选中，则移除
    filters.value[type].selected = currentSelected.filter(v => v !== value);
    // 从已选择标签列表中移除
    const index = selectedFilters.value.findIndex(filter => filter.id === `${type}-${value}`);
    if (index !== -1) {
      selectedFilters.value.splice(index, 1);
    }
  } else {
    // 如果未选中，则添加
    filters.value[type].selected.push(value);
    selectedFilters.value.push({
      id: `${type}-${value}`,
      type,
      value,
      label
    });
  }

  // 更新URL参数
  updateQueryParams();
};

// 移除筛选标签
const removeFilter = (filter) => {
  // 更新 checkbox 状态
  filters.value[filter.type].selected = filters.value[filter.type].selected
    .filter(value => value !== filter.value);

  // 移除标签
  const index = selectedFilters.value.findIndex(f => f.id === filter.id);
  if (index !== -1) {
    selectedFilters.value.splice(index, 1);
  }

  // 更新URL参数
  updateQueryParams();
};

// 切换筛选器展开状态
const toggleFilter = (filterName) => {
  filters.value[filterName].isOpen = !filters.value[filterName].isOpen;
};

// 分页相关数据
const currentPage = ref(1);
const pageSize = ref(12); // 每页显示12个商品
const products = ref([]);

// 获取商品数据
const fetchProducts = async () => {
  try {
    const response = await fetch('/dataset/mockdata.json');
    const data = await response.json();

    // 转换数据格式以匹配筛选需求
    products.value = data.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      // 只使用有效的图片URL
      images: item.pictures?.filter(url => url) || [defaultImage],
      designType: item.sportType,
      gender: item.genderType,
      clothType: item.clothType,
      description: item.description,
      isComb: item.isComb,
      relativeId: item.relativeId,
      priceList: item.priceList,
      scene: item.scene
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    useToast().error('获取商品数据失败');
  }
};

// 在组件挂载时获取数据
onMounted(() => {
  fetchProducts();
});

// 计算筛选后的商品
const filteredProducts = computed(() => {
  let result = [...products.value];

  // 应用设计类型筛选
  if (filters.value.design.selected.length > 0) {
    result = result.filter(product =>
      filters.value.design.selected.includes(product.designType)
    );
  }

  // 应用性别筛选
  if (filters.value.gender.selected.length > 0) {
    result = result.filter(product =>
      filters.value.gender.selected.includes(product.gender)
    );
  }

  // 应用服装类型筛选
  if (filters.value.clothType.selected.length > 0) {
    result = result.filter(product =>
      filters.value.clothType.selected.includes(product.clothType)
    );
  }

  return result;
});

// 修改显示的商品列表，使用筛选后的结果
const displayedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredProducts.value.slice(start, end);
});

// 修改总页数计算，使用筛选后的结果
const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / pageSize.value);
});

// 切换页码
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // 可以在这里触发重新获取数据的操作
  }
};

// 处理自定义按钮点击
const handleCustomize = (product) => {
  // 这里的categoryId应该根据实际产品类别来设置
  const id = product.id || 'default';
  router.push({
    name: 'Design',
    params: {
      productId: id
    }
  });
};

// 在script setup中添加方法
const viewProduct = (product) => {
  router.push({
    name: 'ProductDetail',
    params: {
      id: product.id
    }
  });
};

// 更新URL参数
const updateQueryParams = () => {
  const query = { ...route.query }; // 保留其他查询参数

  // 添加设计类型筛选
  const designFilters = filters.value.design.selected;
  if (designFilters.length > 0) {
    query.design = designFilters.join(',');
  } else {
    delete query.design;
  }

  // 添加性别筛选
  const genderFilters = filters.value.gender.selected;
  if (genderFilters.length > 0) {
    query.gender = genderFilters.join(',');
  } else {
    delete query.gender;
  }

  // 添加服装类型筛选
  const clothTypeFilters = filters.value.clothType.selected;
  if (clothTypeFilters.length > 0) {
    query.clothType = clothTypeFilters.join(',');
  } else {
    delete query.clothType;
  }

  // 更新URL，但不触发页面刷新
  router.replace({ query });
};

// 清除所有筛选
const clearAllFilters = () => {
  // 清空所有选中状态
  Object.keys(filters.value).forEach(key => {
    filters.value[key].selected = [];
  });

  // 清空已选择列表
  selectedFilters.value = [];

  // 更新URL参数
  updateQueryParams();
};

// 添加图片切换状态管理
const currentImage = ref({});

// 显示第二张图片
const showSecondImage = (productId) => {
  const product = products.value.find(p => p.id === productId);
  if (product && product.images.length > 1) {
    currentImage.value[productId] = 1;
  }
};

// 显示第一张图片
const hideSecondImage = (productId) => {
  currentImage.value[productId] = 0;
};
</script>

<style scoped>
.bg-gray-100 {
  background-color: #f3f4f6;
}

/* 添加图片切换过渡效果 */
.transition-opacity {
  transition: opacity 0.3s ease-in-out;
}
</style> 