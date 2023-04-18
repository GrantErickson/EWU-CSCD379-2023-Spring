<template>
  <v-row
    class="justify-center"
    v-for="(word, rowIndex) in game.guesses"
    :key="`row-${rowIndex}`"
    dense
  >
    <v-col v-for="(letter, colIndex) in word.letters" :key="`col-${colIndex}`" cols="auto">
      <LetterButton :letter="letter" @click="letterClick(letter)" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Letter } from '@/scripts/letter'
import type { WordleGame } from '@/scripts/wordleGame'
import LetterButton from '@/components/LetterButton.vue'

defineProps<{
  game: WordleGame
}>()

const emit = defineEmits<{
  (e: 'letterClick', value: Letter): void
}>()

function letterClick(letter: Letter) {
  emit('letterClick', letter)
}
</script>
