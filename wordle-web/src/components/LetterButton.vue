<template>
  <v-btn :color="letter.color" label height="50px" width="50px" outlined class="">
    {{ letter.char.toUpperCase() }}
  </v-btn>
</template>

<script lang="ts" setup>
import type { Letter } from '@/scripts/letter'

defineProps<{
  letter: Letter
}>()
</script>
