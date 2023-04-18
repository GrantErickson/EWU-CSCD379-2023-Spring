<template>
  <v-container>
    <v-card-title class="text-h4 text-center"> Wordle Mind Bender </v-card-title>

    <GameBoard :game="game" @letterClick="addChar" />

    <v-divider :thickness="5" class="my-5" />

    <v-text-field
      v-model="guess"
      label="Guess"
      variant="solo"
      @keydown.prevent="($event:KeyboardEvent) => keyPress($event)"
    ></v-text-field>

    <GameKeyboard :guessedLetters="guessedLetters" @letterClick="addChar" />

    <v-btn @click="checkGuess" @keyup.enter="checkGuess"> Check </v-btn>

    <p>{{ game.secretWord }}</p>
  </v-container>
</template>

<script setup lang="ts">
import { WordleGame } from '@/scripts/wordleGame'
import { ref, reactive } from 'vue'
import GameBoard from '@/components/GameBoard.vue'
import GameKeyboard from '@/components/GameKeyboard.vue'
import { watch, onMounted, onUnmounted } from 'vue'
import { Letter } from '@/scripts/letter'

const guess = ref('')
const game = reactive(new WordleGame())
const guessedLetters = reactive(new Array<Letter>())

console.log(game.secretWord)

onMounted(() => {
  window.addEventListener('keyup', keyPress)
})
onUnmounted(() => {
  window.removeEventListener('keyup', keyPress)
})

watch(
  guess,
  (newGuess, oldGuess) => {
    if (newGuess.length > 5) {
      guess.value = oldGuess || ''
    }
  },
  { flush: 'post' }
)

function checkGuess() {
  // Add guessed letters
  for (const letter of game.guess.letters) {
    guessedLetters.push(letter)
  }

  game.submitGuess()

  guess.value = ''
}

function addChar(letter: Letter) {
  let key = letter.char.toLowerCase()

  guess.value += key
  game.guess.push(key)
}

function keyPress(event: KeyboardEvent) {
  console.log(event.key)
  if (event.key === 'Enter') {
    checkGuess()
  } else if (event.key === 'Backspace') {
    guess.value = guess.value.slice(0, -1)
    game.guess.pop()
    console.log('Back')
  } else if (event.key.length === 1 && event.key !== ' ') {
    addChar(new Letter(event.key))
  }
  //event.preventDefault()
}
</script>
