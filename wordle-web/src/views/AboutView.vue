<template>
  <v-card v-for="item of forecast" :key="item.date" class="ma-1">
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

class Weather {
  date!: string
  temperatureC!: number
  temperatureF!: number
  summary!: string
}

// Hold forecast data to display
const forecast = ref<Weather[]>()

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
