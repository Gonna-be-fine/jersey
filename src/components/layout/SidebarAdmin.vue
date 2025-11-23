<template>
  <div class="contents">
    <!-- 移动端遮罩层：仅在 isOpen 时显示 -->
    <div
      class="fixed inset-0 bg-black/40 md:hidden"
      v-if="isOpen"
      @click="$emit('close')"
    />

    <!-- 侧栏容器：
         - 移动端：固定定位，顶边留出 header 高度（h-16），抽屉式滑入滑出
         - md 及以上：静态定位，作为常规侧栏占位 -->
    <aside
      class="
        fixed left-0 top-16 bottom-0 z-40 w-72
        border-r border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-900
        transition-transform duration-200 ease-out
        md:static md:top-auto md:bottom-auto md:z-auto md:translate-x-0 md:w-72
      "
      :class="{
        '-translate-x-full': !isOpen,
        'translate-x-0': isOpen,
      }"
      aria-label="Admin Sidebar"
    >
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-200">Admin Sidebar</h2>
        <button
          class="px-2 py-1 text-xs rounded bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/40 dark:hover:bg-red-900/60"
          @click="$emit('close')"
        >Close</button>
      </div>
      <nav class="p-3 text-sm overflow-auto h-full">
        <ul class="space-y-1">
          <li><a class="block px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800" href="#">Users</a></li>
          <li><a class="block px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800" href="#">Roles</a></li>
          <li><a class="block px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800" href="#">Permissions</a></li>
          <li><a class="block px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800" href="#">Audit Logs</a></li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<script setup>
defineProps({
  isOpen: { type: Boolean, default: false },
})
defineEmits(["close"])
</script>


