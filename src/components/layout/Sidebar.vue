<template>
  <!-- 遮罩层 -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 z-40 md:hidden"
    @click="close"
  ></div>

  <!-- 抽屉 Sidebar -->
  <aside
    :class="[
      'fixed top-0 right-0 h-auto w-[90%] max-w-sm bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300',
      'md:relative md:translate-x-0 md:block md:w-64 md:max-w-none',
      isOpen ? 'translate-x-0' : 'translate-x-full'
    ]"
  >
    <ul class="p-4 space-y-2">
      <li>
        <a href="#" class="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700" @click="close">
          Dashboard
        </a>
      </li>
      <li>
        <a href="#" class="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700" @click="close">
          Settings
        </a>
      </li>
      <li>
        <a href="#" class="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700" @click="close">
          Profile
        </a>
      </li>
    </ul>
  </aside>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
})
const emit = defineEmits(["close"])
const close = () => emit("close")
</script>
