<template>
  <div>
    <!-- Backdrop -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
      @click="closeDrawer"
    ></div>

    <!-- Drawer -->
    <transition name="slide-right">
      <aside
        v-if="isOpen"
        class="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b shrink-0">
          <div>
            <h2 class="text-lg font-bold text-gray-800">SVG Library</h2>
            <p class="text-xs text-gray-500">{{ filteredItems.length }} assets available</p>
          </div>

          <button @click="closeDrawer" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Categories -->
        <div class="flex overflow-x-auto gap-2 p-4 border-b hide-scrollbar shrink-0 bg-gray-50">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md scale-105'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
            ]"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Scrollable Content -->
        <div ref="scrollContainerRef" class="flex-1 overflow-y-auto p-4 bg-gray-50/50">
          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="item in displayedItems"
              :key="item.id"
              class="group cursor-pointer flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all aspect-square"
              @click="selectItem(item)"
            >
              <div class="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" v-html="item.content"></div>
              <span class="text-[10px] text-gray-500 font-medium truncate w-full text-center group-hover:text-blue-600">
                {{ item.name }}
              </span>
            </div>
          </div>

          <!-- Empty -->
          <div v-if="filteredItems.length === 0"
            class="flex flex-col items-center justify-center h-48 text-gray-400">
            <svg class="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p>No items found in {{ selectedCategory }}</p>
          </div>

          <!-- Loading Sentinel -->
          <div v-if="displayedItems.length < filteredItems.length" ref="loadingTriggerRef"
            class="py-6 flex justify-center w-full">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3 border-t bg-white text-xs text-gray-400 text-center shrink-0">
          Select an icon to add it to your workspace
        </div>
      </aside>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  svgLibrary: { type: Array, default: () => [] },
  pageSize: { type: Number, default: 24 }
});

const emit = defineEmits(['close', 'select']);

const selectedCategory = ref('All');
const visibleCount = ref(props.pageSize);
const scrollContainerRef = ref(null);
const loadingTriggerRef = ref(null);
let observer = null;

// ---- Filtering ----
const categories = computed(() => {
  const cats = new Set(props.svgLibrary.map(i => i.category));
  return ['All', ...Array.from(cats)];
});

const filteredItems = computed(() => {
  if (selectedCategory.value === 'All') return props.svgLibrary;
  return props.svgLibrary.filter(i => i.category === selectedCategory.value);
});

const displayedItems = computed(() =>
  filteredItems.value.slice(0, visibleCount.value)
);

watch(selectedCategory, () => {
  visibleCount.value = props.pageSize;
  scrollContainerRef.value && (scrollContainerRef.value.scrollTop = 0);
});

// ---- Infinite Scroll ----
function initObserver() {
  if (observer) observer.disconnect();

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        visibleCount.value = Math.min(
          visibleCount.value + props.pageSize,
          filteredItems.value.length
        );
      }
    },
    { root: scrollContainerRef.value, threshold: 0.1, rootMargin: '100px' }
  );

  loadingTriggerRef.value && observer.observe(loadingTriggerRef.value);
}

watch(
  () => [filteredItems.value.length, props.isOpen],
  () => setTimeout(initObserver, 60)
);

onMounted(() => setTimeout(initObserver, 200));
onBeforeUnmount(() => observer?.disconnect());

// ---- Emits ----
const closeDrawer = () => emit('close');
const selectItem = (item) => emit('select', item);
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform .28s ease, opacity .28s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
