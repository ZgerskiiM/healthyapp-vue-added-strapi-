import App from './App.vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue'
import { router } from './router/router.js'
import './index.scss';
import { vuetify } from '/vuetify.config.js'
 
createApp(App).use(router).use(vuetify).use(createPinia()).mount('#app')
