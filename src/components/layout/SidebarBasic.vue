<template>
  <aside class="w-64 shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/40 backdrop-blur">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-200">Basic Sidebar</h2>
      <button
        class="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        @click="$emit('close')"
      >Close</button>
    </div>
    <nav class="p-3 text-sm">
      <ul class="space-y-1">
        <li><a class="block px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800" href="#">Overview</a></li>
        <li><a class="block px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800" href="#">Quick Start</a></li>
        <li><a class="block px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800" href="#">Docs</a></li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
defineProps({
  isOpen: { type: Boolean, default: false },
})
defineEmits(["close"])
</script>


