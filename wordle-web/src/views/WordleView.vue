<template>
  <v-container>
    <v-overlay :model-value="overlay" class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <div class="text-h4 text-center">Wordle Mind Bender</div>

    <GameBoard :game="game" @letterClick="addChar" />

    <v-divider :thickness="5" class="my-5" />

    <GameKeyboard :guessedLetters="game.guessedLetters" @letterClick="addChar" />

    <v-btn @click="checkGuess" @keyup.enter="checkGuess" class="ma-2"> Check </v-btn>
    <v-btn @click="newGame" class="ma-2"> New Game </v-btn>

    <v-card class="my-5">
      <v-card-title
        >Word: [ {{ game.getLetterUsages().summary().correctLetters.join(' ') }} ]</v-card-title
      >
      <v-card-subtitle
        >Wrong: {{ game.getLetterUsages().summary().wrongLetters.join(', ') }}
      </v-card-subtitle>
      <v-card-text>
        <p v-for="item in game.getLetterUsages().summary().misplacedLetters" :key="item.char">
          {{ item.char }}
          [ {{ item.locations.join(' ') }} ] Count: {{ item.count }}
          {{ item.isMaxKnown ? 'Max' : 'Min' }}
        </p>
      </v-card-text>
      <v-card-subtitle>
        <p>
          valid words: {{ game.availableWords().length }} ({{
            game.availableWords().length < 50 ? game.availableWords().join(', ') : ''
          }})
        </p>
      </v-card-subtitle>
    </v-card>
    <p>{{ game.secretWord }}</p>
    {{ game.nextBestGuess() }}
  </v-container>
</template>

<script setup lang="ts">
import { WordleGame } from '@/scripts/wordleGame'
import { ref, reactive } from 'vue'
import GameBoard from '@/components/GameBoard.vue'
import GameKeyboard from '@/components/GameKeyboard.vue'
import { watch, onMounted, onUnmounted } from 'vue'
import { Letter } from '@/scripts/letter'
import Axios from 'axios'
import { WordsService } from '@/scripts/wordsService'

const guess = ref('')
const game = reactive(new WordleGame())
const overlay = ref(true)

function newGame() {
  overlay.value = true
  Axios.get('/api/word')
    .then((response) => {
      setTimeout(() => {
        console.log(response.data)
        game.restartGame(response.data)
        overlay.value = false
        localStorage.setItem('secretWord', response.data)
        console.log(localStorage.getItem('secretWord'))
      }, 500)
    })
    .catch(() => {
      game.restartGame(WordsService.getRandomWord())
      overlay.value = false
    })
}

newGame()

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
