import { Word } from '@/scripts/word'
import { WordsService } from './wordsService'
import { LetterStatus, Letter } from './letter'
import { LetterUsages } from './letterUsages'

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
  availableWords(testWord?: Word, wordList?: string[]): string[] {
    // Get a letter map which is map of each letter that has been guessed with an array
    // of locations the letter either is absolutely 'C', can't be 'X', or might be '?'.
    const map = this.getLetterUsages(testWord)
    const availableWords = new Array<string>()

    const wordsToCheck = wordList || WordsService.allWords()
    // Iterate over all the possible words
    for (const word of wordsToCheck) {
      // Create a variable to track if this word is valid based on guessed words.
      let isGood = true
      // Iterate over each of the letter maps.
      for (const letterUsage of map) {
        // If the word doesn't match the letter map, mark it as bad and bail from the loop.
        if (!letterUsage.matchWord(word)) {
          isGood = false
          break
        }
      }
      // If the word made it through all the letter maps, add it to the list of available words.
      if (isGood) availableWords.push(word)
    }
    return availableWords
  }

  getLetterUsages(testWord?: Word) {
    // Create an array of each letter that has been guessed with an array of locations
    // the letter either is absolutely 'C', can't be 'X', or might be ' ? '.
    const letterUsages = new LetterUsages()
    const myGuesses = this.guesses.filter((g) => g.isScored)
    if (testWord) myGuesses.push(testWord)
    // Iterate all the guesses
    for (const guess of myGuesses) {
      //console.log(guess.text)
      // Clear the current letter counts for this word
      letterUsages.clearCurrentCounts()
      // Iterate all the letters in the guess
      for (const [index, letter] of guess.letters.entries()) {
        // Make sure the guess is a letter and not blank
        if (letter.char === '') continue
        // If the letter hasn't been added to the array yet, add it with all unknowns
        const letterUsage = letterUsages.getOrAdd(letter.char, this.secretWord.length)
        if (letterUsage.currentCount == null) letterUsage.currentCount = 0
        if (letter.status == LetterStatus.Correct) {
          // If this letter is correct, mark it as correct in the array for this index
          letterUsage.usages[index] = 'C'
          letterUsage.currentCount++
          if (letterUsage.wasMaxCountFound) {
            // If the max count was already found, mark all the unknowns as X
            letterUsage.usages.forEach((value, index) => {
              if (value == '?') {
                letterUsage!.usages[index] = 'X'
              }
            })
          }
        } else if (letter.status == LetterStatus.Misplaced) {
          // Misplaced indexes are marked with a X
          letterUsage.usages[index] = 'X'
          letterUsage.currentCount++
        } else {
          // The value is incorrect
          // If there is already an X in the array that means this letter has been misplaced
          // once already as the result of a misplaced letter. Just change this one index
          // to X because we don't know for sure that this letter is totally wrong in all
          // locations
          if (letterUsage.usages.indexOf('X') > -1) {
            letterUsage.usages[index] = 'X'
          } else {
            // If the letter is incorrect, replace any unknowns with X.
            // Any subsequent correct guesses will override this.
            letterUsage.usages.forEach((value, index) => {
              if (value == '?') {
                letterUsage!.usages[index] = 'X'
              }
            })
          }
          // Is this letter is wrong, we found the max.
          letterUsage.wasMaxCountFound = true
        }
      }
      letterUsages.updateOccurrencesFromCurrentCounts()
    }
    return letterUsages
  }

  nextBestGuess() {
    const availableWords = this.availableWords()
    // Count all the letters in the available words
    const letterCounts = new Map<string, number>()
    'abcedfgihjklmnopqrstuvwxyz'.split('').forEach((char) => letterCounts.set(char, 0))
    for (const word of availableWords) {
      for (const char of word) {
        letterCounts.set(char, letterCounts.get(char)! + 1)
      }
    }

    let bestWord = ''
    let bestWordCount = 0

    if (availableWords.length <= 2) {
      // There is only one or two words left.
      bestWord = 'Guess: ' + availableWords[0]
    } else {
      for (const word of availableWords) {
        let count = 0
        let chars = ''
        for (const char of word) {
          if (chars.indexOf(char) == -1) {
            chars += char
            count += letterCounts.get(char)!
          } else {
            //count += letterCounts.get(char)! * 0.25
          }
        }
        if (bestWordCount < count) {
          bestWord = word
          bestWordCount = count
        }
      }
      bestWord = 'General: ' + bestWord
    }

    return bestWord
  }
}
