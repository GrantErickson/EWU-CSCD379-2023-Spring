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

// Get data from https://127.0.0.1:7278/weatherforecast
let forecast = ref(new Array<Weather>())

Axios.get('/weatherforecast')
  .then((response) => {
    console.log(response)
    forecast.value = response.data
  })
  .catch((error) => {
    console.log(error)
  })

//;({ data } = (await Axios.get('https://localhost:7278/api/about'))!)
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
