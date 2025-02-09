<template>
  <div class="space-y-4 w-full h-full relative">
    <div class="tab-title flex items-center justify-between">
      <p>预定/球员名单</p>
      <button @click="emit('addPlayer')" class="cursor-pointer inline-flex items-center justify-center hover:text-gray-500">
        <font-awesome-icon :icon="['fas', 'plus']" />
      </button>
    </div>
    <div class="bg-dark p-2 rounded-lg">
      <div v-for="(player, index) in players" :key="index" class="relative flex gap-2 justify-between mb-2">
        <input type="text" placeholder="球员名字" class="input-element w-28" v-model="player.name">
        <input type="text" placeholder="号码" class="input-element w-12" v-model="player.number">
        <select placeholder="球衣尺寸" class="input-element" v-model="player.size">
          <option :value="size" v-for="size in sizes" :key="size">{{ size }}</option>
        </select>
        <button @click="emit('previewPlayer', index)">预览</button>
        <button @click="emit('removePlayer', index)" v-if="players.length > 1">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>
    </div>
    <div>
      <p>价格详细</p>
      <section>
        <header class="flex border-b">
          <div class="w-1/3 text-center">价格表</div>
          <div class="w-1/3 text-right border-r px-2">数量</div>
          <div class="w-1/3 text-center">单品（元/件）</div>
        </header>
        <div class="flex border-b" v-for="(item, index) in priceTag" :key="index">
          <div class="w-2/3 text-right border-r px-2">{{ item.quantity }}</div>
          <div class="w-1/3 text-center">￥{{ item.price }}</div>
        </div>
      </section>
    </div>
    <div style="width: 15rem" class="absolute bottom-0 left-1/2 rounded-lg transform translate-x-[-50%] bg-dark p-2">
      <div class="flex justify-between items-center">
        <font-awesome-icon class="text-lg text-blue-300 mr-2" :icon="['fas', 'bag-shopping']" />
        <div class="mr-2">
          <p><span class="font-bold text-white">{{ players.length }}</span>件</p>
          <p class="font-ellipsis w-20">无悔篮球T-shirt</p>
        </div>
        <button 
          @click="handleAddToCart"
          class="text-sm bg-primary hover:bg-secondary text-white py-2 px-4 rounded-lg"
        >
          加入购物车<span class="font-bold">￥{{ computeTotalPrice }}</span>
        </button>
      </div>
    </div>
    <div>
      <p>下单指导</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import { useCartStore } from '../../stores/cartStore';
import { useToast } from '../../utils/toast';

const toast = useToast();
const cartStore = useCartStore();
const props = defineProps({
  players: Array,
});
const emit = defineEmits();

const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const priceTag = [
  {
    quantity: 1,
    price: 48.8
  },
  {
    quantity: 2,
    price: 46.6
  },
  {
    quantity: '3-6',
    price: 42.2
  },
  {
    quantity: '7+',
    price: 38
  },
]
const computeTotalPrice = computed(() => {
  let price = 0;
  for(let i = 0; i < priceTag.length; i++) {
    let quantity = priceTag[i].quantity;
    if(typeof quantity === 'string') {
      let quantityArr = quantity.split('-');
      if(quantityArr.length > 0 && quantityArr[0] <= props.players.length && quantityArr[1] >= props.players.length) {
        price = priceTag[i].price;
        break;
      }else {
        let quantityArr = quantity.split('+');
        if(quantityArr.length > 0 && quantityArr[0] <= props.players.length) {
          price = priceTag[i].price;
          break;
        }
      }
    }else if(quantity === props.players.length) {
      price = priceTag[i].price;
      break;
    }
  }
  return (price * props.players.length).toFixed(2);
})

const handleAddToCart = () => {
  // 验证所有必填字段
  const isValid = props.players.every(player => 
    player.name && player.number && player.size
  );
  
  if (!isValid) {
    toast.error('请填写所有球员信息');
    return;
  }

  // 获取当前设计的SVG内容
  const design = {
    editSvg: window.world.svgEditor.svgCanvas.getSvgString(),
    mainSvg: document.querySelector('#mainSvgCtn').outerHTML
  };

  // 添加到购物车
  cartStore.addToCart({
    players: props.players,
    price: computeTotalPrice.value,
    productName: '无悔篮球T-shirt',
    design
  });

  // 提示用户
  toast.success('已添加到购物车！');
};
</script>

<style scoped>
/* 样式可以根据需要添加 */
.input-element {
  @apply focus:outline-none block rounded-md bg-darker shadow-md sm:text-sm focus:border-none px-2 py-1;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>