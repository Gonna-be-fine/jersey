<template>
  <div
    ref="containerRef"
    class="fixed z-50 cursor-grab"
    :style="{ left: containerPosX + 'px', top: containerPosY + 'px' }"
    @mousedown="startDragContainer"
    @touchstart="startDragContainer"
  >
    <!-- 悬浮球按钮 -->
    <div
      v-if="!isVisible"
      class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300 hover:scale-110"
      @click="handleClickFloatingBall"
    >
      <!-- 新的齿轮图标 -->
      <svg
        class="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        ></path>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        ></path>
      </svg>
    </div>

    <!-- 你的拨盘组件，根据 isVisible 状态显示/隐藏 -->
    <div
      v-if="isVisible"
      class="relative w-48 h-48 flex items-center justify-center bg-gray-900 p-4 rounded-lg shadow-2xl transition-all duration-300 transform scale-100 opacity-100"
    >
      <!-- 关闭按钮 -->
      <button
        @click="toggleVisibility"
        class="absolute top-2 right-2 text-gray-400 hover:text-white focus:outline-none"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>

      <!-- Directional Icons -->
      <div
        @click="setMovement('top')"
        class="absolute top-0 -translate-y-full cursor-pointer p-2 rounded-full bg-dark"
      >
        <svg
          class="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          ></path>
        </svg>
      </div>
      <div
        @click="setMovement('bottom')"
        class="absolute bottom-0 translate-y-full cursor-pointer p-2 rounded-full bg-dark"
      >
        <svg
          class="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          ></path>
        </svg>
      </div>
      <div
        @click="setMovement('left')"
        class="absolute left-0 -translate-x-full cursor-pointer p-2 rounded-full bg-dark"
      >
        <svg
          class="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
      </div>
      <div
        @click="setMovement('right')"
        class="absolute right-0 translate-x-full cursor-pointer p-2 rounded-full bg-dark"
      >
        <svg
          class="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          ></path>
        </svg>
      </div>

      <!-- The Dial -->
      <div
        ref="dial"
        class="relative w-40 h-40 rounded-full bg-gray-800 shadow-lg flex items-center justify-center select-none touch-none"
        @mousedown="startDrag"
        @touchstart="startDrag"
        :style="{ transform: 'rotate(' + rotation + 'deg)' }"
      >
        <!-- Degree Markings (Fixed) -->
        <div
          v-for="degree in degrees"
          :key="degree"
          class="absolute text-gray-400 text-[10px] font-semibold"
          :style="getDegreeMarkStyle(degree)"
        >
          {{ degree }}°
        </div>

        <!-- Center Dot -->
        <div class="absolute w-2 h-2 rounded-full bg-white z-10"></div>

        <!-- Example Icons on the dial (rotate with the dial) -->
        <div
          class="absolute text-xl"
          :style="{
                transform: 'translate(45px, -25px) rotate(' + -rotation + 'deg)',
              }"
        >
          <span
            role="img"
            aria-label="sparkle"
          >✨</span>
        </div>
        <div
          class="absolute text-xl"
          :style="{
                transform: 'translate(-30px, 30px) rotate(' + -rotation + 'deg)',
              }"
        >
          <span
            role="img"
            aria-label="sun"
          >☀️</span>
        </div>
      </div>

      <!-- Needle (Fixed) -->
      <div
        class="absolute left-1/2 w-0.5 h-10 bg-red-500 z-20"
        :style="{ transform: 'translateX(-50%) translateY(-100%)', top: '50%', transformOrigin: 'bottom center' }"
      ></div>

      <!-- Current Rotation Display -->
      <div class="absolute left-1/2 -translate-x-1/2 text-white text-xs mt-8 bg-gray-700 px-2 py-0.5 rounded cursor-pointer">
        <template v-if="!isEditing">
          <span @click="startEdit">{{ 360 - Math.round(currentRotation) }}°</span>
        </template>
        <template v-else>
          <input
            ref="inputRef"
            v-model.number="editValue"
            type="number"
            min="0"
            max="360"
            class="w-12 text-center bg-gray-600 text-white border-none outline-none rounded"
            @blur="finishEdit"
            @keyup.enter="finishEdit"
          />°
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, computed, inject, watch, nextTick } from 'vue';

const editingElement = inject('editingElement');
const modelType = inject('modelType');

// 控制组件显示/隐藏的状态
const isVisible = ref(false);

// 拨盘拖动相关的状态
const dial = ref(null);
const isDragging = ref(false); // 用于拨盘旋转
const startAngle = ref(0);
const startRotation = ref(0);
const rotation = ref(0);

