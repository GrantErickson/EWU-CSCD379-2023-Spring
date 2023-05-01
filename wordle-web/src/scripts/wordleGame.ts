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

  // Calculate the available words based on the current state of the game
  availableWords(): string[] {
    // Get a letter map which is map of each letter that has been guessed with an array
    // of locations the letter either is absolutely 'C', can't be 'X', or might be '?'.
    const map = this.getLetterMap()
    const availableWords = new Array<string>()

    // Iterate over all the possible words
    for (const word of WordsService.allWords()) {
      // Create a variable to track if this word is valid based on guessed words.
      let isGood = true
      // Iterate over each of the letter maps.
      for (const [letter, letterMap] of map) {
        // If the word doesn't match the letter map, mark it as bad and bail from the loop.
        if (!this.mapMatch(letter, letterMap, word)) {
          isGood = false
          break
        }
      }
      // If the word made it through all the letter maps, add it to the list of available words.
      if (isGood) availableWords.push(word)
    }
    return availableWords
  }

  mapMatch(letter: string, letterMap: string[], word: string) {
    // Iterate over each place in the letter map and compare it to the word.
    // check if all entries are 'X'
    if (letterMap.every((l) => l === 'X')) {
      // If all the entries are 'X', the word must not contain the letter.
      return !word.includes(letter)
    }
    // The letter must appear at least once in the word.
    if (!word.includes(letter)) return false
    for (const [index, status] of letterMap.entries()) {
      if (status == 'X') {
        // If the letter map is an 'X' and the word letter is the same as the letter, fail
        if (word[index] == letter) return false
      } else if (status == 'C') {
        // If the letter map is a 'C' and the word letter is not the same as the letter, fail.
        if (word[index] != letter) return false
      }
      // The ? case is unnecessary because it is the default state.
    }
    return true
  }

  getLetterMap() {
    // Create a map of each letter that has been guessed with an array of locations
    // the letter either is absolutely 'C', can't be 'X', or might be ' ? '.
    const letters = new Map<string, string[]>()
    // Iterate all the guesses
    for (const guess of this.guesses.filter((g) => g.isScored)) {
      console.log(guess.text)
      // Iterate all the letters in the guess
      for (const [index, letter] of guess.letters.entries()) {
        // Make sure the guess is a letter and not blank
        if (letter.char === '') continue
        // If the letter hasn't been added to the map yet, add it with all unknowns
        if (!letters.has(letter.char)) {
          letters.set(letter.char, ['?', '?', '?', '?', '?'])
        }
        // Get the array for this letter
        const letterArray = letters.get(letter.char)!
        if (letter.status == LetterStatus.Correct) {
          // If this letter is correct, mark it as correct in the array for this index
          letterArray[index] = 'C'
        } else if (letter.status == LetterStatus.Misplaced) {
          // Misplaced indexes are marked with a X
          letterArray[index] = 'X'
        } else {
          // The value is incorrect
          // If there is already an X in the array that means this letter has been misplaced
          // once already as the result of a misplaced letter. Just change this one index
          // to X because we don't know for sure that this letter is totally wrong in all
          // locations
          if (letterArray.indexOf('X') > -1) {
            letterArray[index] = 'X'
          } else {
            // If the letter is incorrect, replace any unknowns with X.
            // Any subsequent correct guesses will override this.
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
