import { ref, onMounted, onUnmounted } from 'vue';

// 默认使用 Tailwind CSS 的 lg 断点 (1024px)
const MOBILE_BREAKPOINT = 1024; 

/**
 * 响应式检测当前设备是否为移动端。
 * @returns {object} 包含 isMobile 状态的响应式对象
 */
export function useMobileDetection() {
  // 1. 创建响应式状态
  const isMobile = ref(false);

  // 2. 定义检查逻辑
  const checkIsMobile = () => {
    // 检查窗口宽度是否小于断点
    isMobile.value = window.innerWidth < MOBILE_BREAKPOINT;
  };

  // 3. 在组件挂载时，添加监听器并执行初始检查
  onMounted(() => {
    // 初始检查
    checkIsMobile();
    // 添加窗口大小变化监听
    window.addEventListener('resize', checkIsMobile);
  });

  // 4. 在组件卸载时，移除监听器（自动清理内存）
  onUnmounted(() => {
    window.removeEventListener('resize', checkIsMobile);
  });

  // 5. 返回响应式状态
  return {
    isMobile,
  };
}