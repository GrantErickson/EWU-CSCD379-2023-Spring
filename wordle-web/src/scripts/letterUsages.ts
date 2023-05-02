import { LetterUsage } from './letterUsage'

export class LetterUsages extends Array<LetterUsage> {
  // Allow getting or creating a letter easily.
  getOrAdd(char: string, length: number): LetterUsage {
    let result = this.find((l) => l.char === char)
    if (!result) {
      result = new LetterUsage(char, length!)
      this.push(result)
    }
    return result
  }

  // Allow getting or creating a letter easily.
  get(char: string): LetterUsage {
    const result = this.find((l) => l.char === char)
    if (!result) {
      throw new Error(`Letter ${char} not found`)
    }
    return result
  }

  public clearCurrentCounts() {
    this.forEach((lu) => {
      lu.currentCount = 0
      lu.wasMaxCountFound = false
    })
  }

  public updateOccurrencesFromCurrentCounts() {
    for (const letterUsage of this) {
      if (letterUsage.currentCount !== null) {
        // If we found all the letters set the max
        if (letterUsage.wasMaxCountFound) {
          letterUsage.maximumOccurrences = letterUsage.currentCount
        }
        // Always set the min if we can
        if (
          letterUsage.minimumOccurrences === null ||
          letterUsage.minimumOccurrences < letterUsage.currentCount
        ) {
          letterUsage.minimumOccurrences = letterUsage.currentCount
        }
      }
    }
  }
}
