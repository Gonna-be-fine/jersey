<template>
  <section class="pt-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section-title title="Design Categories">
        <template #action>
          <button class="bg-primary hover:bg-secondary text-white font-semibold py-2 px-6 transition-colors duration-300">
            All natural Wines
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
            <button @click="openDesignPanel"
                    class="mt-4 w-full bg-primary hover:bg-secondary text-white py-2 px-4 rounded transition-colors duration-300 flex items-center justify-center">
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
              Design now
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

<script>
import SectionTitle from './SectionTitle.vue'
import DesignPanel from './DesignPanel.vue'

export default {
  name: 'BestSellerSection',
  components: {
    SectionTitle,
    DesignPanel
  },
  data() {
    return {
      products: [
        {
          id: 1,
          name: 'Basketball Design',
          image: '/images/strawberry.png',
          onSale: false
        },
        {
          id: 2,
          name: 'Football Design',
          image: '/images/strawberry.png',
          onSale: false
        },
        {
          id: 3,
          name: 'T-shirt Design',
          image: '/images/strawberry.png',
          onSale: false
        },
        {
          id: 4,
          name: 'Shirt Design',
          image: '/images/strawberry.png',
          onSale: false
        }
        // ... 更多产品
      ],
      isDesignPanelOpen: false
    }
  },
  methods: {
    openDesignPanel() {
      this.isDesignPanelOpen = true
    },
    handleCategorySelect(category) {
      console.log('Selected category:', category)
      // 处理分类选择逻辑
      this.isDesignPanelOpen = false
    }
  }
}
</script>

<script setup>
// 定义Tailwind的主题颜色
const colors = {
  primary: '#847630',
  secondary: '#ff7c31'
}
</script> 