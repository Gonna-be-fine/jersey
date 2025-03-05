<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 面包屑导航 -->
      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <router-link to="/" class="text-gray-500 hover:text-primary">首页</router-link>
          </li>
          <li class="text-gray-500">/</li>
          <li>
            <router-link to="/products" class="text-gray-500 hover:text-primary">产品列表</router-link>
          </li>
          <li class="text-gray-500">/</li>
          <li class="text-primary">{{ product.name }}</li>
        </ol>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- 左侧产品图片 -->
        <div class="space-y-4">
          <!-- 主图轮播 -->
          <div class="relative h-[500px] bg-white rounded-lg overflow-hidden">
            <!-- 主图片 -->
            <transition-group name="fade">
              <img 
                v-for="(image, index) in product.pictures" 
                :key="image"
                v-show="currentImageIndex === index"
                :src="image" 
                :alt="product.name"
                class="absolute inset-0 w-full h-full object-contain"
                @error="handleImageError">
            </transition-group>
            
            <!-- 轮播控制按钮 -->
            <button 
              v-if="product.pictures?.length > 1"
              @click="prevImage"
              class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              v-if="product.pictures?.length > 1"
              @click="nextImage"
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- 轮播指示器 -->
            <div v-if="product.pictures?.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              <button 
                v-for="(_, index) in product.pictures"
                :key="index"
                @click="currentImageIndex = index"
                class="w-2 h-2 rounded-full transition-colors duration-300"
                :class="currentImageIndex === index ? 'bg-primary' : 'bg-gray-300'">
              </button>
            </div>
          </div>

          <!-- 缩略图列表 -->
          <div v-if="product.pictures?.length > 1" class="flex justify-center gap-2 overflow-x-auto py-2">
            <button 
              v-for="(image, index) in product.pictures" 
              :key="index"
              @click="currentImageIndex = index"
              class="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors duration-300"
              :class="currentImageIndex === index ? 'border-primary' : 'border-transparent'">
              <img 
                :src="image" 
                :alt="product.name" 
                class="w-full h-full object-cover"
                @error="handleImageError">
            </button>
          </div>
        </div>

        <!-- 右侧产品信息 -->
        <div class="space-y-6">
          <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>
          
          <!-- 价格信息 -->
          <div class="space-y-2">
            <div class="flex items-baseline">
              <span class="text-2xl font-semibold text-primary">${{ product.price }}</span>
            </div>
            <!-- 批发价格表 -->
            <div class="text-sm text-gray-500">
              <div v-for="[range, price] in product.priceList" :key="range" class="flex justify-between">
                <span>{{ formatPriceRange(range) }}件</span>
                <span>${{ price }}/件</span>
              </div>
            </div>
          </div>

          <!-- 尺码选择 -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">选择尺码</h3>
            <div class="grid grid-cols-4 gap-4">
              <button 
                v-for="size in sizes" 
                :key="size"
                @click="selectedSize = size"
                class="py-2 px-4 border rounded-md text-center transition-colors duration-300"
                :class="selectedSize === size ? 'border-primary text-primary' : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'">
                {{ size }}
              </button>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex gap-4">
            <button 
              @click="handleCustomize"
              class="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-md transition-colors duration-300">
              开始定制
            </button>
            <button 
              @click="addToCart"
              :disabled="!selectedSize"
              class="flex-1 bg-secondary hover:bg-secondary-dark disabled:bg-gray-300 text-white py-3 px-6 rounded-md transition-colors duration-300">
              加入购物车
            </button>
          </div>

          <!-- 产品描述 -->
          <div class="prose prose-sm mt-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">产品描述</h3>
            <p class="text-gray-500">{{ product.description || '暂无描述' }}</p>
          </div>

          <!-- 产品特点 -->
          <div class="border-t pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">产品特点</h3>
            <ul class="list-disc list-inside space-y-2 text-gray-500">
              <li>双面可穿设计</li>
              <li>轻量透气面料</li>
              <li>专业运动剪裁</li>
              <li>防褪色耐洗涤</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '../utils/toast';
import { useCartStore } from '../stores/cartStore';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const cartStore = useCartStore();

// 默认占位图片
const defaultImage = '/images/assets/placeholder.png';

// 产品数据
const product = ref({
  id: '',
  name: '',
  price: 0,
  pictures: [],
  description: '',
  priceList: [],
  isComb: false,
  relativeId: 0
});

// 轮播相关状态
const currentImageIndex = ref(0);
const autoPlayInterval = ref(null);

// 其他状态
const selectedSize = ref('');
const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

// 格式化价格区间
const formatPriceRange = (range) => {
  const [min, max] = range.split('-');
  return max ? `${min}-${max}` : `${min}+`;
};

// 图片加载错误处理
const handleImageError = (e) => {
  if (e.target.src !== defaultImage) {
    e.target.src = defaultImage;
  }
};

// 轮播控制方法
const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % product.value.pictures.length;
};

const prevImage = () => {
  currentImageIndex.value = currentImageIndex.value === 0 
    ? product.value.pictures.length - 1 
    : currentImageIndex.value - 1;
};

// 处理定制按钮点击
const handleCustomize = () => {
  router.push({
    name: 'Design',
    params: { 
      categoryId: product.value.sportType || 'default'
    }
  });
};

// 处理加入购物车
const addToCart = () => {
  if (!selectedSize.value) {
    toast.warning('请选择尺码');
    return;
  }

  // 添加到购物车
  cartStore.addToCart({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    size: selectedSize.value,
    quantity: 1,
    image: product.value.pictures[0]
  });

  toast.success('已添加到购物车');
};

// 获取产品数据
const fetchProduct = async () => {
  try {
    const response = await fetch('/dataset/mockdata.json');
    const data = await response.json();
    const productId = Number(route.params.id);
    const productData = data.find(item => item.id === productId);
    
    if (productData) {
      product.value = productData;
    } else {
      toast.error('产品不存在');
      router.push('/products');
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    toast.error('获取产品数据失败');
  }
};

onMounted(() => {
  fetchProduct();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 