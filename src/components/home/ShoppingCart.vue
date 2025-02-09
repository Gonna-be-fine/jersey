<template>
  <div class="shopping-cart">
    <!-- 购物车按钮 -->
    <button 
      class="relative p-2 text-white hover:text-primary transition-colors duration-300"
      @click="toggleCart"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <span 
        v-if="cartStore.cartItemCount" 
        class="absolute -top-1 -right-1 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
      >
        {{ cartStore.cartItemCount }}
      </span>
    </button>

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
        v-if="isCartOpen"
        class="fixed inset-0 bg-black/50 z-40"
        @click="toggleCart"
      ></div>
    </transition>

    <!-- 购物车侧边栏 -->
    <transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div 
        v-if="isCartOpen"
        class="fixed top-0 right-0 w-full max-w-md h-screen bg-white shadow-xl z-50 flex flex-col"
      >
        <!-- 购物车头部 -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-lg font-medium text-gray-900">购物车</h3>
          <button 
            class="p-2 text-gray-400 hover:text-gray-500 transition-colors duration-300"
            @click="toggleCart"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 购物车内容 -->
        <div class="flex-1 overflow-y-auto bg-gray-50">
          <div class="p-4 space-y-4">
            <div v-if="cartStore.items.length">
              <div 
                v-for="item in cartStore.items" 
                :key="item.id"
                class="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div class="flex items-center">
                  <img 
                    :src="item.image" 
                    :alt="item.name" 
                    class="w-20 h-20 object-cover rounded-md"
                  >
                  <div class="flex-1 ml-4">
                    <h4 class="font-medium text-gray-900">{{ item.name }}</h4>
                    <p class="text-sm text-gray-500">
                      球员: {{ item.playerName }} #{{ item.playerNumber }}
                    </p>
                    <p class="text-sm text-gray-500">尺码: {{ item.size }}</p>
                    <div class="text-primary font-bold mt-1">¥{{ item.price }}</div>
                    <div class="flex items-center mt-2 space-x-2">
                      <button 
                        @click="decreaseQuantity(item)"
                        class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-300"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <span class="w-8 text-center">{{ item.quantity }}</span>
                      <button 
                        @click="increaseQuantity(item)"
                        class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-300"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button 
                    @click="cartStore.removeItem(item.id)"
                    class="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div 
              v-else 
              class="flex flex-col items-center justify-center h-64 text-gray-500"
            >
              <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p>购物车是空的</p>
            </div>
          </div>
        </div>

        <!-- 购物车底部 -->
        <div 
          v-if="cartStore.items.length"
          class="border-t border-gray-200 p-4 bg-white"
        >
          <div class="flex justify-between items-center mb-4">
            <span class="text-gray-600">总计:</span>
            <span class="text-xl font-bold text-primary">¥{{ cartStore.totalPrice }}</span>
          </div>
          <button 
            @click="checkout"
            class="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
          >
            <span>去结算</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '../../stores/cartStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const cartStore = useCartStore();
const isCartOpen = ref(false);

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value;
  document.body.style.overflow = isCartOpen.value ? 'hidden' : '';
};

const checkout = () => {
  router.push('/checkout');
  toggleCart();
};
</script> 