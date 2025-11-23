<template>
  <section class="featured-products bg-gray-50 dark:bg-gray-900 py-16 text-gray-800 dark:text-gray-100">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">精选产品</h2>
        <p class="text-gray-600">我们精心挑选的优质葡萄酒</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="product in featuredProducts" 
             :key="product.id" 
             class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
        >
          <!-- 产品图片容器 -->
          <div class="relative aspect-[3/4] overflow-hidden">
            <img 
              :src="product.image" 
              :alt="product.name"
              class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            >
            <!-- 标签 -->
            <div class="absolute top-4 left-4 flex flex-col gap-2">
              <span v-if="product.isNew" 
                    class="bg-primary text-white text-sm px-3 py-1 rounded">
                新品
              </span>
              <span v-if="product.discount" 
                    class="bg-secondary text-white text-sm px-3 py-1 rounded">
                -{{ product.discountPercent }}%
              </span>
            </div>
            <!-- 快速操作按钮 -->
            <div class="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button 
                @click="showQuickView(product)"
                class="bg-white text-gray-900 px-4 py-2 rounded-lg transform translate-y-4 hover:translate-y-0 transition-transform duration-300"
              >
                快速查看
              </button>
            </div>
          </div>

          <!-- 产品信息 -->
          <div class="p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{{ product.name }}</h3>
            <div class="flex items-center justify-between mb-3">
              <div class="text-sm text-gray-600 dark:text-gray-300">{{ product.category }}</div>
              <div class="flex items-center">
                <div class="text-primary">★★★★★</div>
                <span class="text-sm text-gray-500 dark:text-gray-400 ml-1">({{ product.reviewCount }})</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span v-if="product.discount" 
                      class="text-gray-400 dark:text-gray-500 line-through text-sm">
                  ¥{{ product.originalPrice }}
                </span>
                <span class="text-primary font-bold text-xl">
                  ¥{{ product.price }}
                </span>
              </div>
              <button 
                @click="addToCart(product)"
                class="bg-primary hover:bg-secondary text-white p-2 rounded-full transition-colors duration-300"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速查看弹窗 -->
    <div v-if="selectedProduct" 
         class="fixed inset-0 z-50 overflow-y-auto"
         aria-labelledby="modal-title" 
         role="dialog" 
         aria-modal="true"
    >
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
             @click="closeQuickView">
        </div>

        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 产品图片 -->
              <div class="aspect-[3/4] overflow-hidden rounded-lg">
                <img 
                  :src="selectedProduct.image" 
                  :alt="selectedProduct.name"
                  class="w-full h-full object-cover"
                >
              </div>
              
              <!-- 产品详情 -->
              <div>
                <h3 class="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-4">
                  {{ selectedProduct.name }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">
                  {{ selectedProduct.description }}
                </p>
                <div class="flex items-center gap-2 mb-6">
                  <span v-if="selectedProduct.discount" 
                        class="text-gray-400 dark:text-gray-500 line-through text-lg">
                    ¥{{ selectedProduct.originalPrice }}
                  </span>
                  <span class="text-primary font-bold text-2xl">
                    ¥{{ selectedProduct.price }}
                  </span>
                </div>
                <div class="flex items-center gap-4 mb-6">
                  <button 
                    @click="decreaseQuantity"
                    class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                  >-</button>
                  <span class="text-xl">{{ quantity }}</span>
                  <button 
                    @click="increaseQuantity"
                    class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                  >+</button>
                </div>
                <button 
                  @click="addToCartFromModal"
                  class="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg transition-colors duration-300"
                >
                  加入购物车
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FeaturedProducts',
  data() {
    return {
      quantity: 1,
      selectedProduct: null,
      featuredProducts: [
        {
          id: 1,
          name: 'Premium Red Wine',
          category: '红葡萄酒',
          price: 299,
          originalPrice: 399,
          discount: true,
          discountPercent: 25,
          rating: 4.5,
          reviewCount: 128,
          isNew: true,
          image: '/images/wine1.jpg',
          description: '来自法国波尔多产区的优质红葡萄酒,具有浓郁的果香和柔和的单宁。'
        },
        // ... 添加更多产品
      ]
    }
  },
  methods: {
    showQuickView(product) {
      this.selectedProduct = product
      this.quantity = 1
    },
    closeQuickView() {
      this.selectedProduct = null
    },
    increaseQuantity() {
      this.quantity++
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },
    addToCart(product) {
      this.$emit('add-to-cart', { ...product, quantity: 1 })
    },
    addToCartFromModal() {
      this.$emit('add-to-cart', { 
        ...this.selectedProduct, 
        quantity: this.quantity 
      })
      this.closeQuickView()
    }
  }
}
</script>

<style scoped>
.featured-products {
  padding: 4rem 2rem;
}

.section-heading {
  text-align: center;
  margin-bottom: 3rem;
}

.section-subtitle {
  color: var(--text-light);
  margin-top: 0.5rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.product-card {
  background: var(--bg-white);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.product-image {
  position: relative;
  padding-top: 100%;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.quick-view {
  background: white;
  color: var(--text-color);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transform: translateY(20px);
  transition: transform 0.3s;
}

.product-card:hover .quick-view {
  transform: translateY(0);
}

.product-info {
  padding: 1.5rem;
}

.product-name {
  margin-bottom: 0.5rem;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.product-category {
  color: var(--text-light);
}

.stars {
  --percent: calc(var(--rating) / 5 * 100%);
  display: inline-block;
  font-size: 1.25rem;
  font-family: Times;
  line-height: 1;
}

.stars::before {
  content: '★★★★★';
  letter-spacing: 3px;
  background: linear-gradient(90deg, var(--primary-color) var(--percent), var(--text-light) var(--percent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 快速查看弹窗样式 */
.quick-view-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 1000px;
  border-radius: 8px;
  position: relative;
}

.close-modal {
  position: absolute;
  right: 1rem;
  top: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1;
}

.product-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
}

@media (max-width: 768px) {
  .product-details {
    grid-template-columns: 1fr;
  }
}
</style> 