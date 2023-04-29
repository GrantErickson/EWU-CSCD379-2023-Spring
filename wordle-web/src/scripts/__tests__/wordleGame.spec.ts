import { describe, it, expect } from 'vitest'
import { WordleGame } from '@/scripts/wordleGame'
import { Word } from '@/scripts/word'
import { LetterStatus } from '../letter'

describe('WordleGame', () => {
  it('Gets a word', () => {
    const game = new WordleGame()
    expect(game.secretWord).toBeDefined()
  })

  it('Gets empty Letter Map', () => {
    const game = new WordleGame()
    expect(game.guesses).toHaveLength(6)
    expect(game.getLetterMap()).toHaveLength(0)
  })

  it('Gets one Letter Map Correct', () => {
    const game = new WordleGame('apple')
    expect(game.guesses).toHaveLength(6)
    game.guess.text = 'apple'
    game.submitGuess()
    const map = game.getLetterMap()
    expect(map).toHaveLength(4)
    expect(map.get('a')).toEqual(['C', '?', '?', '?', '?'])
    expect(map.get('p')).toEqual(['?', 'C', 'C', '?', '?'])
    expect(map.get('l')).toEqual(['?', '?', '?', 'C', '?'])
    expect(map.get('e')).toEqual(['?', '?', '?', '?', 'C'])
  })

  it('Gets one Letter Map 2', () => {
    const game = new WordleGame('apple')
    expect(game.guesses).toHaveLength(6)
    const word = game.guess
    game.guess.text = 'papap'
    game.submitGuess()
    expect(word.letters[0].status).toBe(LetterStatus.Misplaced) // p
    expect(word.letters[1].status).toBe(LetterStatus.Misplaced) // a
    expect(word.letters[2].status).toBe(LetterStatus.Correct) //   p
    expect(word.letters[3].status).toBe(LetterStatus.Wrong) //     a
    expect(word.letters[4].status).toBe(LetterStatus.Wrong) //     p
    const map = game.getLetterMap()
    expect(map).toHaveLength(2)
    expect(map.get('a')).toEqual(['?', 'X', '?', 'X', '?'])
    expect(map.get('p')).toEqual(['X', '?', 'C', '?', 'X'])
  })

  it('MapMatch Works', () => {
    const game = new WordleGame('apple')
    expect(game.mapMatch('a', ['C', '?', 'X', '?', 'X'], 'apple')).toBe(true)
    expect(game.mapMatch('a', ['?', 'C', 'X', '?', 'X'], 'apple')).toBe(false)
  })

  it('Gets one Letter Map Correct', () => {
    const game = new WordleGame('apple')
    expect(game.guesses).toHaveLength(6)
    game.guess.text = 'apple'
    game.submitGuess()
    expect(game.availableWords()).toHaveLength(1)
  })

  it('Gets one Letter Map Correct', () => {
    const game = new WordleGame('apple')
    expect(game.guesses).toHaveLength(6)
    game.guess.text = 'paper' // MMCMW
    game.submitGuess()
    const map = game.getLetterMap()
    expect(map).toHaveLength(4)
    expect(map.get('p')).toEqual(['X', '?', 'C', '?', '?'])
    expect(map.get('a')).toEqual(['?', 'X', '?', '?', '?'])
    expect(map.get('e')).toEqual(['?', '?', '?', 'X', '?'])
    expect(map.get('r')).toEqual(['X', 'X', 'X', 'X', 'X'])
    console.log(game.availableWords())
    expect(game.availableWords()).toHaveLength(144)
  })

  it('Gets one Letter Map Correct', () => {
    const game = new WordleGame('apple')
    expect(game.guesses).toHaveLength(6)
    game.guess.text = 'paper' // MMCMW
    game.submitGuess()
    game.guess.text = 'stnmb' // MMCMW
    game.submitGuess()
    game.guess.text = 'lppae' // MMCMW
    game.submitGuess()
    const map = game.getLetterMap()
    expect(map).toHaveLength(10)
    expect(map.get('p')).toEqual(['X', 'C', 'C', '?', '?'])
    expect(map.get('a')).toEqual(['?', 'X', '?', 'X', '?'])
    expect(map.get('e')).toEqual(['?', '?', '?', 'X', 'C'])
    expect(map.get('r')).toEqual(['X', 'X', 'X', 'X', 'X'])
    expect(map.get('s')).toEqual(['X', 'X', 'X', 'X', 'X'])
    console.log(game.availableWords())
    expect(game.availableWords()).toHaveLength(1)
  })
})
