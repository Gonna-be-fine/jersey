<template>
  <div class="user-account">
    <div v-if="!userStore.isLoggedIn">
      <router-link 
        to="/login"
        class="text-white hover:text-primary transition-colors duration-300"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </router-link>
    </div>

    <div v-else class="relative">
      <button 
        @click="toggleDropdown"
        class="flex items-center space-x-2 text-white hover:text-primary transition-colors duration-300"
      >
        <img 
          :src="userStore.userInfo.avatar || '/images/assets/avatar.png'" 
          :alt="userStore.displayName"
          class="w-8 h-8 rounded-full object-cover"
        >
        <span class="hidden md:block text-ellipsis overflow-hidden max-w-[120px]">
          {{ formatDisplayName(userStore.displayName) }}
        </span>
      </button>

      <div 
        v-if="showDropdown"
        class="text-center absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
      >
        <router-link 
          to="/profile"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          个人资料
        </router-link>
        <router-link 
          to="/orders"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          我的订单
        </router-link>
        <button 
          @click="handleLogout"
          class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          退出登录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/userStore';
import { useToast } from '../../utils/toast';

const router = useRouter();
const userStore = useUserStore();
const toast = useToast();
const showDropdown = ref(false);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// 点击其他地方关闭下拉菜单
const closeDropdown = (e) => {
  if (!e.target.closest('.user-account')) {
    showDropdown.value = false;
  }
};

// 监听点击事件
document.addEventListener('click', closeDropdown);

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});

const handleLogout = async () => {
  try {
    // 可以在这里调用登出API
    // await request.post('/users/logout');
    
    userStore.logout();
    showDropdown.value = false;
    toast.success('已退出登录');
    router.push('/login');
  } catch (error) {
    toast.error('退出登录失败');
  }
};

// 格式化显示名称
const formatDisplayName = (name) => {
  if (!name) return '未登录';
  if (name.includes('@')) {
    // 如果是邮箱，只显示@前面的部分
    return name.split('@')[0];
  }
  // 如果超过10个字符，截断并添加省略号
  return name.length > 10 ? name.slice(0, 10) + '...' : name;
};
</script>

<style scoped>
.user-account {
  position: relative;
}

/* 添加过渡动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.text-ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style> 