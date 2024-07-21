import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import * as THREE from 'three';

window.THREE = THREE;
createApp(App).mount('#app')
