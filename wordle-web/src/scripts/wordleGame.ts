import { Word } from '@/scripts/word'
import { WordsService } from './wordsService'
import { LetterStatus, Letter } from './letter'

export class WordleGame {
  constructor(secretWord?: string, numberOfGuesses: number = 6) {
    if (!secretWord) secretWord = WordsService.getRandomWord()
    this.numberOfGuesses = numberOfGuesses
    this.restartGame(secretWord)
  }
  guesses = new Array<Word>()
  secretWord = ''
  guessedLetters: Letter[] = []
  numberOfGuesses = 6
  guess!: Word

  // // check length of guess
  //   if (this.letters.length !== secretWord.length) {
  //     console.log('wrong length')
  //     return
  //   }

  /*
             Current
            W   M    C
         W  o   ✘   ✘
  New    M  ✔   o   ✘
         C  ✔   ✔   o
  */
  trackLetter(newLetter: Letter) {
    const currentLetter = this.guessedLetters.find((l) => l.char === newLetter.char)
    if (currentLetter) {
      if (newLetter.status === LetterStatus.Correct) {
        currentLetter.status = LetterStatus.Correct
      } else if (
        newLetter.status === LetterStatus.Misplaced &&
        currentLetter.status !== LetterStatus.Correct
      ) {
        currentLetter.status = LetterStatus.Misplaced
      }
    } else {
      const letter = new Letter(newLetter.char)
      letter.status = newLetter.status

      this.guessedLetters.push(letter)
    }
  }

  restartGame(secretWord: string) {
    this.secretWord = secretWord || WordsService.getRandomWord()
    this.guesses.splice(0)
    // create a word for each guess
    for (let iWord = 0; iWord < this.numberOfGuesses; iWord++) {
      const word = new Word(secretWord.length)
      this.guesses.push(word)
    }
    this.guess = this.guesses[0]
  }

  submitGuess() {
    // put logic to win here.
    this.guess.check(this.secretWord)

    // Update the guessed letters
    for (const letter of this.guess.letters) {
      this.trackLetter(letter)
    }

    const index = this.guesses.indexOf(this.guess)
    if (index < this.guesses.length - 1) {
      this.guess = this.guesses[index + 1]
    } else {
      // The game is over
    }
  }

  availableWords(): string[] {
    const map = this.getLetterMap()
    const availableWords = new Array<string>()

    for (const word of WordsService.allWords()) {
      let isGood = true
      for (const [letter, letterMap] of map) {
        if (!this.mapMatch(letter, letterMap, word)) {
          isGood = false
          break
        }
      }
      if (isGood) availableWords.push(word)
    }
    return availableWords
  }

  mapMatch(letter: string, letterMap: string[], word: string) {
    for (const [index, status] of letterMap.entries()) {
      if (status == 'X') {
        if (word[index] == letter) return false
      } else if (status == 'C') {
        if (word[index] != letter) return false
      }
    }
    return true
  }

  getLetterMap() {
    const letters = new Map<string, string[]>()
    for (const guess of this.guesses) {
      for (const [index, letter] of guess.letters.entries()) {
        if (letter.char === '' || 'abcedfghijklmnopqrstuvwxyz'.indexOf(letter.char) < 0) continue
        if (!letters.has(letter.char)) {
          letters.set(letter.char, ['?', '?', '?', '?', '?'])
        }
        const letterArray = letters.get(letter.char)!
        if (letter.status == LetterStatus.Correct) {
          // If this letter is correct, mark it as correct in the array for this letter
          letterArray[index] = 'C'
          //letters.get(letter.char)!.splice(index, 1, 'O')
        } else if (letter.status == LetterStatus.Misplaced) {
          // Misplaced letters are marked with a X
          letterArray[index] = 'X'
        } else {
          // The value is incorrect
          // If there is already an X, just change this one letter to X
          if (letters.get(letter.char)!.indexOf('X') > -1) {
            letterArray[index] = 'X'
          } else {
            // If the letter is incorrect, replace any unknowns with X
            letterArray.forEach((value, index) => {
              if (value == '?') {
                letterArray[index] = 'X'
              }
            })
          }
        }
      }
    }
    return letters
  }
}
