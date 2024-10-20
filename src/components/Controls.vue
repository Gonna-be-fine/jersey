<template>
  <div style="z-index: 99;" class="fixed left-0 top-0 bottom-0 w-full sm:w-80 md:w-96 lg:w-1/4 xl:w-1/5 bg-white shadow-lg overflow-y-auto z-10">
    <div class="p-4 sm:p-6">
      <h2 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">Jersey Designer</h2>
      
      <div class="mb-4">
        <div class="flex border-b border-gray-200">
          <button 
            v-for="tab in tabs" 
            :key="tab"
            @click="currentTab = tab"
            :class="['px-2 sm:px-4 py-2 text-sm sm:text-base font-medium', currentTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600']"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Text Items -->
      <div v-if="currentTab === 'Text'" class="space-y-4">
        <div v-for="(item, index) in textItems" :key="item.id" class="p-3 sm:p-4 bg-gray-100 rounded-lg">
          <input 
            v-model="item.text" 
            :placeholder="`Text ${index + 1}`"
            class="w-full p-2 mb-2 border rounded text-sm sm:text-base"
          >
          <div class="flex items-center mb-2">
            <label :for="`color-${item.id}`" class="mr-2 text-sm sm:text-base">Color:</label>
            <input 
              :id="`color-${item.id}`"
              v-model="item.color"
              type="color"
              class="w-8 h-8"
            >
          </div>
          <div class="flex items-center">
            <label :for="`border-${item.id}`" class="mr-2 text-sm sm:text-base">Border:</label>
            <input 
              :id="`border-${item.id}`"
              v-model="item.borderWidth"
              type="range"
              min="0"
              max="10"
              class="w-24 sm:w-32"
            >
            <span class="ml-2 text-sm sm:text-base">{{ item.borderWidth }}px</span>
          </div>
        </div>
        <button @click="addTextItem" class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base">
          Add Text
        </button>
      </div>

      <!-- Logo Upload -->
      <div v-if="currentTab === 'Logo'" class="space-y-4">
        <div class="flex items-center space-x-4">
          <input 
            type="file" 
            accept="image/*" 
            @change="handleLogoUpload" 
            class="hidden" 
            ref="fileInput"
          >
          <button @click="$refs.fileInput.click()" class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base">
            Upload Logo
          </button>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
          <div v-for="(logo, index) in logos" :key="index" class="relative">
            <img :src="logo" alt="Uploaded Logo" class="w-full h-20 sm:h-24 object-contain border rounded">
            <button @click="removeLogo(index)" class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
              &times;
            </button>
          </div>
        </div>
      </div>

      <!-- Jersey Colors -->
      <div v-if="currentTab === 'Colors'" class="space-y-4">
        <div v-for="part in jerseyParts" :key="part.name" class="mb-4">
          <h3 class="font-medium mb-2 text-sm sm:text-base">{{ part.name }}</h3>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="color in availableColors" 
              :key="color"
              @click="updateJerseyPartColor(part.name, color)"
              :class="['w-6 h-6 sm:w-8 sm:h-8 rounded-full border', part.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : '']"
              :style="{ backgroundColor: color }"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const tabs = ['Text', 'Logo', 'Colors']
const currentTab = ref('Text')

const textItems = reactive([
  { id: 1, text: '', color: '#000000', borderWidth: 0 }
])

const addTextItem = () => {
  textItems.push({ id: Date.now(), text: '', color: '#000000', borderWidth: 0 })
}

const logos = ref([])

const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      logos.value.push(e.target.result)
    }
    reader.readAsDataURL(file)
  }
}

const removeLogo = (index) => {
  logos.value.splice(index, 1)
}

const jerseyParts = reactive([
  { name: 'Body', color: '#ffffff' },
  { name: 'Sleeves', color: '#ffffff' },
  { name: 'Collar', color: '#ffffff' },
])

const availableColors = [
  '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', 
  '#ffff00', '#ff00ff', '#00ffff', '#808080', '#800000'
]

const updateJerseyPartColor = (partName, color) => {
  const part = jerseyParts.find(p => p.name === partName)
  if (part) {
    part.color = color
  }
}
</script>