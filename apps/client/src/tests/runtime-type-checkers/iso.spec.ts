import { checkISOType } from 'src/runtime-type-checkers/iso'

describe('checkISOType', () => {
  it('Should return true if a value type is valid', async () => {
    expect(checkISOType('ru-RU')).toBe(true)
    expect(checkISOType('en-US')).toBe(true)
  })

  it('Should return true if a value type is not valid', async () => {
    expect(checkISOType('en-us')).toBe(false)
    expect(checkISOType('string')).toBe(false)
    expect(checkISOType(1)).toBe(false)
    expect(checkISOType({})).toBe(false)
    expect(checkISOType(null)).toBe(false)
  })
})
