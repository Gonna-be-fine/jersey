import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || {
      id: null,
      email: '',
      nickname: '',
      avatar: ''
    }
  }),
  
  persist: true, // 启用持久化

  getters: {
    isLoggedIn: (state) => !!state.token,
    displayName: (state) => state.userInfo.nickname || state.userInfo.email || '未登录'
  },

  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    },

    logout() {
      this.token = '';
      this.userInfo = {
        id: null,
        email: '',
        nickname: '',
        avatar: ''
      };
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    }
  }
}) 