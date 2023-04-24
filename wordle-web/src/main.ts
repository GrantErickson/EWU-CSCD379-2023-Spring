import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { mdi } from 'vuetify/iconsets/mdi'

import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import Axios from 'axios'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi
    }
  }
})

// Setup Axios default URL
if (
  window.location.origin.indexOf('localhost') > -1 ||
  window.location.origin.indexOf('127.0.0.1') > -1
) {
  Axios.defaults.baseURL = 'https://localhost:7278/'
} else {
  Axios.defaults.baseURL = 'https://wordletest2023.azurewebsites.net/'
}

const app = createApp(App)

app.use(vuetify)

app.use(router)

app.mount('#app')
