import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { sidebar: false },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { sidebar: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { sidebar: false },
  },
  {
    path: '/design/:productId',
    name: 'Design',
    // component: () => import('../_App.vue'),
    component: () => import('../views/Design.vue'),
    props: true,
    meta: { sidebar: false, sidebarKey: "admin" },
  },
  {
    path: '/products',
    name: 'ProductList',
    component: () => import('../views/ProductList.vue'),
    meta: { sidebar: false, sidebarKey: "admin" },
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetail.vue'),
    props: true,
    meta: { sidebar: false },
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../views/Test.vue'),
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    
    if (to.meta.scrollToTop === false) {
      return {};
    }
    
    return {
      top: 0,
      behavior: 'smooth'
    }
  }
})

export default router
