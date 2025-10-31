import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import ProductList from '../views/ProductList.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/design/:productId',
    name: 'Design',
    // component: () => import('../_App.vue'),
    component: () => import('../views/Design.vue'),
    props: true
  },
  {
    path: '/products',
    name: 'ProductList',
    component: ProductList
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetail.vue'),
    props: true
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
