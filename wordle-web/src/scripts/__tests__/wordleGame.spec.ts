import { describe, it, expect } from 'vitest'
import { WordleGame } from '@/scripts/wordleGame'
import { LetterStatus } from '../letter'
import { LetterUsage } from '../letterUsage'

describe('WordleGame', () => {
  it('Gets a word', () => {
    const game = new WordleGame()
    expect(game.secretWord).toBeDefined()
  })

  it('Gets empty Letter Map', () => {
    const game = new WordleGame()
    expect(game.guesses).toHaveLength(6)
    expect(game.getLetterUsages()).toHaveLength(0)
  })

  it('Gets one Letter Map Correct', () => {
    const game = new WordleGame('apple')
    expect(game.guesses).toHaveLength(6)
    game.guess.text = 'apple'
    game.submitGuess()
    const map = game.getLetterUsages()
    expect(map).toHaveLength(4)
    expect(map.get('a').usages).toEqual(['C', '?', '?', '?', '?'])
    expect(map.get('p').usages).toEqual(['?', 'C', 'C', '?', '?'])
    expect(map.get('l').usages).toEqual(['?', '?', '?', 'C', '?'])
    expect(map.get('e').usages).toEqual(['?', '?', '?', '?', 'C'])
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
    const map = game.getLetterUsages()
    expect(map).toHaveLength(2)
    expect(map.get('a').usages).toEqual(['?', 'X', '?', 'X', '?'])
    expect(map.get('p').usages).toEqual(['X', '?', 'C', '?', 'X'])
  })

  it('MapMatch Works', () => {
    expect(new LetterUsage('a', ['C', '?', 'X', '?', 'X']).matchWord('apple')).toBe(true)
    expect(new LetterUsage('a', ['?', 'C', 'X', '?', 'X']).matchWord('apple')).toBe(false)
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
    const word = game.guess
    game.guess.text = 'pplpe'
    game.submitGuess()
    expect(word.letters[0].status).toBe(LetterStatus.Misplaced) // p
    expect(word.letters[1].status).toBe(LetterStatus.Correct) //   p
    expect(word.letters[2].status).toBe(LetterStatus.Misplaced) // l
    expect(word.letters[3].status).toBe(LetterStatus.Wrong) //     p
    expect(word.letters[4].status).toBe(LetterStatus.Correct) //   e
    expect(game.availableWords()).toHaveLength(1)
    const map = game.getLetterUsages()
    expect(map).toHaveLength(3)
    expect(map.get('p').usages).toEqual(['X', 'C', '?', 'X', '?'])
    expect(map.get('p').minimumOccurrences).toBe(2)
    expect(map.get('p').maximumOccurrences).toBe(2)
    expect(map.get('l').usages).toEqual(['?', '?', 'X', '?', '?'])
    expect(map.get('l').minimumOccurrences).toBe(1)
    expect(map.get('l').maximumOccurrences).toBe(null)
    expect(map.get('e').usages).toEqual(['?', '?', '?', '?', 'C'])
    expect(map.get('e').minimumOccurrences).toBe(1)
    expect(map.get('e').maximumOccurrences).toBe(null)

    expect(game.availableWords()).toContain('apple')
  })

  it('apple - paper', () => {
    const game = new WordleGame('apple')
    expect(game.guesses).toHaveLength(6)
    game.guess.text = 'paper' // MMCMW
    game.submitGuess()
    const map = game.getLetterUsages()
    expect(map).toHaveLength(4)
    expect(map.get('p').usages).toEqual(['X', '?', 'C', '?', '?'])
    expect(map.get('e').usages).toEqual(['?', '?', '?', 'X', '?'])
    expect(map.get('a').usages).toEqual(['?', 'X', '?', '?', '?'])
    expect(map.get('r').usages).toEqual(['X', 'X', 'X', 'X', 'X'])
    console.log(game.availableWords())
    expect(game.availableWords()).toHaveLength(1)
    expect(game.availableWords()).toContain('apple')
  })

  it('apple - paper, stnmb', () => {
    const game = new WordleGame('apple')
    expect(game.guesses).toHaveLength(6)
    game.guess.text = 'tests'
    game.submitGuess()
    game.guess.text = 'stnmb'
    game.submitGuess()
    game.guess.text = 'aaepe'
    game.submitGuess()
    const map = game.getLetterUsages()
    expect(map).toHaveLength(8)
    //expect(map.get('p').usages).toEqual(['?', 'C', '?', '?', '?'])
    expect(map.get('e').usages).toEqual(['X', 'X', 'X', 'X', 'C'])
    expect(map.get('t').usages).toEqual(['X', 'X', 'X', 'X', 'X'])
    expect(map.get('s').usages).toEqual(['X', 'X', 'X', 'X', 'X'])
    console.log(game.availableWords())
    expect(game.availableWords()).toHaveLength(2)
    expect(game.availableWords()).toContain('apple')
    expect(game.availableWords()).toContain('apode')
  })
})
