<template>
  <section class="pt-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section-title title="设计类型">
        <template #action>
          <button 
            @click="router.push('/products')"
            class="bg-primary hover:bg-secondary text-white font-semibold py-2 px-6 
                   transition-colors duration-300 flex items-center gap-2"
          >
            <span>所有服装类型</span>
            <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </button>
        </template>
      </section-title>
      
      <div class="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="product in products" 
             :key="product.id" 
             class="group relative bg-white rounded-lg shadow-sm hover:-translate-y-1 transition-transform duration-300">
          <div class="relative w-full h-80 rounded-t-lg overflow-hidden">
            <img :src="product.image" 
                 :alt="product.name"
                 class="w-full h-full object-cover object-center">
            <span v-if="product.onSale" 
                  class="absolute top-4 left-4 bg-secondary text-white text-sm px-2 py-1 rounded">
              促销
            </span>
          </div>
          
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900">{{ product.name }}</h3>
            <!-- <div class="mt-3 flex items-center"></div> -->
            <button 
              @click="openDesignPanel(product)"
              class="mt-4 w-full bg-primary hover:bg- text-white py-2 px-4 rounded transition-colors duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" 
                   class="h-5 w-5 mr-2" 
                   fill="none" 
                   viewBox="0 0 24 24" 
                   stroke="currentColor">
                <path stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              挑选设计
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <design-panel 
    v-model:isOpen="isDesignPanelOpen"
    @select-category="handleCategorySelect"
  />
</template>

<script setup>
import { ref } from 'vue'
import SectionTitle from './SectionTitle.vue'
import DesignPanel from './DesignPanel.vue'
import { useRouter } from 'vue-router';
import { SceneCategories } from '../../configs/clothes';

const router = useRouter();

// 定义数据
const products = ref(SceneCategories)

const isDesignPanelOpen = ref(false)

// 定义方法
const openDesignPanel = (product) => {
  router.push({
    path: '/products',
    query: { 
      design: product.id // 传递设计类型ID
    }
  });
};

const handleCategorySelect = (category) => {
  console.log('Selected category:', category)
  // 处理分类选择逻辑
  isDesignPanelOpen.value = false
}

// 定义Tailwind的主题颜色
const colors = {
  primary: '#847630',
  secondary: '#ff7c31'
}
</script> 