<template>
  <div class="min-h-screen bg-gray-50 pt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 面包屑导航 -->
      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-4">
          <li>
            <router-link to="/" class="text-gray-500 hover:text-gray-700">Home</router-link>
          </li>
          <li>
            <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </li>
          <li>
            <span class="text-gray-700">{{ categoryName }}</span>
          </li>
        </ol>
      </nav>

      <!-- 设计工具区域 -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          Design Your {{ categoryName }}
        </h1>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 预览区域 -->
          <div class="bg-gray-100 rounded-lg p-4 aspect-square flex items-center justify-center">
            <div class="text-gray-500">
              Preview Area
            </div>
          </div>

          <!-- 设计选项 -->
          <div class="space-y-6">
            <!-- 尺寸选择 -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">Size</h3>
              <div class="grid grid-cols-3 gap-3">
                <button 
                  v-for="size in sizes" 
                  :key="size"
                  class="border rounded-md py-2 px-4 text-sm font-medium hover:bg-gray-50"
                  :class="selectedSize === size ? 'border-primary text-primary' : 'border-gray-300 text-gray-700'"
                  @click="selectedSize = size"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- 颜色选择 -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">Color</h3>
              <div class="flex flex-wrap gap-3">
                <button 
                  v-for="color in colors" 
                  :key="color.name"
                  class="w-8 h-8 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  :class="selectedColor === color.name ? 'ring-2 ring-primary ring-offset-2' : 'border-gray-300'"
                  :style="{ backgroundColor: color.value }"
                  @click="selectedColor = color.name"
                ></button>
              </div>
            </div>

            <!-- 上传设计 -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">Upload Design</h3>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input type="file" class="hidden" ref="fileInput" @change="handleFileUpload">
                <button 
                  @click="$refs.fileInput.click()"
                  class="text-primary hover:text-secondary font-medium"
                >
                  Click to upload or drag and drop
                </button>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex space-x-4">
              <button 
                @click="saveDesign"
                class="flex-1 bg-primary hover:bg-secondary text-white py-3 rounded-lg transition-colors duration-300"
              >
                Save Design
              </button>
              <button 
                @click="addToCart"
                class="flex-1 bg-primary hover:bg-secondary text-white py-3 rounded-lg transition-colors duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Design',
  props: {
    categoryId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      categoryName: 'Basketball',  // 这里应该根据categoryId获取实际名称
      selectedSize: 'M',
      selectedColor: 'White',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'White', value: '#ffffff' },
        { name: 'Black', value: '#000000' },
        { name: 'Red', value: '#ef4444' },
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Green', value: '#10b981' }
      ]
    }
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        // 处理文件上传逻辑
        console.log('Uploaded file:', file)
      }
    },
    saveDesign() {
      // 保存设计逻辑
      console.log('Saving design...')
    },
    addToCart() {
      // 添加到购物车逻辑
      console.log('Adding to cart...')
    }
  }
}
</script> 