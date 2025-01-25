<template>
  <div id="ctn" v-cloak style="z-index: 99;">
    <div class="w-full mx-auto relative h-full">
      <div class="main-content bg-white shadow-lg h-full bg-gray-50">
        <DashBoard />
      </div>
    </div>
  </div>
  <div id="svgCtn"></div>
  <div id="mainSvgCtn" style="pointer-events: none;"></div>
</template>

<script setup>
import DashBoard from './components/DashBoard.vue';
</script>

<style scoped>
#svgCtn, #mainSvgCtn{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0;
}

[v-cloak] { display: none; }
.main-content {
  display: flex;
  transition: all 0.3s ease;
}
</style>
