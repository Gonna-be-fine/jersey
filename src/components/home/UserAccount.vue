<template>
  <div class="user-account">
    <div v-if="!isLoggedIn">
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
          :src="userAvatar" 
          :alt="userName"
          class="w-8 h-8 rounded-full"
        >
        <span class="hidden md:block">{{ userName }}</span>
      </button>

      <div 
        v-if="showDropdown"
        class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
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
          @click="logout"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          退出登录
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserAccount',
  data() {
    return {
      isLoggedIn: false,
      showDropdown: false,
      userName: 'John Doe',
      userAvatar: '/images/avatar.jpg'
    }
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    logout() {
      this.isLoggedIn = false
      this.showDropdown = false
      this.$router.push('/login')
    }
  }
}
</script> 