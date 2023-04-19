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
  guessedLetters: Letter[] = [];
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
    const currentLetter = this.guessedLetters.find(l => l.char === newLetter.char);
    if (currentLetter) {
      if (newLetter.status === LetterStatus.Correct) {

        currentLetter.status = LetterStatus.Correct;
      }
      else if (newLetter.status === LetterStatus.Misplaced && currentLetter.status !== LetterStatus.Correct) {
        currentLetter.status = LetterStatus.Misplaced;
      }
    } else {
      const letter = new Letter(newLetter.char);
      letter.status = newLetter.status;

      this.guessedLetters.push(letter);
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
      this.trackLetter(letter);
    }

    const index = this.guesses.indexOf(this.guess)
    if (index < this.guesses.length - 1) {
      this.guess = this.guesses[index + 1]
    } else {
      // The game is over
    }
  }
}
