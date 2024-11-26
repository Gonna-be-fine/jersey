<template>
  <section class="latest-products">
    <div class="section-heading">
      <h2 class="section-title">最新产品</h2>
      <div class="heading-actions">
        <button class="btn-primary">所有天然葡萄酒</button>
      </div>
    </div>

    <div class="products-slider">
      <button class="slider-arrow prev" @click="slidePrev" :disabled="isAtStart">
        <i class="fas fa-chevron-left"></i>
      </button>

      <div class="products-wrapper" ref="productsWrapper">
        <div 
          v-for="product in latestProducts" 
          :key="product.id" 
          class="product-card"
          :style="{ transform: `translateX(${translateX}px)` }"
        >
          <div class="product-image">
            <img :src="product.image" :alt="product.name">
            <span v-if="product.isNew" class="new-badge">新品</span>
            <span v-if="product.discount" class="discount-badge">
              -{{ product.discountPercent }}%
            </span>
          </div>

          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-price">
              <span v-if="product.discount" class="original-price">
                ¥{{ product.originalPrice }}
              </span>
              <span class="current-price">¥{{ product.price }}</span>
            </div>
            <div class="product-actions">
              <button 
                class="add-to-cart"
                @click="addToCart(product)"
              >
                加入购物车
              </button>
              <button 
                class="add-to-wishlist"
                @click="toggleWishlist(product)"
                :class="{ active: isInWishlist(product.id) }"
              >
                <i class="fas fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <button class="slider-arrow next" @click="slideNext" :disabled="isAtEnd">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'LatestProducts',
  data() {
    return {
      translateX: 0,
      slideWidth: 300, // 每个产品卡片的宽度
      slideGap: 20,    // 卡片之间的间距
      currentIndex: 0,
      latestProducts: [
        {
          id: 1,
          name: 'Strawberry Wine',
          price: 85.00,
          originalPrice: 100.00,
          discount: true,
          discountPercent: 15,
          isNew: true,
          image: '/images/strawberry.png'
        },
        {
          id: 2,
          name: 'Poppiana Wine',
          price: 100.00,
          isNew: true,
          image: '/images/poppiana.png'
        },
        {
          id: 3,
          name: 'Palm Wine',
          price: 75.00,
          isNew: true,
          image: '/images/palm-wine.png'
        },
        {
          id: 4,
          name: 'Organic Wine',
          price: 180.00,
          isNew: true,
          image: '/images/organic-wine.png'
        }
        // ... 更多产品
      ],
      wishlist: [] // 存储心愿单商品ID
    }
  },
  computed: {
    isAtStart() {
      return this.currentIndex <= 0
    },
    isAtEnd() {
      return this.currentIndex >= this.latestProducts.length - this.visibleSlides
    },
    visibleSlides() {
      // 根据容器宽度计算可见的滑块数量
      const containerWidth = this.$refs.productsWrapper?.clientWidth || 0
      return Math.floor(containerWidth / (this.slideWidth + this.slideGap))
    }
  },
  methods: {
    slidePrev() {
      if (!this.isAtStart) {
        this.currentIndex--
        this.updateTranslate()
      }
    },
    slideNext() {
      if (!this.isAtEnd) {
        this.currentIndex++
        this.updateTranslate()
      }
    },
    updateTranslate() {
      this.translateX = -(this.currentIndex * (this.slideWidth + this.slideGap))
    },
    addToCart(product) {
      this.$emit('add-to-cart', product)
    },
    toggleWishlist(product) {
      const index = this.wishlist.indexOf(product.id)
      if (index === -1) {
        this.wishlist.push(product.id)
      } else {
        this.wishlist.splice(index, 1)
      }
    },
    isInWishlist(productId) {
      return this.wishlist.includes(productId)
    }
  },
  mounted() {
    // 监听窗口大小变化,更新滑块位置
    window.addEventListener('resize', this.updateTranslate)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateTranslate)
  }
}
</script>

<style scoped>
.latest-products {
  padding: 4rem 2rem;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.products-slider {
  position: relative;
  margin: 0 -1rem;
  padding: 0 1rem;
}

.products-wrapper {
  overflow: hidden;
  margin: 0 2rem;
}

.product-card {
  width: 300px;
  margin-right: 20px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: inline-block;
  vertical-align: top;
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

.new-badge,
.discount-badge {
  position: absolute;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.new-badge {
  top: 1rem;
  left: 1rem;
  background: var(--primary-color);
  color: white;
}

.discount-badge {
  top: 1rem;
  right: 1rem;
  background: #ff4444;
  color: white;
}

.product-info {
  padding: 1.5rem;
}

.product-name {
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
}

.product-price {
  margin-bottom: 1rem;
}

.original-price {
  text-decoration: line-through;
  color: var(--text-light);
  margin-right: 0.5rem;
}

.current-price {
  color: var(--primary-color);
  font-weight: bold;
}

.product-actions {
  display: flex;
  gap: 1rem;
}

.add-to-cart {
  flex: 1;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.add-to-cart:hover {
  background: var(--primary-dark);
}

.add-to-wishlist {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s;
}

.add-to-wishlist.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  cursor: pointer;
  z-index: 1;
}

.slider-arrow.prev {
  left: 0;
}

.slider-arrow.next {
  right: 0;
}

.slider-arrow:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .products-wrapper {
    margin: 0 1rem;
  }
  
  .product-card {
    width: calc(100vw - 4rem);
  }
}
</style> 