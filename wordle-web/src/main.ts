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

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme:
      "dark",
    themes: {
      inverse: {
        colors: {
          primary: "#1976d2",
          secondary: "#424242",
          error: "#4CAF50",
          warning: "#ff6d00",
          success: "#F44336"
        },
      },
      dark: {
        colors: {
          primary: "#1976d2",
          secondary: "#424242",
          error: "#F44336",
          warning: "#FFEB3B",
          success: "#4CAF50"
        },
      },
      light: {
        colors: {
          primary: "#1976d2",
          secondary: "#424242",
          error: "#F44336",
          warning: "#ff6d00",
          success: "#4CAF50"
        },
      },
    },
  },
})

const app = createApp(App)

app.use(vuetify)

app.use(router)

app.mount('#app')
