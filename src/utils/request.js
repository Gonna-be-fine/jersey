import axios from 'axios';
import { useUserStore } from '../stores/userStore';
import { useToast } from './toast';
import router from '../router';

// 创建axios实例
console.log(process.env.NODE_ENV)
const request = axios.create({
  // 在开发环境使用相对路径，让 Vite 代理处理
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : import.meta.env.VITE_API_URL,
  timeout: 15000,
  withCredentials: true // 允许跨域携带cookie
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    const userStore = useUserStore();
    // 检查token是否存在且未过期
    if (userStore.isLoggedIn) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    } else if (userStore.token) {
      // 如果token存在但已过期，清除用户信息
      userStore.logout();
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => response.data,
  error => {
    const userStore = useUserStore();
    const toast = useToast();

    // 处理token过期情况
    if (error.response?.status === 401) {
      // 清除用户信息
      userStore.logout();
      
      // 如果不是登录页面，则跳转到登录页
      if (router.currentRoute.value.path !== '/login') {
        toast.error('登录已过期，请重新登录');
        router.push({
          path: '/login',
          query: { redirect: router.currentRoute.value.fullPath }
        });
      }
    }

    // 处理其他错误
    const errorMsg = error.response?.data?.message || '网络错误，请稍后重试';
    toast.error(errorMsg);
    return Promise.reject(error.response?.data || { message: errorMsg });
  }
);

export default request; 