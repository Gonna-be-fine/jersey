<template>
  <header
    class="flex items-center justify-between px-4 h-16 bg-background/90 backdrop-blur-lg dark:bg-gray-900 dark:text-gray-100">
    <h1 class="text-lg font-bold flex items-center">
      <nav class="mr-8">
        <router-link to="/" class="flex font-primary text-2xl font-bold text-text">
          <img class="w-12 bg-white" src="@/assets/logo/marker.svg" alt="MoMoFit">
          <img class="w-24 bg-white" src="@/assets/logo/text.svg" alt="MoMoFit">
        </router-link>
      </nav>
      <div class="flex gap-8">
        <router-link to="/" class="nav-link">首页</router-link>
        <!-- <router-link to="/blog" class="nav-link">博客</router-link> -->
        <router-link to="/products" class="nav-link">商店</router-link>
        <!-- <router-link to="/patterns" class="nav-link">模板</router-link> -->
      </div>
    </h1>

    <div class="flex items-center gap-4">
      <nav class="hidden md:flex md:items-center gap-4">
        <search-bar />
        <user-account />
        <shopping-cart />
      </nav>

      <!-- 主题切换按钮 -->
      <button @click="toggleTheme" class="p-2 rounded bg-white/20 dark:bg-white/10">
        <span v-if="isDark">🌙</span>
        <span v-else>☀️</span>
      </button>

      <!-- 移动端菜单按钮 -->
      <button v-if="canOpenSidebar" class="md:hidden" @click="$emit('openSidebar')">☰</button>
    </div>
  </header>
</template>

<script setup>
import { useTheme } from "@/composables/useTheme.js"
import SearchBar from "../home/SearchBar.vue"
import UserAccount from "../home/UserAccount.vue"
import ShoppingCart from "../home/ShoppingCart.vue"

const { isDark, toggleTheme } = useTheme()
defineProps({
  canOpenSidebar: { type: Boolean, default: true },
})
</script>