// 悬浮球/容器拖动相关的状态
const containerRef = ref(null);
const isDraggingContainer = ref(false); // 用于悬浮球容器拖动
const hasMovedContainer = ref(false); // 判断悬浮球容器是否发生了移动
const containerPosX = ref(10); // Initial right position
const containerPosY = ref(window.innerHeight - 80); // Initial bottom position
const startClientX = ref(0);
const startClientY = ref(0);

// 增加编辑逻辑
const isEditing = ref(false);
const editValue = ref(0);
const inputRef = ref(null);

watch(
  () => editingElement.value,
  (a, b) => {
    console.log('----', a, b)
    const cloth = window.world.getSvgEditorByType(modelType.value)
    if (!cloth) {
      console.warn('cloth not found')
      return;
    }
    const editEl = cloth.canvas.getObjectById(a.id);
    if (!editEl) {
      console.warn('editEl not found')
      return;
    }
    editValue.value = editEl.angle;
    rotation.value = editEl.angle;
  })

const startEdit = () => {
  isEditing.value = true;
  editValue.value = 360 - Math.round(currentRotation.value);
  nextTick(() => {
    inputRef.value?.focus();
    inputRef.value?.select();
  });
};

const finishEdit = () => {
  isEditing.value = false;
  // 限制输入范围 0–360
  let val = parseFloat(editValue.value);
  if (isNaN(val)) val = 0;
  val = Math.max(0, Math.min(360, val));
  // 转换为内部 rotation（与显示方向相反）
  rotation.value = 360 - val;
};

const setMovement = (type) => {
  const cloth = window.world.getSvgEditorByType(modelType.value)
  if (!cloth) {
    console.warn('cloth not found')
    return;
  }
  const editEl = cloth.canvas.getObjectById(editingElement.value.id);
  if (!editEl) {
    console.warn('editEl not found')
    return;
  }
  let moveX = editEl.left;
  let moveY = editEl.top;
  switch (type) {
    case 'left':
      moveX -= 1;
      break;
    case 'right':
      moveX += 1;
      break;
    case 'top':
      moveY -= 1;
      break;
    case 'bottom':
      moveY += 1;
      break;
  }
  cloth.moveElement(editEl, moveX, moveY);
}

function setRotation (val) {
  const cloth = window.world.getSvgEditorByType(modelType.value)
  if (!cloth) {
    console.warn('cloth not found')
    return;
  }
  const editEl = cloth.canvas.getObjectById(editingElement.value.id);
  if (!editEl) {
    console.warn('editEl not found')
    return;
  }
  console.log('set editEl angle', val)
  // editEl.angle = val
  cloth.rotateElement(editEl, val);

}
// 使用计算属性来处理旋转值的规范化
const currentRotation = computed(() => {
  let normalizedRotation = rotation.value % 360;
  if (normalizedRotation < 0) {
    normalizedRotation += 360;
  }
  setRotation(normalizedRotation)
  return normalizedRotation;
});

const degrees = Array.from({ length: 12 }, (_, i) => i * 30); // 0, 30, 60, ..., 330

const getDegreeMarkStyle = (degree) => {
  const radius = 70; // 刻度标记的半径
  const angleRad = (degree - 90) * (Math.PI / 180); // 调整0°在顶部
  const x = radius * Math.cos(angleRad);
  const y = radius * Math.sin(angleRad);
  return {
    transform: `translate(${x}px, ${y}px)`,
  };
};

const getCenter = (element) => {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
};

// 拨盘拖动事件处理
const startDrag = (event) => {
  // 阻止事件冒泡到父级容器，避免同时触发悬浮球容器的拖动
  event.stopPropagation();
  isDragging.value = true;
  const clientX = event.type.startsWith('mouse') ? event.clientX : event.touches[0].clientX;
  const clientY = event.type.startsWith('mouse') ? event.clientY : event.touches[0].clientY;

  const center = getCenter(dial.value);
  startAngle.value = Math.atan2(clientY - center.y, clientX - center.x) * (180 / Math.PI);
  startRotation.value = rotation.value;

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchmove', onDrag, { passive: false });
  window.addEventListener('touchend', endDrag);
};

