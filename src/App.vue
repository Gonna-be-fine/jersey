<template>
  <div class="app">
    <template v-if="!isDesignPage">
      <header class="header">
        <nav class="main-nav container">
          <div class="nav-left">
            <router-link to="/" class="logo">Drinkify</router-link>
            
            <div class="nav-links">
              <router-link to="/">首页</router-link>
              <router-link to="/blog">博客</router-link>
              <router-link to="/shop">商店</router-link>
              <router-link to="/patterns">模板</router-link>
            </div>
          </div>

          <div class="nav-right">
            <search-bar />
            <user-account />
            <shopping-cart />
          </div>
        </nav>
      </header>

      <main class="main-with-header">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <footer-component />
    </template>

    <template v-else>
      <main class="main-fullscreen">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
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
      return this.$route.name === 'Design'
    }
  }
}
</script>

<style scoped>
.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 2rem;
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
}

.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.logo {
  font-family: var(--font-primary);
  font-size: 1.5rem;
  color: var(--text-color);
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: var(--text-color);
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-color);
  transition: width 0.3s;
}

.nav-links a:hover::after,
.nav-links a.router-link-active::after {
  width: 100%;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.main-with-header {
  margin-top: 80px; /* header height */
  min-height: calc(100vh - 80px);
}

.main-fullscreen {
  min-height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .nav-right {
    gap: 1rem;
  }
}
</style> 