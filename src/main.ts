import { createApp } from 'vue'
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'
import './style/index.less'
import App from './App.vue'

const app = createApp(App)
app.use(TDesign)
app.mount('#app')
