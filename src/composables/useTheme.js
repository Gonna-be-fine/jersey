/*
 * @Author: chris.c Chris.C@frontop.cn
 * @Date: 2025-09-05 16:46:09
 * @LastEditors: chris.c Chris.C@frontop.cn
 * @LastEditTime: 2025-09-05 16:46:17
 * @FilePath: \layout-starter\src\composables\useTheme.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ref, onMounted } from "vue"

const isDark = ref(false)
let initialized = false

// 初始化主题
function initTheme() {
  if (initialized) return
  initialized = true
  
  // 优先从 localStorage 读取保存的主题
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add("dark")
  } else if (savedTheme === 'light') {
    isDark.value = false
    document.documentElement.classList.remove("dark")
  } else {
    // 如果没有保存的主题，则跟随系统主题
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      isDark.value = true
      document.documentElement.classList.add("dark")
    } else {
      isDark.value = false
      document.documentElement.classList.remove("dark")
    }
  }
}

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
      document.documentElement.classList.add("dark")
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem('theme', 'light')
    }
  }

  onMounted(() => {
    initTheme()
  })

  // 如果还没初始化，立即初始化（处理在组件挂载前就被调用的情况）
  if (!initialized) {
    initTheme()
  }

  return { isDark, toggleTheme }
}
