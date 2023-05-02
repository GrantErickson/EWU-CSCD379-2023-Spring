<template>
  {{ dialog }}

  <WeatherDialog v-model="dialog" :weather="weatherItem!" />

  <v-card @click="openDialog(item)" v-for="item of forecast" :key="item.date" class="ma-1">
    <v-card-title> {{ item.date }} </v-card-title>
    <v-card-subtitle
      >{{ item.temperatureC }}&#8451; {{ item.temperatureF }}&#8457;
    </v-card-subtitle>
    <v-card-text>
      It will be <b>{{ item.summary }}</b>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import Axios from 'axios'
import { ref } from 'vue'
import WeatherDialog from '@/components/WeatherDialog.vue'
import type { Weather } from '@/types/weather'

let dialog = ref(false)

// Hold forecast data to display
const forecast = ref<Weather[]>()

const weatherItem = ref<Weather>()

function openDialog(item: Weather) {
  dialog.value = true
  weatherItem.value = item
}

// Get forecast data
Axios.get('/WeatherForecast')
  .then((response) => {
    console.log(response)
    forecast.value = response.data
  })
  .catch((error) => {
    console.log(error)
  })
</script>
