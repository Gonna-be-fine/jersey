<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-800 dark:text-gray-100">
    <Header :canOpenSidebar="showSidebar" @openSidebar="showSidebar && (sidebarOpen = true)" />

    <div class="flex flex-1">
      <component
        v-if="showSidebar"
        :is="SidebarComponent"
        :isOpen="sidebarOpen"
        @close="sidebarOpen = false"
      />
      <main class="flex-1 ">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <!-- <div :key="$route.fullPath"> -->
              <component :key="$route.name" :is="Component" />
            <!-- </div> -->
          </transition>
        </router-view>
      </main>
    </div>

    <!-- <Footer /> -->
    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, computed, watch, defineAsyncComponent } from "vue"
import { useRoute } from "vue-router"
import Header from "./Header.vue"
import Footer from "./Footer.vue"
import FooterComponent from "../home/FooterComponent.vue"
import DefaultSidebar from "./Sidebar.vue"

const route = useRoute()
const sidebarOpen = ref(false)

// 约定：默认展示侧边栏，只有 meta.sidebar === false 才隐藏
const showSidebar = computed(() => route.meta.sidebar !== false)

// 支持不同路由使用不同的 Sidebar 组件：通过 meta.sidebarKey 指定
// 可选值示例：'default' | 'basic' | 'admin'
const sidebarKey = computed(() => (route.meta.sidebarKey) || 'default')

const sidebarRegistry = {
  default: DefaultSidebar,
  basic: defineAsyncComponent(() => import("@/components/layout/SidebarBasic.vue")),
  admin: defineAsyncComponent(() => import("@/components/layout/SidebarAdmin.vue")),
}

const SidebarComponent = computed(() => sidebarRegistry[sidebarKey.value] || DefaultSidebar)

// 当切换到不需要侧边栏的路由时，自动关闭抽屉状态
watch(showSidebar, (v) => {
  if (!v) sidebarOpen.value = false
})
</script>
