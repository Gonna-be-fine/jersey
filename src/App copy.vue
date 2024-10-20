<template>
  <div class="flex flex-col sm:flex-row h-screen bg-gray-100">
    <!-- Left Panel -->
    <div class="w-full sm:w-80 md:w-96 lg:w-1/4 xl:w-1/5 bg-white shadow-lg overflow-y-auto z-20">
      <Controls/>
    </div>

    <!-- Main Canvas Area -->
    <div class="flex-grow flex flex-col" style="z-index: 99;">
      <!-- Top Bar -->
      <div class="bg-white shadow-md p-4">
        <h1 class="text-2xl font-bold text-gray-800">3D Jersey Designer</h1>
      </div>

      <!-- WebGL Canvas -->
      <div class="flex-grow relative">
        <canvas ref="glCanvas" class="absolute inset-0 w-full h-full"></canvas>
      </div>
    </div>
  </div>
  <div id="svgCtn"></div>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import Controls from './components/Controls.vue';
import {World} from './world/world';

const glCanvas = ref('glCanvas')
onMounted(() => {
  const world = new World(glCanvas.value);
  window.world = world;
});
</script>

<style scoped>
#svgCtn{
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