const onDrag = (event) => {
  if (!isDragging.value) return;

  if (event.type.startsWith('touch')) {
    event.preventDefault();
  }

  const clientX = event.type.startsWith('mouse')
    ? event.clientX
    : event.touches[0].clientX;
  const clientY = event.type.startsWith('mouse') ? event.clientY : event.touches[0].clientY;

  const center = getCenter(dial.value);
  const currentAngle = Math.atan2(clientY - center.y, clientX - center.x) * (180 / Math.PI);

  let deltaAngle = currentAngle - startAngle.value;

  // 规范化 deltaAngle 到 -180 到 180 度之间
  if (deltaAngle > 180) {
    deltaAngle -= 360;
  } else if (deltaAngle < -180) {
    deltaAngle += 360;
  }

  rotation.value = startRotation.value + deltaAngle;
};

const endDrag = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', endDrag);
  window.removeEventListener('touchmove', onDrag);
  window.removeEventListener('touchend', endDrag);
};

// 悬浮球/容器拖动事件处理
const startDragContainer = (event) => {
  isDraggingContainer.value = true;
  hasMovedContainer.value = false; // 重置移动状态
  startClientX.value = event.type.startsWith('mouse') ? event.clientX : event.touches[0].clientX;
  startClientY.value = event.type.startsWith('mouse') ? event.clientY : event.touches[0].clientY;

  // 获取当前容器的位置，作为拖动的起始点
  const rect = containerRef.value.getBoundingClientRect();
  containerPosX.value = rect.left;
  containerPosY.value = rect.top;

  window.addEventListener('mousemove', onDragContainer);
  window.addEventListener('mouseup', endDragContainer);
  window.addEventListener('touchmove', onDragContainer, { passive: false });
  window.addEventListener('touchend', endDragContainer);
};

const onDragContainer = (event) => {
  if (!isDraggingContainer.value) return;

  if (event.type.startsWith('touch')) {
    event.preventDefault();
  }

  const clientX = event.type.startsWith('mouse') ? event.clientX : event.touches[0].clientX;
  const clientY = event.type.startsWith('mouse') ? event.clientY : event.touches[0].clientY;

  const dx = clientX - startClientX.value;
  const dy = clientY - startClientY.value;

  // 如果移动距离超过一个阈值，则认为是拖动
  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
    hasMovedContainer.value = true;
  }

  let newPosX = containerPosX.value + dx;
  let newPosY = containerPosY.value + dy;

  // 获取容器的当前尺寸（无论是悬浮球还是展开的拨盘）
  const containerWidth = containerRef.value.offsetWidth;
  const containerHeight = containerRef.value.offsetHeight;

  // 限制拖动边界：允许自身一半空间超出屏幕
  newPosX = Math.max(-containerWidth / 2, Math.min(newPosX, window.innerWidth - containerWidth / 2));
  newPosY = Math.max(-containerHeight / 2, Math.min(newPosY, window.innerHeight - containerHeight / 2));

  containerPosX.value = newPosX;
  containerPosY.value = newPosY;

  startClientX.value = clientX;
  startClientY.value = clientY;
};

const endDragContainer = () => {
  isDraggingContainer.value = false;
  window.removeEventListener('mousemove', onDragContainer);
  window.removeEventListener('mouseup', endDragContainer);
  window.removeEventListener('touchmove', onDragContainer);
  window.removeEventListener('touchend', endDragContainer);
};

// 切换显示/隐藏状态的函数
const toggleVisibility = () => {
  isVisible.value = !isVisible.value;
  // 在可见性切换后，确保容器位置在屏幕内，以防尺寸变化导致超出
  nextTick(() => {
    if (containerRef.value) {
      const containerWidth = containerRef.value.offsetWidth;
      const containerHeight = containerRef.value.offsetHeight;
      // 重新应用边界限制
      containerPosX.value = Math.max(-containerWidth / 2, Math.min(containerPosX.value, window.innerWidth - containerWidth / 2));
      containerPosY.value = Math.max(-containerHeight / 2, Math.min(containerPosY.value, window.innerHeight - containerHeight / 2));
    }
  });
};

// 处理悬浮球点击事件，仅在没有拖动时才切换可见性
const handleClickFloatingBall = () => {
  if (!hasMovedContainer.value) {
    toggleVisibility();
  }
};

// 清理事件监听器
onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', endDrag);
  window.removeEventListener('touchmove', onDrag);
  window.removeEventListener('touchend', endDrag);

  window.removeEventListener('mousemove', onDragContainer);
  window.removeEventListener('mouseup', endDragContainer);
  window.removeEventListener('touchmove', onDragContainer);
  window.removeEventListener('touchend', endDragContainer);
});

</script>

<style scoped>
/* Scoped styles for the component */
</style>