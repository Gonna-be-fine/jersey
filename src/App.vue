<template>
  <div class="app">
    <template v-if="!isDesignPage">
      <header class="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-lg">
        <nav class="container mx-auto flex justify-between items-center py-4 px-8">
          <div class="flex items-center gap-12">
            <router-link to="/" class="font-primary text-2xl font-bold text-text">
              TeeCraft
            </router-link>
            
            <div class="flex gap-8">
              <router-link to="/" class="nav-link">首页</router-link>
              <!-- <router-link to="/blog" class="nav-link">博客</router-link> -->
              <router-link to="/products" class="nav-link">商店</router-link>
              <!-- <router-link to="/patterns" class="nav-link">模板</router-link> -->
            </div>
          </div>

          <div class="flex items-center gap-6">
            <search-bar />
            <user-account />
            <shopping-cart />
          </div>
        </nav>
      </header>

      <main class="mt-20 min-h-[calc(100vh-5rem)]">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <div :key="$route.fullPath">
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </main>

      <footer-component />
    </template>

    <template v-else>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <div :key="$route.fullPath">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </template>
  </div>
</template>

<script>
import SearchBar from './components/home/SearchBar.vue'
import UserAccount from './components/home/UserAccount.vue'
import ShoppingCart from './components/home/ShoppingCart.vue'
import FooterComponent from './components/home/FooterComponent.vue'

export default {
  name: 'App',
  components: {
    SearchBar,
    UserAccount, 
    ShoppingCart,
    FooterComponent
  },
  computed: {
    isDesignPage() {
      return this.$route.name === 'Design1'
    }
  }
}
</script>

<style scoped>
.nav-link {
  @apply text-text font-medium py-2 relative;
}

.nav-link::after {
  @apply content-[''] absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300;
}

.nav-link:hover::after,
.router-link-active::after {
  @apply w-full;
}

.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-300;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}

@media (max-width: 768px) {
  .nav-links {
    @apply hidden;
  }
  
  .nav-right {
    @apply gap-4;
  }
}
</style> 