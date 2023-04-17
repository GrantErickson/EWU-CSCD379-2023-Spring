import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import LetterBase from '../LetterBase.vue'

describe('LetterBase', () => {
  it('renders properly', () => {
    const wrapper = mount(LetterBase, { props: { char: 'A', color: 'blue' } })
    // Test content is right
    expect(wrapper.text()).toContain('A')
    // Test color is right
    expect(wrapper.attributes('color')).toBe('blue')
  })
})
