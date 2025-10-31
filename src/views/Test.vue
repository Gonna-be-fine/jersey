<template>
  <div>
    <div id="fabricElement" style="position:absolute;top:0;left:0;width:512px;height:512px;z-index:3;"></div>
  </div>
</template>

<script>
import * as fabric from 'fabric';
import { onMounted } from 'vue';

onMounted(() => {
  const canvas = new Fabric.Canvas('fabricElement');

    async function loadFabricJson(url) {
      const jsonStr = await fetch(url).then(res => res.text());
      let json = JSON.parse(jsonStr);

      // // 清理无效 Image 对象
      // json.objects = json.objects.filter(obj => {
      //   if (obj.type !== 'image') return true;
      //   return obj.src && obj.src.length > 0 && obj.width > 0 && obj.height > 0;
      // });

      // 加载
      await canvas.loadFromJSON(json);
      canvas.renderAll();

      console.log("Loaded objects:", canvas.getObjects());
    }

    // 你需要把 1.json 放到本地或者部署后正确指向这个地址
    loadFabricJson('./1.json');
})
</script>