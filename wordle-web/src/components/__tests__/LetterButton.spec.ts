import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import LetterButton from '../LetterButton.vue'
import { Letter, LetterStatus } from '@/scripts/letter'

describe('LetterBase', () => {
  it('renders properly default color', () => {
    const letter = new Letter('A')
    const wrapper = mount(LetterButton, { props: { letter: letter } })
    // Test content is right
    expect(wrapper.text()).toContain('A')
    // Test color is right
    expect(wrapper.attributes('color')).toBe('grey')
  })

  it('renders properly set color', () => {
    const letter = new Letter('A')
    letter.status = LetterStatus.Correct
    const wrapper = mount(LetterButton, { props: { letter: letter } })
    // Test content is right
    expect(wrapper.text()).toContain('A')
    // Test color is right
    expect(wrapper.attributes('color')).toBe('green')
  })
})
