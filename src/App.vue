<template>
  <div></div>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import {World} from './world/world';

onMounted(() => {
  const world = new World();
  window.world = world;
});
</script>

<style scoped></style>
