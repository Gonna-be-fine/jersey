<script setup>
import { ref } from 'vue'

const text = ref('');

const addText = () => {
  console.log(text.value)
  window.world.svgEditor.svgCanvas.diyAddText(640, 4600, text.value)
}
</script>

<template>
  <div class="controlsCtn">
    <div class="">
      <input type="text" v-model="text">
      <button @click="addText">添加文字</button>
    </div>
  </div>
</template>

<style scoped>
.controlsCtn{
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 99;
}
</style>
