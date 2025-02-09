<template>
  <div class="flex min-h-screen bg-gray-50 text-gray-700">
    <!-- 左侧筛选区 -->
    <div class="w-64 border-r bg-white">
      <!-- Sticky 容器 -->
      <div class="sticky top-20">
        <!-- 已选择的筛选标签 -->
        <div v-if="selectedFilters.length > 0" class="p-4 border-b">
          <h3 class="text-sm font-medium mb-2">已选择：</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="filter in selectedFilters" 
              :key="filter.id"
              class="inline-flex items-center px-2 py-1 rounded-full text-sm bg-gray-100">
              {{ filter.label }}
              <button 
                @click="removeFilter(filter)"
                class="ml-1 text-gray-500 hover:text-gray-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
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
              class="w-full flex justify-between items-center font-medium mb-2">
              <span>设计</span>
              <svg 
                :class="{'rotate-180': filters.design.isOpen}" 
                class="w-5 h-5 transition-transform duration-200" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <div v-show="filters.design.isOpen" class="space-y-2 ml-2">
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  class="form-checkbox" 
                  value="basketball"
                  v-model="filters.design.selected"
                  @change="updateFilters('design', 'basketball', '篮球服')">
                <span class="ml-2">篮球服</span>
              </label>
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  class="form-checkbox" 
                  value="football"
                  v-model="filters.design.selected"
                  @change="updateFilters('design', 'football', '足球服')">
                <span class="ml-2">足球服</span>
              </label>
            </div>
          </div>

          <!-- 性别筛选 -->
          <div class="mb-4">
            <button 
              @click="toggleFilter('gender')" 
              class="w-full flex justify-between items-center font-medium mb-2">
              <span>性别</span>
              <svg 
                :class="{'rotate-180': filters.gender.isOpen}" 
                class="w-5 h-5 transition-transform duration-200" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <div v-show="filters.gender.isOpen" class="space-y-2 ml-2">
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  class="form-checkbox" 
                  value="mens"
                  v-model="filters.gender.selected"
                  @change="updateFilters('gender', 'mens', '男装')">
                <span class="ml-2">男装</span>
              </label>
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  class="form-checkbox" 
                  value="womens"
                  v-model="filters.gender.selected"
                  @change="updateFilters('gender', 'womens', '女装')">
                <span class="ml-2">女装</span>
              </label>
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  class="form-checkbox" 
                  value="youth"
                  v-model="filters.gender.selected"
                  @change="updateFilters('gender', 'youth', '青少年')">
                <span class="ml-2">青少年</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧商品展示区 -->
    <div class="flex-1 p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="product in displayedProducts" :key="product.id" class="bg-white rounded-lg shadow">
          <div class="p-4">
            <img :src="product.images[0]" :alt="product.name" class="w-full h-64 object-cover rounded">
            <h3 class="mt-4 text-lg font-medium">{{ product.name }}</h3>
            <div class="mt-2 flex justify-between items-center">
              <span class="text-gray-600">${{ product.price }}</span>
              <button 
                @click="handleCustomize(product)"
                class="bg-primary hover:bg-secondary text-white px-2 py-1 rounded transition-colors duration-300">
                自定义
              </button>
            </div>
            <div class="text-center mt-2 border-b cursor-pointer hover:text-primary transition-colors duration-300"
                 @click="viewProduct(product)">
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
            :class="currentPage === 1 ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'">
            上一页
          </button>
          
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="changePage(page)"
            class="px-3 py-1 rounded border" 
            :class="currentPage === page ? 'bg-primary text-white border-primary' : 'text-gray-700 border-gray-300 hover:bg-gray-50'">
            {{ page }}
          </button>
          
          <button 
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded border"
            :class="currentPage === totalPages ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'">
            下一页
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 筛选器状态
const filters = ref({
  design: { 
    isOpen: true,
    selected: [] 
  },
  gender: { 
    isOpen: true,
    selected: [] 
  }
});

// 已选择的筛选项
const selectedFilters = ref([]);

// 更新筛选器
const updateFilters = (type, value, label) => {
  const isChecked = filters.value[type].selected.includes(value);
  
  if (isChecked) {
    // 添加到已选择列表
    selectedFilters.value.push({
      id: `${type}-${value}`,
      type,
      value,
      label
    });
  } else {
    // 从已选择列表中移除
    const index = selectedFilters.value.findIndex(
      filter => filter.id === `${type}-${value}`
    );
    if (index !== -1) {
      selectedFilters.value.splice(index, 1);
    }
  }
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
};

// 切换筛选器展开状态
const toggleFilter = (filterName) => {
  filters.value[filterName].isOpen = !filters.value[filterName].isOpen;
};

// 分页相关数据
const currentPage = ref(1);
const pageSize = ref(12); // 每页显示12个商品
const products = ref([
  {
    id: 1,
    name: "BALL STARS REVERSIBLE JERSEY",
    price: 69.95,
    images: ["/path-to-image.jpg"]
  },
  {
    id: 1,
    name: "BALL STARS REVERSIBLE JERSEY",
    price: 69.95,
    images: ["/path-to-image.jpg"]
  },
  {
    id: 1,
    name: "BALL STARS REVERSIBLE JERSEY",
    price: 69.95,
    images: ["/path-to-image.jpg"]
  },
  {
    id: 1,
    name: "BALL STARS REVERSIBLE JERSEY",
    price: 69.95,
    images: ["/path-to-image.jpg"]
  },
  {
    id: 1,
    name: "BALL STARS REVERSIBLE JERSEY",
    price: 69.95,
    images: ["/path-to-image.jpg"]
  },
  // ... 添加更多测试数据
]);

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(products.value.length / pageSize.value);
});

// 计算当前页显示的商品
const displayedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return products.value.slice(start, end);
});

// 切换页码
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // 可以在这里触发重新获取数据��操作
  }
};

// 处理自定义按钮点击
const handleCustomize = (product) => {
  // 这里的categoryId应该根据实际产品类别来设置
  const categoryId = product.categoryId || 'default';
  router.push({
    name: 'Design',
    params: { 
      categoryId: categoryId
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
</script> 