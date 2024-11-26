<template>
  <div class="p-6">
    <div v-for="category in categories" 
         :key="category.id" 
         class="mb-8"
    >
      <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ category.name }}</h3>
      <div class="grid grid-cols-2 gap-4">
        <div v-for="subcategory in category.subcategories" 
             :key="subcategory.id"
             class="group cursor-pointer"
             @click="$emit('select-category', subcategory)"
        >
          <div class="relative aspect-[4/3] overflow-hidden rounded-lg mb-2">
            <img 
              :src="subcategory.image" 
              :alt="subcategory.name"
              class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            >
            <div class="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
          </div>
          <h4 class="text-gray-900 group-hover:text-primary transition-colors duration-300">
            {{ subcategory.name }}
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DesignCategories',
  props: {
    categories: {
      type: Array,
      required: true
    }
  }
}
</script> 