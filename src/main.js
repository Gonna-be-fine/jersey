import { createApp } from 'vue'
import './style.css'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { MotionPlugin } from '@vueuse/motion'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './components/layout/DefaultLayout.vue'
import * as THREE from 'three';

library.add(fas);

window.THREE = THREE;
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
.use(router)
.component('font-awesome-icon', FontAwesomeIcon)
.use(MotionPlugin)
.use(pinia)
.mount('#app')
