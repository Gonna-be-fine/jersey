<template>
  <div>
    <!-- 遮罩层 -->
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 z-40"
        @click="closePanel"
      ></div>
    </transition>

    <!-- 设计面板 -->
    <transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div 
        v-if="isOpen"
        class="fixed top-0 right-0 w-full max-w-2xl h-screen bg-white shadow-xl z-50 flex flex-col"
      >
        <!-- 面板头部 -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">Design Categories</h2>
          <button 
            @click="closePanel"
            class="p-2 text-gray-400 hover:text-gray-500 transition-colors duration-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 面板内容 -->
        <div class="flex-1 overflow-y-auto">
          <design-categories 
            :categories="categories"
            @select-category="selectCategory"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import DesignCategories from './DesignCategories.vue'

export default {
  name: 'DesignPanel',
  components: {
    DesignCategories
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      categories: [
        {
          id: 1,
          name: 'Sports',
          subcategories: [
            { id: 11, name: 'Basketball', image: '/images/basketball.jpg' },
            { id: 12, name: 'Football', image: '/images/football.jpg' },
            { id: 13, name: 'Baseball', image: '/images/baseball.jpg' }
          ]
        },
        {
          id: 2,
          name: 'Clothing',
          subcategories: [
            { id: 21, name: 'T-Shirts', image: '/images/tshirt.jpg' },
            { id: 22, name: 'Hoodies', image: '/images/hoodie.jpg' },
            { id: 23, name: 'Caps', image: '/images/cap.jpg' }
          ]
        }
      ]
    }
  },
  methods: {
    closePanel() {
      this.$emit('update:isOpen', false)
    },
    selectCategory(category) {
      this.$router.push({
        name: 'Design',
        params: { categoryId: category.id }
      })
      this.closePanel()
    }
  }
}
</script> 