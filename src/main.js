import { createApp } from 'vue'
import './style.css'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';


import App from './App.vue'
import * as THREE from 'three';

library.add(fas);

window.THREE = THREE;
createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')
