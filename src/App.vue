<template>
  <div id="ctn" v-cloak style="z-index: 99;">
    <Header></Header>
    <div class="container mx-auto px-2 relative" style="padding-top: 80px;">
      <div class="main-content bg-white rounded-lg shadow-lg">
        <DashBoard />
      </div>
    </div>
  </div>
  <div id="svgCtn"></div>
  <div id="mainSvgCtn" style="pointer-events: none;"></div>
</template>

<script setup>
import Header from './components/Header.vue';
import DashBoard from './components/DashBoard.vue';
</script>

<style scoped>
#svgCtn, #mainSvgCtn{
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  opacity: 0;
}

[v-cloak] { display: none; }
.main-content {
  display: flex;
  transition: all 0.3s ease;
}
</style>
