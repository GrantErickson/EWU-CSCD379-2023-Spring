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
    expect(map.get('a')).toEqual(['O', '?', '?', '?', '?'])
    expect(map.get('p')).toEqual(['?', 'O', 'O', '?', '?'])
    expect(map.get('l')).toEqual(['?', '?', '?', 'O', '?'])
    expect(map.get('e')).toEqual(['?', '?', '?', '?', 'O'])
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
    expect(map.get('p')).toEqual(['X', '?', 'O', '?', 'X'])
  })

  it('MapMatch Works', () => {
    const game = new WordleGame('apple')
    expect(game.mapMatch('a', ['O', '?', 'X', '?', 'X'], 'apple')).toBe(true)
    expect(game.mapMatch('a', ['?', 'O', 'X', '?', 'X'], 'apple')).toBe(false)
  })

  it('Gets one Letter Map Correct', () => {
    const game = new WordleGame('apple')
    expect(game.guesses).toHaveLength(6)
    game.guess.text = 'apple'
    game.submitGuess()
    expect(game.availableWords()).toHaveLength(1)
  })
})
