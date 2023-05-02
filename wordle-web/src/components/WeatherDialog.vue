<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', false)"
    max-width="500"
  >
    <v-card>
      <v-card-title> {{ weather.date }} </v-card-title>
      <v-card-text>
        <v-icon color="red"> mdi-thermometer </v-icon>
        {{ weather.temperatureC }}&#8451; {{ weather.temperatureF }}&#8457;
      </v-card-text>

      <v-card-text>
        <v-icon :color="weatherVisual.color">{{ weatherVisual.icon }} </v-icon>
        It will be <b>{{ weather.summary }}</b>
      </v-card-text>
      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" text @click="$emit('update:modelValue', false)"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Weather } from '@/types/weather'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  weather: Weather
}>()

const weatherVisual = computed(() => {
  switch (props.weather.summary) {
    case 'Freezing':
      return {
        icon: 'mdi-snowflake',
        color: 'light-blue'
      }
    case 'Bracing':
      return {
        icon: 'mdi-weather-windy',
        color: 'blue-grey'
      }
    case 'Chilly':
      return {
        icon: 'mdi-weather-cloudy',
        color: 'grey'
      }
    case 'Cool':
    case 'Mild':
      return {
        icon: 'mdi-weather-partly-cloudy',
        color: 'blue'
      }
    case 'Warm':
    case 'Balmy':
    case 'Hot':
    case 'Sweltering':
    case 'Scorching':
    default:
      return {
        icon: 'mdi-weather-sunny',
        color: 'amber'
      }
  }
})
</script>
