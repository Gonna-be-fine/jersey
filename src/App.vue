<template>
  <div id="svgCtn"></div>
  <Controls/>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import Controls from './components/Controls.vue';
import {World} from './world/world';

onMounted(() => {
  const world = new World();
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
